import { useState, useEffect, useCallback, useRef } from 'react';
import { WORDS, CODING_WORDS, FREQUENT_WORDS } from '../constants/words';

export type TestState = 'waiting' | 'active' | 'finished';

export const WORD_CATEGORIES = ['general', 'coding', 'frequent'] as const;
export type WordCategory = typeof WORD_CATEGORIES[number];

interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  spaces: number;
  chartData: { time: number; wpm: number }[];
  keyMap: Record<string, { correct: number; incorrect: number }>;
}

export const useTypingTest = (duration: number = 30, category: WordCategory = 'general') => {
  const [state, setState] = useState<TestState>('waiting');
  const [words, setWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [ghostIndex, setGhostIndex] = useState(0);
  
  // Keep track of typing history without triggering re-renders
  const historyRef = useRef<{ char: string; expected: string; time: number }[]>([]);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    spaces: 0,
    chartData: [],
    keyMap: {},
  });

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const getPB = useCallback(() => {
    const pbs = JSON.parse(localStorage.getItem('typing-pbs') || '{}');
    return pbs[duration] || 0;
  }, [duration]);

  const generateWords = useCallback(() => {
    const wordPool = category === 'coding' ? CODING_WORDS : category === 'frequent' ? FREQUENT_WORDS : WORDS;
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, 500));
  }, [category]);

  useEffect(() => {
    generateWords();
  }, [generateWords]);

  const calculateFinalStats = useCallback(() => {
    const targetText = words.join(' ');
    let correct = 0;
    let incorrect = 0;
    let spaces = 0;
    const keyMap: Record<string, { correct: number; incorrect: number }> = {};
    const chartData: { time: number; wpm: number }[] = [];

    // Simple WPM/Accuracy
    for (let i = 0; i < userInput.length; i++) {
      const char = userInput[i];
      const expected = targetText[i];
      const isCorrect = char === expected;

      if (isCorrect) {
        correct++;
        if (char === ' ') spaces++;
      } else {
        incorrect++;
      }

      // Key Map
      const key = expected?.toLowerCase();
      if (key && /^[a-z0-9]$/.test(key)) {
        if (!keyMap[key]) keyMap[key] = { correct: 0, incorrect: 0 };
        if (isCorrect) keyMap[key].correct++;
        else keyMap[key].incorrect++;
      }
    }

    // Process History for Chart (Bucket by second)
    const durationSec = duration;
    for (let s = 1; s <= durationSec; s++) {
      const charsAtTime = historyRef.current.filter(h => h.time <= s && h.char === h.expected).length;
      const wpmAtTime = Math.round((charsAtTime / 5) / (s / 60));
      chartData.push({ time: s, wpm: wpmAtTime });
    }

    const minutes = duration / 60;
    const wpm = Math.round((correct / 5) / minutes);
    const rawWpm = Math.round((userInput.length / 5) / minutes);
    const accuracy = userInput.length > 0 ? Math.round((correct / userInput.length) * 100) : 0;

    setStats({
      wpm,
      rawWpm,
      accuracy,
      correctChars: correct,
      incorrectChars: incorrect,
      totalChars: userInput.length,
      spaces,
      chartData,
      keyMap
    });

    // Update PB
    const pbs = JSON.parse(localStorage.getItem('typing-pbs') || '{}');
    if (!pbs[duration] || wpm > pbs[duration]) {
      pbs[duration] = wpm;
      localStorage.setItem('typing-pbs', JSON.stringify(pbs));
    }
  }, [userInput, words, duration]);

  const startTest = useCallback(() => {
    setState('active');
    setTimeLeft(duration);
    startTimeRef.current = Date.now();
    historyRef.current = [];
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        const elapsed = duration - (prev - 1);
        const pb = getPB();
        if (pb > 0) {
          setGhostIndex(Math.floor((pb * 5) * (elapsed / 60)));
        }

        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration, getPB]);

  useEffect(() => {
    if (state === 'finished') {
      calculateFinalStats();
    }
  }, [state, calculateFinalStats]);

  const resetTest = useCallback((newDuration?: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const finalDuration = newDuration ?? duration;
    setState('waiting');
    setUserInput('');
    setTimeLeft(finalDuration);
    setGhostIndex(0);
    historyRef.current = [];
    generateWords();
    setStats({ 
      wpm: 0, rawWpm: 0, accuracy: 0, correctChars: 0, incorrectChars: 0, 
      totalChars: 0, spaces: 0, chartData: [], keyMap: {} 
    });
  }, [duration, generateWords]);

  const handleInput = useCallback((char: string, onCorrect?: () => void, onIncorrect?: () => void) => {
    if (state === 'finished') return;
    if (state === 'waiting') startTest();

    const targetText = words.join(' ');
    
    if (char === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
      return;
    }

    if (char.length === 1) {
      const expected = targetText[userInput.length];
      const isCorrect = char === expected;
      
      // Store in history without triggering render
      historyRef.current.push({
        char,
        expected,
        time: (Date.now() - startTimeRef.current) / 1000
      });

      if (isCorrect) onCorrect?.();
      else onIncorrect?.();
      
      setUserInput((prev) => prev + char);
    }
  }, [state, startTest, words, userInput.length]);

  return {
    state,
    words,
    userInput,
    timeLeft,
    ghostIndex,
    stats,
    handleInput,
    resetTest,
    setTimeLeft,
  };
};
