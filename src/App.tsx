import { useState, useEffect } from 'react'
import './index.css'
import TypingTest from './components/TypingTest'
import Background from './components/Background'
import { soundManager } from './utils/sounds'

const THEMES = [
  { id: 'serika-dark', name: 'serika dark' },
  { id: 'carbon', name: 'carbon' },
  { id: 'dracula', name: 'dracula' },
  { id: 'nord', name: 'nord' },
];

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'serika-dark';
  });
  const [isAmbientOn, setIsAmbientOn] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    soundManager.updateTheme(theme);
  }, [theme]);

  const toggleMusic = async () => {
    const newState = await soundManager.toggleAmbient(theme);
    setIsAmbientOn(!!newState);
  };

  return (
    <div className="relative min-h-screen text-text font-mono flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <Background />
      <div className="relative z-10 w-full max-w-4xl">
        <header className="mb-6 md:mb-8 flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center space-y-4 w-full text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-main tracking-tight">typing test</h1>
            <div className="flex flex-wrap justify-center items-center gap-2 text-[10px] md:text-xs">
              <div className="flex bg-sub/5 p-1 rounded-lg">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`px-3 py-2 md:py-1 rounded transition-colors ${
                      theme === t.id ? 'bg-main text-bg shadow-sm' : 'text-sub hover:text-text'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
              <div className="w-px h-4 bg-sub/20 mx-1 hidden sm:block"></div>
              <button
                onClick={toggleMusic}
                className={`flex items-center space-x-2 px-3 py-2 md:py-1 rounded-lg transition-colors ${
                  isAmbientOn ? 'bg-main/20 text-main' : 'bg-sub/5 text-sub hover:text-text'
                }`}
                title="Toggle Ambient Music"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-3 md:w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6V11.114A4.369 4.369 0 0015 11c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3z" />
                </svg>
                <span className="text-[10px] uppercase tracking-wider font-bold">{isAmbientOn ? 'Zen On' : 'Zen Off'}</span>
              </button>
            </div>
          </div>
        </header>
        
        <main className="w-full">
          <TypingTest />
        </main>
        
        <footer className="mt-8 md:mt-12 text-xs md:text-sm text-sub flex flex-col items-center space-y-4 text-center">
          <div className="opacity-30 hover:opacity-100 transition-opacity duration-500">inspired by monkeytype</div>
          <div className="hidden sm:flex space-x-6 text-[10px] uppercase tracking-widest text-sub/40">
            <span><kbd className="bg-sub/10 px-1.5 py-0.5 rounded text-sub/60 font-sans border border-sub/20">tab</kbd> - restart</span>
            <span><kbd className="bg-sub/10 px-1.5 py-0.5 rounded text-sub/60 font-sans border border-sub/20">any key</kbd> - start</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
