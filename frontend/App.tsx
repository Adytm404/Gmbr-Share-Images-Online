
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import UploadedFileView from './components/UploadedFileView';
import ImageViewer from './components/ImageViewer';
import Footer from './components/Footer';
import LegalPage from './components/LegalPage';
import { uploadImage } from './services/imageService';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<'upload' | 'image' | 'legal'>('upload');
  const [imageId, setImageId] = useState<string | null>(null);

  const [theme, setTheme] = useState(() => {
    // Check for theme in localStorage or based on system preference, matching the inline script.
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // This effect syncs the theme state with the DOM and localStorage.
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/(\d+)$/);
      if (match && match[1]) {
        setImageId(match[1]);
        setView('image');
      } else if (path === '/legal-agreement') {
        setView('legal');
      } else {
        setView('upload');
        // If we navigate back to '/', reset the uploader state
        if (path === '/') {
           handleResetState();
        }
      }
    };
    
    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange(); // Initial check

    return () => {
        window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    if(filePreview) {
        URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    setShareUrl(null);

    try {
      const responseUrl = await uploadImage(selectedFile);
      const id = responseUrl.split('/').pop();

      if (!id) {
        throw new Error('Could not get image ID from API response.');
      }

      const newShareUrl = `${window.location.origin}/${id}`;
      setShareUrl(newShareUrl);

      const previewUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setFilePreview(previewUrl);

      window.history.pushState({}, '', `/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  }, [filePreview]);

  const handleResetState = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    setError(null);
    setShareUrl(null);
    setIsLoading(false);
  };
  
  const handleResetAndGoHome = () => {
    handleResetState();
    window.history.pushState({}, '', '/');
    setView('upload');
  };

  if (view === 'legal') {
    return <LegalPage theme={theme} toggleTheme={toggleTheme} />;
  }

  if (view === 'image' && imageId) {
    return <ImageViewer imageId={imageId} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto px-4 pt-28 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 flex flex-col items-center flex-grow">
        {!file || !filePreview ? (
          <>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white text-center">Share Images Online</h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-center">Instantly share your images with a link</p>
            <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
              Maximum file size: 100MB
            </p>
            <p className="mt-12 text-xs text-slate-400 dark:text-slate-500 text-center max-w-md">
              By using this service, you agree to our <a href="/legal-agreement" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms &amp; Privacy Policy</a>.
            </p>
             {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </>
        ) : (
          <UploadedFileView
            file={file}
            filePreview={filePreview}
            shareUrl={shareUrl}
            onReset={handleResetAndGoHome}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
