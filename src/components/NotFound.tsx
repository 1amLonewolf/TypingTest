import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-text font-mono flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center space-y-6 animate-slide-up">
        <h1 className="text-9xl font-bold text-main opacity-20">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-4xl font-bold text-text">Page Not Found</h2>
          <p className="text-sub italic">"Looks like you've typed yourself into a void."</p>
        </div>
        <div className="pt-8">
          <a 
            href="/" 
            className="px-6 py-2 bg-main text-bg rounded font-bold hover:opacity-90 transition-all inline-block"
          >
            Back to Safety
          </a>
        </div>
      </div>
      <footer className="mt-20 text-xs text-sub opacity-50">
        Error 404: The keyboard is silent here.
      </footer>
    </div>
  );
};

export default NotFound;
