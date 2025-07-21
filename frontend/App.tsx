import React, { useState, useCallback, useEffect } from "react";
import Header from "./components/Header";
import FileUploader from "./components/FileUploader";
import UploadedFileView from "./components/UploadedFileView";
import ImageViewer from "./components/ImageViewer";
import Footer from "./components/Footer";
import LegalPage from "./components/LegalPage";
import ApiPage from "./components/ApiPage";
import { uploadImage } from "./services/imageService";
import AnimatedBackground from "./components/AnimatedBackground";

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [shareUrls, setShareUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<"upload" | "image" | "legal" | "api">(
    "upload",
  );
  const [imageId, setImageId] = useState<string | null>(null);

  const [theme, setTheme] = useState(() => {
    // Check for theme in localStorage or based on system preference, matching the inline script.
    if (typeof window !== "undefined" && window.localStorage) {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    // This effect syncs the theme state with the DOM and localStorage.
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/(\d+)$/);
      if (match && match[1]) {
        setImageId(match[1]);
        setView("image");
      } else if (path === "/legal-agreement") {
        setView("legal");
      } else if (path === "/api") {
        setView("api");
      } else {
        setView("upload");
        // If we navigate back to '/', reset the uploader state
        if (path === "/") {
          handleResetState();
        }
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    handleUrlChange(); // Initial check

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  const handleFileSelect = useCallback(
    async (selectedFiles: File[]) => {
      const validFiles = selectedFiles.filter((file) =>
        file.type.startsWith("image/"),
      );
      if (validFiles.length === 0) {
        setError("Please upload at least one valid image file.");
        return;
      }

      setIsLoading(true);
      setError(null);

      // Reset state before processing new files
      filePreviews.forEach(URL.revokeObjectURL);
      setFiles([]);
      setFilePreviews([]);
      setShareUrls([]);

      try {
        const uploadPromises = validFiles.map((file) => uploadImage(file));
        const responses = await Promise.all(uploadPromises);

        const newFiles: File[] = [];
        const newPreviews: string[] = [];
        const newUrls: string[] = [];
        let firstId: string | null = null;

        responses.forEach((responseUrl, index) => {
          const id = responseUrl.split("/").pop();
          if (id) {
            newUrls.push(`${window.location.origin}/${id}`);
            newFiles.push(validFiles[index]);
            newPreviews.push(URL.createObjectURL(validFiles[index]));
            if (!firstId) {
              firstId = id;
            }
          }
        });

        setFiles(newFiles);
        setFilePreviews(newPreviews);
        setShareUrls(newUrls);

        // Only change URL if one image is uploaded
        if (newUrls.length === 1 && firstId) {
          window.history.pushState({}, "", `/${firstId}`);
        } else if (newUrls.length > 1) {
          // For multiple files, stay on the root
          window.history.pushState({}, "", `/`);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred during upload.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [filePreviews],
  );

  const handleResetState = () => {
    filePreviews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    setFiles([]);
    setFilePreviews([]);
    setError(null);
    setShareUrls([]);
    setIsLoading(false);
  };

  const handleResetAndGoHome = () => {
    handleResetState();
    window.history.pushState({}, "", "/");
    setView("upload");
  };

  if (view === "legal") {
    return <LegalPage theme={theme} toggleTheme={toggleTheme} />;
  }

  if (view === "api") {
    return <ApiPage theme={theme} toggleTheme={toggleTheme} />;
  }

  if (view === "image" && imageId) {
    return <ImageViewer imageId={imageId} />;
  }

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-300">
      <AnimatedBackground />
      <div className="relative z-[1] flex flex-col min-h-screen">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="container mx-auto px-4 pt-28 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 flex flex-col items-center flex-grow">
          {files.length === 0 ? (
            <>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white text-center">
                Share Images Online
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-center">
                Instantly share your images with a link
              </p>
              <FileUploader
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
              />
              <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
                Maximum file size: 100MB
              </p>
              <p className="mt-12 text-xs text-slate-400 dark:text-slate-500 text-center max-w-md">
                By using this service, you agree to our{" "}
                <a
                  href="/legal-agreement"
                  className="underline hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Terms &amp; Privacy Policy
                </a>
                .
              </p>
              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            </>
          ) : (
            <UploadedFileView
              files={files}
              filePreviews={filePreviews}
              shareUrls={shareUrls}
              onReset={handleResetAndGoHome}
            />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
