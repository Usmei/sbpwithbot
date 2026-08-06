import streamlit as st
from rag import ask_prize_bond_assistant


# ---------------------------------
# Page Configuration
# ---------------------------------

st.set_page_config(
    page_title="SBP Prize Bond Assistant",
    page_icon="🏦",
    layout="centered"
)


# ---------------------------------
# Header
# ---------------------------------

st.title("🏦 SBP Prize Bond Assistant")

st.write(
    "Ask questions related to Premium Prize Bond, "
    "National Prize Bond, purchase, encashment, "
    "claims, tax, and procedures."
)


# ---------------------------------
# Initialize Chat History
# ---------------------------------

if "messages" not in st.session_state:
    st.session_state.messages = []


# ---------------------------------
# Display Previous Messages
# ---------------------------------

for message in st.session_state.messages:

    with st.chat_message(message["role"]):

        st.markdown(
            message["content"]
        )


# ---------------------------------
# User Input
# ---------------------------------

question = st.chat_input(
    "Ask your Prize Bond question..."
)


if question:


    # Show user message

    st.session_state.messages.append(
        {
            "role": "user",
            "content": question
        }
    )


    with st.chat_message("user"):

        st.markdown(question)



    # Assistant response

    with st.chat_message("assistant"):

        with st.spinner(
            "Searching official Prize Bond documents..."
        ):

            result = ask_prize_bond_assistant(
                question
            )


            answer = result["answer"]

            sources = result["sources"]


            st.markdown(answer)


            # Source information

            if sources:

                with st.expander(
                    "📚 Sources"
                ):

                    for source in sources:

                        st.write(
                            f"- {source}"
                        )



    # Save assistant message

    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": answer
        }
    )