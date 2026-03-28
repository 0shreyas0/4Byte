import React from 'react';
import { Paperclip, X } from 'lucide-react';

interface FileIndicatorProps {
  fileName: string | null;
  onClear: () => void;
}

export const FileIndicator: React.FC<FileIndicatorProps> = ({ fileName, onClear }) => {
  if (!fileName) return null;

  return (
    <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
      <div className="flex items-center gap-2 text-[10px] font-bold text-primary truncate max-w-[80%]">
        <Paperclip size={12} />
        Context: {fileName}
      </div>
      <button onClick={onClear} className="p-1 hover:bg-primary/20 rounded-full text-primary">
        <X size={12} />
      </button>
    </div>
  );
};
