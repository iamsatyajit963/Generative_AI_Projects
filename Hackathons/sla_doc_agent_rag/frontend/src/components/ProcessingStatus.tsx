import React from 'react';

interface ProcessingStatusProps {
  progress: number;
  documentsCount: number;
}

export default function ProcessingStatus({ progress, documentsCount }: ProcessingStatusProps) {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Processing</span>
        <span className="text-sm text-gray-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {documentsCount} documents uploaded.
        <button className="ml-2 text-purple-600 hover:text-purple-700">View</button>
      </div>
    </div>
  );
}