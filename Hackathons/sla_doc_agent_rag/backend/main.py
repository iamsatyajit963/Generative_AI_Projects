from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic_models import QueryInput, QueryResponse, DocumentInfo, DeleteFileRequest, SourceInfo, ExtractFileRequest, ExtractInformation
from langchain_utils import get_rag_chain, get_all_information
from db_utils import insert_application_logs, get_chat_history, get_all_documents, insert_document_record, delete_document_record, check_file_exists
from chroma_utils import index_document_to_chroma, delete_doc_from_chroma
import os
import uuid
import logging
logging.basicConfig(filename='app.log', level=logging.INFO)
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat", response_model=QueryResponse)
def chat(query_input: QueryInput):
    session_id = query_input.session_id
    logging.info(f"Session ID: {session_id}, User Query: {query_input.question}, Model: {query_input.model.value}")
    if not session_id:
        session_id = str(uuid.uuid4())


    chat_history = get_chat_history(session_id)
    logging.info(f"Chat History: {chat_history}")
    rag_chain = get_rag_chain(query_input.model.value)
    logging.info(f"rag_chain {rag_chain}")
    result = rag_chain.invoke({
        "input": query_input.question,
        "chat_history": chat_history
    })
    answer = result["answer"]
    print(f"Keys in result: {result.keys()}")
    sources = result['context']
    # Extract metadata from the context field
    sources = []
    if 'context' in result:
        context_data = result['context']  # List of Document objects
        for document in context_data:
            # Extract metadata
            metadata = document.metadata
            source_info = {
                "source": metadata.get("source", "NA"),
                "page_number": metadata.get("page")
            }
            sources.append(source_info)
    print(sources)
    # Log the extracted sources
    logging.info(f"Extracted Sources: {sources}")
    insert_application_logs(session_id, query_input.question, answer, query_input.model.value)
    logging.info(f"Session ID: {session_id}, AI Response: {answer}, Source: {sources}")
    return QueryResponse(answer=answer, session_id=session_id, model=query_input.model, sources= sources)

from fastapi import UploadFile, File, HTTPException
import os
import shutil

@app.post("/upload-doc")
def upload_and_index_document(file: UploadFile = File(...)):
    allowed_extensions = ['.pdf', '.docx', '.html']
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed types are: {', '.join(allowed_extensions)}")
    
    if check_file_exists(file.filename):
        raise HTTPException(status_code=409, detail=f"A file with the name {file.filename} already exists.")
    
    temp_file_path = f"{file.filename}"
    
    try:
        # Save the uploaded file to a temporary file
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_id = insert_document_record(file.filename)
        success = index_document_to_chroma(temp_file_path, file_id)
        
        if success:
            return {"message": f"File {file.filename} has been successfully uploaded and indexed.", "file_id": file_id}
        else:
            delete_document_record(file_id)
            raise HTTPException(status_code=500, detail=f"Failed to index {file.filename}.")
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.get("/list-docs", response_model=list[DocumentInfo])
def list_documents():
    return get_all_documents()

@app.post("/delete-doc")
def delete_document(request: DeleteFileRequest):
    # Delete from Chroma
    chroma_delete_success = delete_doc_from_chroma(request.file_id)

    if chroma_delete_success:
        # If successfully deleted from Chroma, delete from our database
        db_delete_success = delete_document_record(request.file_id)
        if db_delete_success:
            return {"message": f"Successfully deleted document with file_id {request.file_id} from the system."}
        else:
            return {"error": f"Deleted from Chroma but failed to delete document with file_id {request.file_id} from the database."}
    else:
        return {"error": f"Failed to delete document with file_id {request.file_id} from Chroma."}

@app.post("/extract-info")
def extract_information(request : ExtractFileRequest):
    print("Request came for ", request.model)
    structured_data = get_all_information(request.file_name, request.model)
    print(structured_data)
    return structured_data