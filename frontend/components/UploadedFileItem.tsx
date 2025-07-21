import React, { useState, useEffect } from 'react';

interface UploadedFileItemProps {
  file: File;
  filePreview: string;
  shareUrl: string | null;
}

const UploadedFileItem: React.FC<UploadedFileItemProps> = ({ file, filePreview, shareUrl }) => {
  const [copyStatus, setCopyStatus] = useState('Copy Link');
  const [rawCopyStatus, setRawCopyStatus] = useState('Copy Raw');

  const imageId = shareUrl ? shareUrl.split('/').pop() : null;
  const rawImageUrl = imageId ? `https://api.gmbr.web.id/image/${imageId}` : null;

  useEffect(() => {
    let timeoutId: number;
    if (copyStatus === 'Copied!') {
      timeoutId = window.setTimeout(() => {
        setCopyStatus('Copy Link');
      }, 2000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [copyStatus]);

  useEffect(() => {
    let timeoutId: number;
    if (rawCopyStatus === 'Copied!') {
      timeoutId = window.setTimeout(() => {
        setRawCopyStatus('Copy Raw');
      }, 2000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [rawCopyStatus]);

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyStatus('Copied!');
    });
  };

  const handleRawCopy = () => {
    if (!rawImageUrl) return;
    navigator.clipboard.writeText(rawImageUrl).then(() => {
      setRawCopyStatus('Copied!');
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
      <div className="flex items-center justify-center">
        <img src={filePreview} alt={file.name} className="max-h-48 w-auto object-contain rounded-md shadow-md" />
      </div>

      <div className="flex flex-col justify-center">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 break-words">{file.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>

        <div className="mt-4">
          <label htmlFor={`share-link-${imageId}`} className="sr-only">Shareable Link</label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              id={`share-link-${imageId}`}
              readOnly
              value={shareUrl || 'Generating link...'}
              className="flex-1 block w-full rounded-none rounded-l-md border-slate-300 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            />
            <button
              onClick={handleCopy}
              disabled={!shareUrl}
              className="relative inline-flex items-center space-x-2 px-3 py-2 border border-l-0 border-slate-300 dark:border-slate-600 text-sm font-medium rounded-r-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{copyStatus}</span>
            </button>
          </div>
        </div>

        <div className="mt-2">
          <label htmlFor={`raw-link-${imageId}`} className="sr-only">Raw Image URL</label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              id={`raw-link-${imageId}`}
              readOnly
              value={rawImageUrl || 'Generating link...'}
              className="flex-1 block w-full rounded-none rounded-l-md border-slate-300 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            />
            <button
              onClick={handleRawCopy}
              disabled={!rawImageUrl}
              className="relative inline-flex items-center space-x-2 px-3 py-2 border border-l-0 border-slate-300 dark:border-slate-600 text-sm font-medium rounded-r-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{rawCopyStatus}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadedFileItem;
