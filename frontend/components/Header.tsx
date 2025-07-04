
import React from 'react';

interface HeaderProps {
    theme: string;
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2">
              <i className="fa-solid fa-image text-blue-600 text-2xl" aria-hidden="true"></i>
              <span className="font-bold text-xl text-slate-800 dark:text-slate-200">Gmbr</span>
            </a>
            <a href="/legal-agreement" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors hidden sm:block">
                Terms & Privacy
            </a>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a 
              href="https://github.com/google/labs-prototyping-frontend-projects" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub Repository" 
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
               <i className="fa-brands fa-github text-xl"></i>
            </a>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle dark mode"
            >
              <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
