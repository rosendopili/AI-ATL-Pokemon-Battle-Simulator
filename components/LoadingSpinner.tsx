
import React from 'react';

const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
      <p className="text-xl font-press-start text-yellow-400">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
