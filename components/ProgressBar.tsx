
import React from 'react';

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const progress = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-gradient-to-r from-accent to-secondary h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
