'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  accept: string;
  onUpload: (file: File) => void;
  isLoading: boolean;
  icon?: React.ReactNode;
  label?: string;
}

export default function UploadZone({
  accept,
  onUpload,
  isLoading,
  icon = <Upload className="w-12 h-12" />,
  label = 'Drop your files here'
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all',
        'hover:border-primary hover:bg-primary/5',
        isDragging && 'border-primary bg-primary/10',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />

      {isLoading ? (
        <>
          <Loader className="w-12 h-12 mx-auto mb-4 text-accent animate-spin" />
          <p className="text-sm text-muted-foreground">Analyzing your file...</p>
        </>
      ) : (
        <>
          <div className="text-primary mb-4 flex justify-center">
            {icon}
          </div>
          <h3 className="font-semibold mb-2">{label}</h3>
          <p className="text-sm text-muted-foreground">or click to select file</p>
        </>
      )}
    </div>
  );
}
