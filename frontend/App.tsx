
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import UploadedFileView from './components/UploadedFileView';
import ImageViewer from './components/ImageViewer';
import { uploadImage } from './services/imageService';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<'upload' | 'image'>('upload');
  const [imageId, setImageId] = useState<string | null>(null);

  const [theme, setTheme] = useState(() => {
    // Periksa tema di localStorage atau berdasarkan preferensi sistem, cocokkan dengan skrip inline.
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
    // Efek ini menyinkronkan status tema dengan DOM dan localStorage.
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
      } else {
        setView('upload');
        // Jika kita kembali ke '/', reset status uploader
        if (path === '/') {
           handleResetState();
        }
      }
    };
    
    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange(); // Pemeriksaan awal

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
        throw new Error('Tidak bisa mendapatkan ID gambar dari respons API.');
      }

      const newShareUrl = `${window.location.origin}/${id}`;
      setShareUrl(newShareUrl);

      const previewUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setFilePreview(previewUrl);

      window.history.pushState({}, '', `/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui saat mengunggah.');
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

  if (view === 'image' && imageId) {
    return <ImageViewer imageId={imageId} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto px-4 pt-28 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 flex flex-col items-center">
        {!file || !filePreview ? (
          <>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white text-center">Share Images Online</h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-center">Share your images instantly using links</p>
            <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
              Maximum file size: 100MB
            </p>
             {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            <p className="mt-12 text-xs text-slate-400 dark:text-slate-500 text-center max-w-md">
              By sharing your files or using our services, you agree to our Terms of Service and Privacy Policy.
            </p>
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
    </div>
  );
};

export default App;
