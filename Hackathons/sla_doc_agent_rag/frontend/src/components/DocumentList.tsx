import React, { useEffect } from 'react';
import { useFiles } from '../contexts/FileContext';
import { Search, FileText } from 'lucide-react';
// import { Loader } from './Loader';

export default function DocumentList() {
  const { 
    filteredDocuments, 
    selectDocument, 
    searchDocuments, 
    fetchDocuments, 
    loadingFetch,
    selectedDocumentId 
  } = useFiles();
  
  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search SLAs..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => searchDocuments(e.target.value)}
          />
        </div>
      </div>
      {loadingFetch ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '1rem', justifyContent: 'center', width: '100%' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Loading documents</span>
          {/* <Loader /> */}
        </div>
      ) : (
        <div className="divide-y max-h-96 overflow-y-auto">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center ${
                selectedDocumentId === doc.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => selectDocument(doc)}
            >
              <FileText className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{doc.filename}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}