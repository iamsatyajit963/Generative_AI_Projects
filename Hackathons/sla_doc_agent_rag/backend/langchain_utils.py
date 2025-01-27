import json

from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from typing import List
from langchain_core.documents import Document
import os
from chroma_utils import vectorstore
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from pydantic_models import ExtractInformation
from langchain_ollama import OllamaEmbeddings, OllamaLLM
import re

retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

output_parser = StrOutputParser()

# Set up prompts and chains
contextualize_q_system_prompt = (
    "Given a chat history and the latest user question "
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, "
    "just reformulate it if needed and otherwise return it as is."
)

contextualize_q_prompt = ChatPromptTemplate.from_messages([
    ("system", contextualize_q_system_prompt),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
])

qa_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant. Use the following context to answer the user's question or tell about the same that you have found from the document(s)."),
    ("system", "Context: {context}"),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

def get_rag_chain(model="gpt-4o-mini"):
    if model == "gpt-4o-mini" or model == "gpt-4o":
        llm = ChatOpenAI(model=model)
    else:
        llm = ChatOllama(model=model)

    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)    
    return rag_chain


def format_docs(docs):
    """
    Format a list of Document objects into a single string.

    :param docs: A list of Document objects

    :return: A string containing the text of all the documents joined by two newlines
    """
    return "\n\n".join(doc.page_content for doc in docs)

# Prompt template
PROMPT_TEMPLATE = """
You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer
the question. If you don't know the answer, say that you
don't know. DON'T MAKE UP ANYTHING.

{context}

---

Answer the question based on the above context: {question}
"""

def get_all_information(file_name:str, model="gpt-4o-mini"):
    if model == "gpt-4o-mini" or model == "gpt-4o":
        llm = ChatOpenAI(model=model)
    else:
        llm = ChatOllama(model=model)
    vs_retriever = vectorstore.as_retriever(search_type = "similarity")    
    formatted_context = vs_retriever.get_relevant_documents(file_name)

    formatted_context = format_docs(formatted_context)

    prompt ="""Extract the following details from all SLA (Service Level Agreement) documents mentioned in the provided text. For each SLA document:
    	1.	sla_name: The title of the SLA document or the name identifying it.
    	2.	parties_involved: All entities (e.g., companies, departments, teams, individuals) bound by the agreement.
    	3.	parties_involved: The system(s), service(s), or technology the SLA pertains to.
    	4.	description: A concise explanation of what the SLA document covers (e.g., its purpose, objectives, or scope).
    	5.	associated_metrics: Performance or service metrics explicitly stated in the SLA (e.g., uptime, response times, throughput).
    	6.	page_number: If applicable, the page number or section where the SLA details are found. Ensure the extracted information is presented clearly and organized by each SLA document.
      7. Return the result in json format.
        """
    if model == "gpt-4o-mini" or model == "gpt-4o":
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        info_rag_chain = (
                {
                    "context": RunnableLambda(lambda _: formatted_context),
                    "question": RunnablePassthrough()
                }
                | prompt_template
                | llm.with_structured_output(ExtractInformation)
        )
        return info_rag_chain.invoke(prompt)
    else:
        ollamaMessage = [("system", prompt), ("human", formatted_context)]
        ans = llm.invoke(ollamaMessage)
        pattern = r'```(.*?)```'
        matches = re.findall(pattern,ans.content,re.DOTALL)


    testStr = matches[0].replace("json", "")
    testStr = testStr.replace("Not Mentioned", '"'+'"')

    final_result = {"docs_info" : json.loads(testStr)}
    return final_result
    

