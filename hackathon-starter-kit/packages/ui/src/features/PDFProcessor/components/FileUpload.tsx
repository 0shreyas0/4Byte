import React from 'react';
import { FileUp } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange }) => {
  return (
    <div className="relative group">
      <input
        type="file"
        accept=".pdf"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="border-2 border-dashed border-border group-hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-muted/20">
        <FileUp className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-xs font-medium text-muted-foreground">
          {file ? file.name : "Click or drag PDF here"}
        </span>
      </div>
    </div>
  );
};
