import React from "react";
import UploadedFileItem from "./UploadedFileItem";

interface UploadedFileViewProps {
  files: File[];
  filePreviews: string[];
  shareUrls: (string | null)[];
  onReset: () => void;
}

const UploadedFileView: React.FC<UploadedFileViewProps> = ({
  files,
  filePreviews,
  shareUrls,
  onReset,
}) => {
  const isSingleFile = files.length === 1;

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-slate-800/50 rounded-lg p-4 sm:p-8 animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">
        {isSingleFile ? "Upload Complete" : "Uploads Complete"}
      </h2>

      <div className="space-y-6">
        {files.map((file, index) => (
          <UploadedFileItem
            key={index}
            file={file}
            filePreview={filePreviews[index]}
            shareUrl={shareUrls[index]}
          />
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={onReset}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Upload More
        </button>
      </div>
    </div>
  );
};

export default UploadedFileView;
