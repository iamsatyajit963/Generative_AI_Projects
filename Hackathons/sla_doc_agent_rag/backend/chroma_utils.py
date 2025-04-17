import io
import re

import fitz
import pytesseract
from PIL import Image
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, UnstructuredHTMLLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from typing import List
from langchain_core.documents import Document
import os

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200, length_function=len)
embedding_function = OpenAIEmbeddings()
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embedding_function)

def create_chroma_document(text: str, page_number: int, source: str):
    return {
        "ids": [f"doc_{page_number}"],
        "documents": [text],
        "metadatas": [{"page_number": page_number, "source": source}],
        "metadata": [{"page_number": page_number, "source": source}]
    }

def process_pdf_with_without_image(pdf_file_path):
    pdf_document = fitz.open(pdf_file_path)
    image_list = []
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        images = page.get_images(full=True)
        if images:  # If images are found on the page
            if images not in image_list:
                image_list.append(images)
            documents = []
            page_number = 0
            for images_index, images in enumerate(image_list):
                page_number = page_number + 1
                for img_index, img in enumerate(images):
                    xref = img[0]
                    base_image = pdf_document.extract_image(xref)
                    image_bytes = base_image["image"]
                    image = Image.open(io.BytesIO(image_bytes))
                    document_string = pytesseract.image_to_string(image)
                    document_string = document_string.replace("\n", " ")
                    document_string = re.sub(r"[^\x00-\x7F]+", "", document_string)
                    document_string = re.sub(r'\s+', ' ', document_string).strip()
                    document_string = re.sub(r'\.{2,}', '.', document_string)
                    metadata = {"page_number": page_number, "source": pdf_file_path}
                    documents.append(Document(page_content=document_string, metadata=metadata))
            return text_splitter.split_documents(documents)
        else:
            loader = PyPDFLoader(pdf_file_path)
            documents = loader.load()
            for doc in documents:
                doc.page_content = doc.page_content.replace("\n", " ")
                doc.page_content = re.sub(r"[^\x00-\x7F]+", "",doc.page_content)
                doc.page_content = re.sub(r'\s+', ' ', doc.page_content).strip()
                doc.page_content = re.sub(r'\.{2,}', '.', doc.page_content)

            final_document = text_splitter.split_documents(documents)
            return final_document

def load_and_split_document(file_path: str) -> List[Document]:
    if file_path.endswith('.pdf'):
        return process_pdf_with_without_image(file_path)
    elif file_path.endswith('.docx'):
        loader = Docx2txtLoader(file_path)
    elif file_path.endswith('.html'):
        loader = UnstructuredHTMLLoader(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_path}")
    
    documents = loader.load()
    return text_splitter.split_documents(documents)
    # return None

def index_document_to_chroma(file_path: str, file_id: int) -> bool:
    try:
        splits = load_and_split_document(file_path)
        print("splits", splits)
        # Add metadata to each split
        for split in splits:
            split.metadata['file_id'] = file_id
        
        vectorstore.add_documents(splits)
        # vectorstore.persist()
        return True
    except Exception as e:
        print(f"Error indexing document: {e}")
        return False

def delete_doc_from_chroma(file_id: int):
    try:
        docs = vectorstore.get(where={"file_id": file_id})
        print(f"Found {len(docs['ids'])} document chunks for file_id {file_id}")
        
        vectorstore._collection.delete(where={"file_id": file_id})
        print(f"Deleted all documents with file_id {file_id}")
        
        return True
    except Exception as e:
        print(f"Error deleting document with file_id {file_id} from Chroma: {str(e)}")
        return False
