import React, { useState, useRef, useCallback, useEffect } from "react";

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        const files: File[] = [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
            const file = items[i].getAsFile();
            if (file) {
              files.push(file);
            }
          }
        }
        if (files.length > 0) {
          onFileSelect(files);
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [onFileSelect]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(Array.from(event.target.files));
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileSelect(Array.from(e.dataTransfer.files));
        e.dataTransfer.clearData();
      }
    },
    [onFileSelect],
  );

  const dropzoneClasses = `mt-8 w-full max-w-2xl p-8 sm:p-16 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/50" : "border-slate-300 dark:border-slate-700"}`;

  return (
    <div
      className={dropzoneClasses}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <i
          className="fa-solid fa-file-image fa-4x mx-auto text-blue-300 dark:text-blue-800"
          aria-hidden="true"
        ></i>
        <button
          onClick={handleButtonClick}
          disabled={isLoading}
          className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              Uploading...
            </>
          ) : (
            "Choose Image(s)"
          )}
        </button>
        <p className="mt-4 text-slate-500 dark:text-slate-400">
          or, drop file(s) here or paste from clipboard
        </p>
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          multiple
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default FileUploader;
