import { useFiles } from '../contexts/FileContext';
import { Download } from 'lucide-react';
import { DotsLoader } from './Loader';

export default function DocumentViewer() {
  const { selectedDocument, loadingSelect, deleteDocument, loadingDelete } = useFiles();
  
  if (loadingSelect) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div>
        <h1 style={{color:"black" }}>Loading document details<span><DotsLoader/></span></h1>
        
        </div>
        
      </div>
    );
  }
  
  if (loadingDelete) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Deleting document </p>
        <span><DotsLoader/></span>
      </div>
    );
  }

  if (!selectedDocument) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Select a SLA to view details</p>
      </div>
    );
  }

  const downloadJSON = () => {
    if (!selectedDocument) return;
    const json = JSON.stringify(selectedDocument, null, 2); // Convert to JSON string
    const blob = new Blob([json], { type: 'application/json' }); // Create a Blob
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
  
    const a = document.createElement('a'); // Create an anchor element
    a.href = url; // Set the href to the Blob URL
    a.download = `${selectedDocument[0].filename}.json`; // Set the download attribute
    document.body.appendChild(a); // Append to the body
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Release the Blob URL
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (confirmDelete) {
      deleteDocument(selectedDocument[0].id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="overflow-y-auto max-h-96">
        <pre className="whitespace-pre-wrap text-sm text-gray-900">
          {JSON.stringify(selectedDocument, null, 2)}
        </pre>
      </div>
      <div className="mt-6">
        <button onClick={downloadJSON} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Download JSON
        </button>
        <button onClick={handleDelete} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 hover:bg-red-400 ml-2">
          Delete
        </button>
      </div>
    </div>
  );
}
