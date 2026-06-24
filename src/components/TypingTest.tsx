import React, { useEffect, useRef, useState } from 'react';
import { useTypingTest } from '../hooks/useTypingTest';
import type { WordCategory } from '../hooks/useTypingTest';
import WordDisplay from './WordDisplay';
import LoadingSkeleton from './LoadingSkeleton';
import KeyHeatmap from './KeyHeatmap';
import { soundManager } from '../utils/sounds';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TypingTest: React.FC = () => {
  const [duration, setDuration] = useState(30);
  const [category, setCategory] = useState<WordCategory>('general');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pbs, setPbs] = useState<Record<number, number>>({});

  const {
    state,
    words,
    userInput,
    timeLeft,
    ghostIndex,
    stats,
    handleInput,
    resetTest,
  } = useTypingTest(duration, category);

  useEffect(() => {
    const storedPbs = JSON.parse(localStorage.getItem('typing-pbs') || '{}');
    setPbs(storedPbs);
  }, [state]);

  useEffect(() => {
    if (words.length > 0) {
      setIsLoading(false);
    }
  }, [words]);

  useEffect(() => {
    // Initial focus
    inputRef.current?.focus();

    const handleClick = () => {
      inputRef.current?.focus();
      soundManager.resume();
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const changeDuration = (newDur: number) => {
    setIsLoading(true);
    soundManager.resume();
    setDuration(newDur);
    resetTest(newDur);
    inputRef.current?.focus();
  };

  const changeCategory = (newCat: WordCategory) => {
    setIsLoading(true);
    soundManager.resume();
    setCategory(newCat);
    resetTest(duration);
    inputRef.current?.focus();
  };

  const handleRestart = () => {
    setIsLoading(true);
    soundManager.resume();
    resetTest();
    inputRef.current?.focus();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const lastChar = value[value.length - 1];
    
    if (value.length < userInput.length) {
      handleInput('Backspace');
    } else if (lastChar) {
      soundManager.resume();
      handleInput(lastChar, 
        () => soundEnabled && soundManager.playClick('correct'),
        () => soundEnabled && soundManager.playClick('incorrect')
      );
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleRestart();
    }
  };

  const getJoke = (wpm: number, acc: number) => {
    const jokes = {
      none: [
        "Did you even start? Or did you just come for the aesthetic?",
        "Keyboard: 'Am I a joke to you?'",
        "Loading typing skills... 0% complete.",
        "AFK or just very, very patient?"
      ],
      lowAcc: [
        "You're typing faster than your brain can think. Slow down, speedy!",
        "Blazing fast! Too bad your accuracy looks like a shotgun blast.",
        "Accuracy is optional today, I see.",
        "Are you trying to type or are you just fighting your keyboard?"
      ],
      elbows: [
        "Are you typing with your elbows? No judgment, just curious.",
        "Is that a snail I see passing you by?",
        "Taking it slow... like, glacial slow.",
        "You're making the turtle look like a Ferrari."
      ],
      potato: [
        "Decent speed for a very talented potato.",
        "You type like someone who's afraid of their keyboard.",
        "I've seen cats walk across keyboards faster than this.",
        "The keys won't bite, I promise."
      ],
      average: [
        "The average office worker is shaking in their boots right now.",
        "You're the personification of 'good enough'.",
        "Not fast, not slow. You are the human version of lukewarm water.",
        "Steady as she goes. Boring, but steady."
      ],
      pro: [
        "Okay, calm down, we get it—you're the main character.",
        "Your keyboard is asking for a raise after that performance.",
        "I can hear the keys screaming from here.",
        "Someone's had their coffee today!"
      ],
      telekinetic: [
        "Are your fingers even touching the keys or are you using telekinesis?",
        "I'm pretty sure you just broke the sound barrier.",
        "Your fingers are moving so fast they're starting to blur.",
        "Error: Typing speed exceeds human limits."
      ],
      hacker: [
        "We found the hacker. Someone call the FBI.",
        "Matrix detected. Are you the One?",
        "Stop it. You're making the rest of us look bad.",
        "Do you even blink, or is that also a waste of WPM?"
      ],
      default: [
        "Not bad! Even your keyboard is impressed.",
        "Solid effort. Your high school typing teacher would be proud.",
        "You've got rhythm. Not a good rhythm, but a rhythm.",
        "I've seen worse. Much worse."
      ]
    };

    let category: keyof typeof jokes = 'default';
    
    if (wpm === 0) category = 'none';
    else if (acc < 60) category = 'lowAcc';
    else if (wpm < 25) category = 'elbows';
    else if (wpm < 45) category = 'potato';
    else if (wpm < 65) category = 'average';
    else if (wpm < 85) category = 'pro';
    else if (wpm < 110) category = 'telekinetic';
    else if (wpm >= 110 && acc >= 95) category = 'hacker';
    else if (wpm >= 110) category = 'lowAcc';

    const selectedCategory = jokes[category];
    return selectedCategory[Math.floor(Math.random() * selectedCategory.length)];
  };

  const getWelcomeMessage = () => {
    const welcomes = [
      "Ready to break some keys?",
      "Your keyboard is waiting...",
      "Type to start the chaos.",
      "Show us what you've got!",
      "Focus. Breathe. Type.",
      "Warm up those fingers!",
      "The world's slowest typing test (not really).",
      "Challenge yourself!"
    ];
    return welcomes[Math.floor(Math.random() * welcomes.length)];
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (state === 'finished') {
    const joke = getJoke(stats.wpm, stats.accuracy);
    const pb = pbs[duration] || 0;
    const isNewPb = stats.wpm >= pb && stats.wpm > 0;

    return (
      <div className="flex flex-col items-center space-y-8 animate-slide-up pb-12">
        <div className="text-center px-4">
          <p className="text-main italic text-lg md:text-xl font-medium animate-pulse">"{joke}"</p>
          {isNewPb && (
            <span className="inline-block mt-2 px-3 py-1 bg-main/20 text-main text-xs font-bold rounded-full animate-bounce">
              NEW PERSONAL BEST!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <div className="w-full h-48 md:h-64 bg-sub/5 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={stats.chartData}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--sub-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--main-color)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="wpm" 
                  stroke="var(--main-color)" 
                  strokeWidth={3} 
                  dot={false}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-sub/5 rounded-xl p-4 flex items-center justify-center overflow-hidden">
            <KeyHeatmap keyMap={stats.keyMap} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 items-center w-full">
          <div className="text-center group">
            <div className="text-xl md:text-2xl text-sub transition-colors group-hover:text-main">wpm</div>
            <div className="text-6xl md:text-8xl text-main font-bold tabular-nums leading-none">{stats.wpm}</div>
            <div className="text-xs text-sub mt-1">best: {pb}</div>
          </div>
          <div className="text-center group">
            <div className="text-xl md:text-2xl text-sub transition-colors group-hover:text-main">acc</div>
            <div className="text-6xl md:text-8xl text-main font-bold tabular-nums leading-none">{stats.accuracy}%</div>
          </div>
          <div className="text-center group">
            <div className="text-xl md:text-2xl text-sub transition-colors group-hover:text-main">raw</div>
            <div className="text-6xl md:text-8xl text-main font-bold tabular-nums leading-none opacity-50">{stats.rawWpm}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 w-full px-4">
          <div className="bg-sub/5 p-4 rounded-lg border border-sub/10">
            <div className="text-sub text-[10px] md:text-xs uppercase tracking-wider mb-1">correct</div>
            <div className="text-xl md:text-2xl text-text font-bold">{stats.correctChars}</div>
          </div>
          <div className="bg-sub/5 p-4 rounded-lg border border-sub/10">
            <div className="text-sub text-[10px] md:text-xs uppercase tracking-wider mb-1">incorrect</div>
            <div className="text-xl md:text-2xl text-error font-bold">{stats.incorrectChars}</div>
          </div>
          <div className="bg-sub/5 p-4 rounded-lg border border-sub/10">
            <div className="text-sub text-[10px] md:text-xs uppercase tracking-wider mb-1">total</div>
            <div className="text-xl md:text-2xl text-text font-bold">{stats.totalChars}</div>
          </div>
          <div className="bg-sub/5 p-4 rounded-lg border border-sub/10">
            <div className="text-sub text-[10px] md:text-xs uppercase tracking-wider mb-1">spaces</div>
            <div className="text-xl md:text-2xl text-text font-bold">{stats.spaces}</div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6 w-full max-w-2xl pt-4">
          <div className="w-full bg-sub/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-main h-full transition-all duration-1000 ease-out" 
              style={{ width: `${stats.accuracy}%` }}
            />
          </div>
          <div className="text-sub text-xs italic">
            Accuracy: {stats.accuracy}% based on {stats.totalChars} total characters typed
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="group flex flex-col items-center space-y-2 text-sub hover:text-text transition-colors mt-4"
        >
          <div className="p-3 md:p-4 bg-sub/10 group-hover:bg-sub/20 rounded-full transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          </div>
          <span className="text-sm">Restart (Tab)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col space-y-6 md:space-y-8" onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={userInput}
        autoFocus
        inputMode="text"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
        autoComplete="off"
      />

      {state === 'waiting' && (
        <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700 px-4">
          <p className="text-sub italic text-base md:text-lg">{getWelcomeMessage()}</p>
          <p className="text-sub/40 text-[10px] uppercase tracking-widest mt-2 sm:hidden">Tap anywhere to start</p>
        </div>
      )}
      
      <div className="relative p-2 md:p-4 rounded-xl transition-all duration-500 min-h-[120px] md:min-h-[160px] flex items-center order-first overflow-hidden">
        <WordDisplay words={words} userInput={userInput} ghostIndex={ghostIndex} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 px-2">
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-start">
          <div className="flex bg-sub/10 rounded-md overflow-hidden p-1 w-full sm:w-auto">
            {(['general', 'coding', 'frequent'] as WordCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={(e) => {
                  e.stopPropagation();
                  changeCategory(cat);
                }}
                className={`flex-1 sm:flex-none px-3 py-2 md:py-1 text-[10px] md:text-xs font-bold transition-all duration-200 rounded-sm ${
                  category === cat ? 'text-bg bg-main shadow-sm' : 'text-sub hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSoundEnabled(!soundEnabled);
            }}
            className={`p-2 rounded-md transition-colors ${soundEnabled ? 'text-main bg-main/10' : 'text-sub hover:text-text'}`}
            title={soundEnabled ? 'Disable Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-sub/10 rounded-md overflow-hidden p-1">
            {[10, 15, 30, 60, 120].map((d) => (
              <button
                key={d}
                onClick={(e) => {
                  e.stopPropagation();
                  changeDuration(d);
                }}
                className={`px-3 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold transition-all duration-200 rounded-sm ${
                  duration === d ? 'text-bg bg-main shadow-sm' : 'text-sub hover:text-text'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="text-xl md:text-2xl font-bold text-main tabular-nums flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 text-sub" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRestart();
          }}
          className="p-3 text-sub hover:text-text hover:bg-sub/10 rounded-full transition-all duration-200 group"
          title="Restart (Tab)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-180 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
        </button>
      </div>
    </div>
  );
};

export default TypingTest;
