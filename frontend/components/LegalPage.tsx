
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LegalPageProps {
  theme: string;
  toggleTheme: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ theme, toggleTheme }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto px-4 pt-28 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 flex flex-col items-center flex-grow">
        <div className="w-full max-w-4xl p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Legal Agreement
          </h1>
          <div className="space-y-6 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Terms of Service</h2>
              <p className="mt-2">
                By using Gmbr ("Service"), you agree to these terms. You are responsible for the content you upload. You must not upload illegal, abusive, or malicious content. We reserve the right to remove any content or terminate accounts that violate these terms without notice. The service is provided "as is" without any warranties.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Privacy Policy</h2>
              <p className="mt-2">
                We value your privacy. This service is designed to be simple and privacy-focused. We do not require user accounts and do not track personal information. Uploaded images are stored securely and are only accessible via their unique URL. We do not sell or share your data or uploaded files with third parties. We may collect anonymous usage data to improve the service. Files may be deleted after a period of inactivity.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
