
import React from 'react';
import Footer from './Footer';

interface ImageViewerProps {
  imageId: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageId }) => {
  const imageUrl = `https://api.gmbr.web.id/image/${imageId}`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 p-4 font-sans">
      <div className="fixed top-4 left-4">
         <a href="/" className="flex items-center space-x-2 text-slate-800 dark:text-white opacity-80 hover:opacity-100 transition-opacity">
             <i className="fa-solid fa-image text-blue-600 text-2xl" aria-hidden="true"></i>
             <span className="font-bold text-xl">Gmbr</span>
         </a>
      </div>
      <main className="flex flex-col items-center justify-center flex-grow w-full">
         <img 
            src={imageUrl} 
            alt={`Shared image ${imageId}`} 
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl shadow-black/50"
         />
         <a 
            href="/"
            className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
            Upload Your Own Image
        </a>
      </main>
      <Footer />
    </div>
  );
};

export default ImageViewer;
