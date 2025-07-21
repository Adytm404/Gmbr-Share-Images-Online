
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';
import FileUploader from './FileUploader';
import { uploadImage } from '../services/imageService';

interface ApiPageProps {
  theme: string;
  toggleTheme: () => void;
}

const ApiPage: React.FC<ApiPageProps> = ({ theme, toggleTheme }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonResponse, setJsonResponse] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setJsonResponse(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setJsonResponse(null);

    try {
      const responseUrl = await uploadImage(file);
      const imageId = responseUrl.split('/').pop();

      if (!imageId) {
        throw new Error('Could not extract image ID from the API response.');
      }
      
      const result = {
        shareable_link: `${window.location.origin}/${imageId}`,
        raw_image_url: `https://api.gmbr.web.id/image/${imageId}`,
      };
      
      setJsonResponse(JSON.stringify(result, null, 2));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  };

  const curlExample = `curl -X POST \\
  -F "file=@/path/to/your/image.jpg" \\
  https://api.gmbr.web.id/upload`;

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-300">
      <AnimatedBackground />
      <div className="relative z-[1] flex flex-col min-h-screen">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="container mx-auto px-4 pt-28 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 flex flex-col items-center flex-grow">
          <div className="w-full max-w-4xl p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              API Documentation
            </h1>
            <div className="space-y-6 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Endpoint</h2>
                <p className="mb-1">You can programmatically upload images by sending a POST request to our API endpoint. The request must be of type <code className="bg-slate-200 dark:bg-slate-700 p-1 rounded-md text-xs">multipart/form-data</code> and include a <code className="bg-slate-200 dark:bg-slate-700 p-1 rounded-md text-xs">file</code> field containing the image data.</p>
                <pre className="bg-slate-200 dark:bg-slate-900 p-3 rounded-md text-slate-800 dark:text-slate-300 text-sm overflow-x-auto"><code>POST https://api.gmbr.web.id/upload</code></pre>
              </div>
               <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">cURL Example</h2>
                <pre className="bg-slate-200 dark:bg-slate-900 p-3 rounded-md text-slate-800 dark:text-slate-300 text-sm overflow-x-auto"><code>{curlExample}</code></pre>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">JSON Response</h2>
                <p>Upon successful upload via the interactive tester below, you will receive a JSON object containing a shareable link to our viewer and a raw URL for direct image access.</p>
              </div>
              <hr className="border-slate-200 dark:border-slate-700 my-8"/>
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">Try the API</h2>
                <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
                {(jsonResponse || error) && (
                  <div className="mt-6 w-full max-w-2xl">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Response</h3>
                    <pre className="bg-slate-200 dark:bg-slate-900 p-4 rounded-md text-sm overflow-x-auto">
                      <code className={error ? 'text-red-500' : 'text-slate-800 dark:text-slate-300'}>
                        {error || jsonResponse}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ApiPage;
