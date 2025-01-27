import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

export interface SLADocumentList {
  id: string;
  filename: string;
}

export interface SingleSLADocument {
  id: string;
  sla_name: string;
  filename: string;
  parties_involved: string;
  system_concerned: string;
  description: string;
  associated_metrics: any[];
  page_bumber: number;
}

interface FileContextType {
  documents: SLADocumentList[];
  selectedDocument: SingleSLADocument[] | null;
  selectedDocumentId: string | null; // Added for highlighting
  selectedModel: string | null;
  uploadDocuments: (files: File[]) => Promise<void>;
  selectDocument: (doc: SLADocumentList) => void;
  searchDocuments: (query: string) => void;
  filteredDocuments: SLADocumentList[];
  fetchDocuments: () => Promise<void>;
  loadingFetch: boolean;
  loadingUpload: boolean;
  loadingSelect: boolean;
  loadingDelete: boolean;
  deleteDocument: (id: string) => Promise<void>;
  setSelectedModel: (model: string | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<SLADocumentList[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<SingleSLADocument[] | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [filteredDocuments, setFilteredDocuments] = useState<SLADocumentList[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>('gpt-4o-mini');

  const fetchDocuments = async () => {
    try {
      setLoadingFetch(true);
      const response = await axios.get('http://127.0.0.1:8000/list-docs');
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingFetch(false);
    }
  };

  const selectDocument = async (doc: SLADocumentList) => {
    setLoadingSelect(true);
    setSelectedDocumentId(doc.id);
    try {
      let requestbody = {
        model: selectedModel,
        file_name: doc.filename
      };
      const response = await axios.post(`http://127.0.0.1:8000/extract-info`, requestbody);
      const data = response?.data?.docs_info;

      const detailedDocs = data.map((item: any) => ({
        id: doc.id,
        filename: doc.filename,
        sla_name: item.sla_name,
        parties_involved: item.parties_involved || 'Sample Company and Customers',
        system_concerned: item.system_concerned || 'Sample System',
        description: item.description || 'This is a detailed description of the SLA document.',
        associated_metrics: item.associated_metrics,
        page_bumber: item.page_bumber,
      }));
      setSelectedDocument(detailedDocs);
    } catch (error) {
      console.error('Error selecting document:', error);
      setSelectedDocumentId(null);
    } finally {
      setLoadingSelect(false);
    }
  };

  const uploadDocuments = async (files: File[]) => {
    setLoadingUpload(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });
      await axios.post('http://127.0.0.1:8000/upload-doc', formData);
      await fetchDocuments();
    } catch (error) {
      console.error('Error uploading documents:', error);
    } finally {
      setLoadingUpload(false);
    }
  };

  // const deleteDocument = async (id: string) => {
  //   try {
  //     setLoadingDelete(true);
  //     await axios.delete(`http://127.0.0.1:8000/delete-doc/${id}`);
  //     await fetchDocuments();
  //     setSelectedDocument(null);
  //     setSelectedDocumentId(null);
  //   } catch (error) {
  //     console.error('Error deleting document:', error);
  //   } finally {
  //     setLoadingDelete(false);
  //   }
  // };
  const deleteDocument = async (id: string) => {
    try {
      setLoadingDelete(true); // Set loading to true before deleting
      let requestbody = {
        file_id: id
      };
      console.log(requestbody, 'requestbody');
      const response = await axios.post(`http://127.0.0.1:8000/delete-doc`, requestbody);
      console.log('Document deleted successfully!', response);
      setSelectedDocument(null);
      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      console.log('Failed to delete the document.');
    } finally {
      setLoadingDelete(false); // Set loading to false after deleting
    }
  };
  const searchDocuments = (query: string) => {
    const filtered = documents.filter(doc =>
      doc.filename.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDocuments(filtered);
  };

  return (
    <FileContext.Provider value={{
      documents,
      selectedDocument,
      selectedDocumentId,
      selectedModel,
      uploadDocuments,
      selectDocument,
      searchDocuments,
      filteredDocuments,
      fetchDocuments,
      loadingFetch,
      loadingUpload,
      loadingSelect,
      loadingDelete,
      deleteDocument,
      setSelectedModel,
    }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
}