import React, { useCallback, useState } from "react";
import { useFiles } from "../contexts/FileContext";
import { Upload } from "lucide-react";
import ProcessingStatus from "./ProcessingStatus";
import axios from "axios";
import { DotsLoader } from "./Loader";

export default function FileUpload() {
  const { uploadDocuments,loadingUpload } = useFiles();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [documentsCount, setDocumentsCount] = useState(0);

 

  const simulateProcessing = async (files: File[]) => {
    // Simulate some progress for UI demo purposes:
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProgress(i);
    }
    // Call your real upload API:
   
    // Process them in your context if needed:
    await uploadDocuments(files);
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      setIsProcessing(true);
      setDocumentsCount(files.length);

      await simulateProcessing(files);
      setIsProcessing(false);
    },
    [uploadDocuments]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      setIsProcessing(true);
      setDocumentsCount(files.length);

      await simulateProcessing(files);
      setIsProcessing(false);
    },
    [uploadDocuments]
  );

  if (loadingUpload) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Uploading files, please wait<span><DotsLoader/></span></p>
      </div>
    );
  }
  return (
    <div>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop or{" "}
          <label className="text-purple-600 hover:text-purple-700 cursor-pointer">
            choose files
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx"
            />
          </label>
        </p>
      </div>

      {isProcessing && (
        <ProcessingStatus progress={progress} documentsCount={documentsCount} />
      )}
    </div>
  );
}
