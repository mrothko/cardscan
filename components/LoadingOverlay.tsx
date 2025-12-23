import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center max-w-xs w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-700 font-medium text-center">{message}</p>
      </div>
    </div>
  );
};