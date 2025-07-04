
import React, { useState, useEffect } from 'react';

interface UploadedFileViewProps {
  file: File;
  filePreview: string;
  shareUrl: string | null;
  onReset: () => void;
}

const UploadedFileView: React.FC<UploadedFileViewProps> = ({ file, filePreview, shareUrl, onReset }) => {
  const [copyStatus, setCopyStatus] = useState('Copy Link');
  const [rawCopyStatus, setRawCopyStatus] = useState('Copy Link');
  
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
        setRawCopyStatus('Copy Link');
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
    <div className="w-full max-w-4xl bg-white dark:bg-slate-800/50 rounded-lg p-4 sm:p-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <img src={filePreview} alt={file.name} className="max-h-[60vh] w-auto object-contain rounded-md shadow-lg" />
            </div>

            {/* Details and Actions */}
            <div className="flex flex-col justify-center py-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 break-words">{file.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                
                {/* Share Link */}
                <div className="mt-6">
                    <label htmlFor="share-link" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Shareable Link</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            id="share-link"
                            readOnly
                            value={shareUrl || 'Generating link...'}
                            className="flex-1 block w-full rounded-none rounded-l-md border-slate-300 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        />
                        <button
                            onClick={handleCopy}
                            disabled={!shareUrl}
                            className="relative inline-flex items-center space-x-2 px-4 py-2 border border-l-0 border-slate-300 dark:border-slate-600 text-sm font-medium rounded-r-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                        >
                            <i className="fa-regular fa-copy text-slate-500 dark:text-slate-400" aria-hidden="true"></i>
                            <span>{copyStatus}</span>
                        </button>
                    </div>
                </div>

                {/* Raw Image URL */}
                <div className="mt-4">
                    <label htmlFor="raw-image-link" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Raw Image URL</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            id="raw-image-link"
                            readOnly
                            value={rawImageUrl || 'Generating link...'}
                            className="flex-1 block w-full rounded-none rounded-l-md border-slate-300 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        />
                        <button
                            onClick={handleRawCopy}
                            disabled={!rawImageUrl}
                            className="relative inline-flex items-center space-x-2 px-4 py-2 border border-l-0 border-slate-300 dark:border-slate-600 text-sm font-medium rounded-r-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                        >
                            <i className="fa-regular fa-copy text-slate-500 dark:text-slate-400" aria-hidden="true"></i>
                            <span>{rawCopyStatus}</span>
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8">
                    <button
                        onClick={onReset}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                    >
                        Upload Another File
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default UploadedFileView;
