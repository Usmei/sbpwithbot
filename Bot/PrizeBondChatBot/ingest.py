import os
import pandas as pd
from dotenv import load_dotenv


from langchain_core.documents import Document
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# -------------------------------
# Load Environment Variables
# -------------------------------
load_dotenv()

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")
CHROMA_DB = os.getenv("CHROMA_DB")

# -------------------------------
# File Paths
# -------------------------------
PDF_FILES = [
    "data/ICFS_Verified_Data_Reference-3.pdf",
    "data/Prize_Bond_QnA_Reference-1.pdf"
]

EXCEL_FILE = "data/Price-bond-BSC-1.xlsx"



print("Current Working Directory:", os.getcwd())
print("Files in data folder:", os.listdir("data"))


# -------------------------------
# Load PDFs
# -------------------------------
def load_pdf_documents():
    documents = []

    for pdf in PDF_FILES:
        loader = PyMuPDFLoader(pdf)
        documents.extend(loader.load())

    return documents


# -------------------------------
# Load Excel
# -------------------------------
def load_excel_documents():

    df = pd.read_excel(EXCEL_FILE)

    documents = []

    for index, row in df.iterrows():

        text = "\n".join(
            [
                f"{column}: {row[column]}"
                for column in df.columns
                if pd.notna(row[column])
            ]
        )

        documents.append(
            Document(
                page_content=text,
                metadata={
                    "source": "excel",
                    "row": index + 1
                }
            )
        )

    return documents


# -------------------------------
# Create Vector DB
# -------------------------------
def create_vector_db():

    print("Loading PDFs...")

    pdf_docs = load_pdf_documents()

    print(f"Loaded {len(pdf_docs)} PDF pages")

    print("Loading Excel...")

    excel_docs = load_excel_documents()

    print(f"Loaded {len(excel_docs)} Excel rows")

    documents = pdf_docs + excel_docs

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    chunks = splitter.split_documents(documents)

    print(f"Created {len(chunks)} chunks")

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL
    )

    
    vectordb = FAISS.from_documents(
    chunks,
    embeddings
    )

    vectordb.save_local("faiss_index")

    print("Vector Database Created Successfully!")

    print(f"Total Chunks: {len(chunks)}")


if __name__ == "__main__":
    create_vector_db()