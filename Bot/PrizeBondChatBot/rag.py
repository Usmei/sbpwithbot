import os
from dotenv import load_dotenv

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate


# ---------------------------------
# Load Environment Variables
# ---------------------------------

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")
VECTOR_DB = os.getenv("VECTOR_DB")


# ---------------------------------
# Load Embedding Model
# ---------------------------------

embeddings = HuggingFaceEmbeddings(
    model_name=EMBEDDING_MODEL
)


# ---------------------------------
# Load FAISS Vector Database
# ---------------------------------

vector_db = FAISS.load_local(
    VECTOR_DB,
    embeddings,
    allow_dangerous_deserialization=True
)


# ---------------------------------
# Create Retriever
# ---------------------------------

retriever = vector_db.as_retriever(
    search_type="similarity",
    search_kwargs={
        "k": 4
    }
)


# ---------------------------------
# Groq LLM
# ---------------------------------

llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model=MODEL_NAME,
    temperature=0
)


# ---------------------------------
# SBP Prize Bond Prompt
# ---------------------------------

prompt = ChatPromptTemplate.from_template(
"""
You are an SBP Prize Bond Assistant.

Your job is to answer customer questions related to Pakistan Prize Bonds.

STRICT RULES:

1. Answer ONLY using the provided context.
2. Never use your own knowledge.
3. Never guess or create rules.
4. If the answer is not available in the context, reply:

"I couldn't find this information in the official Prize Bond knowledge base."

5. Keep answers simple and customer friendly.
6. If documents are required, provide them as bullet points.
7. If the user asks for a procedure, provide numbered steps.
8. Mention the source category when possible:
   - Premium Prize Bond
   - National Prize Bond
   - Verified Reference
   - Excel Operational Data

9. If multiple documents contain relevant information, combine them.

Context:

{context}


Customer Question:

{question}


Answer:
"""
)


# ---------------------------------
# RAG Function
# ---------------------------------

def ask_prize_bond_assistant(question):

    # Retrieve relevant documents
    docs = retriever.invoke(question)


    # Combine context
    context = "\n\n".join(
        [
            f"Source: {doc.metadata.get('source','Unknown')}\n"
            f"{doc.page_content}"
            for doc in docs
        ]
    )


    # Create prompt
    formatted_prompt = prompt.format(
        context=context,
        question=question
    )


    # Generate answer
    response = llm.invoke(
        formatted_prompt
    )


    # Collect sources
    sources = []

    for doc in docs:
        source = doc.metadata.get(
            "source",
            "Unknown"
        )

        if source not in sources:
            sources.append(source)


    return {
        "answer": response.content,
        "sources": sources
    }



# ---------------------------------
# Testing
# ---------------------------------

if __name__ == "__main__":

    while True:

        question = input("\nAsk Question: ")

        if question.lower() in ["exit", "quit"]:
            break


        result = ask_prize_bond_assistant(
            question
        )


        print("\nAssistant:")
        print(result["answer"])


        print("\nSources:")
        for s in result["sources"]:
            print("-", s)