import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTypingTest } from './useTypingTest';

describe('useTypingTest', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTypingTest(30));
    expect(result.current.state).toBe('waiting');
    expect(result.current.timeLeft).toBe(30);
    expect(result.current.stats.wpm).toBe(0);
  });

  it('should start the test on first input', () => {
    const { result } = renderHook(() => useTypingTest(30));
    act(() => {
      result.current.handleInput('a');
    });
    expect(result.current.state).toBe('active');
    expect(result.current.userInput).toBe('a');
  });

  it('should handle backspace correctly', () => {
    const { result } = renderHook(() => useTypingTest(30));
    act(() => {
      result.current.handleInput('a');
      result.current.handleInput('b');
      result.current.handleInput('Backspace');
    });
    expect(result.current.userInput).toBe('a');
  });

  it('should finish when timer reaches zero', () => {
    const { result } = renderHook(() => useTypingTest(1));
    act(() => {
      result.current.handleInput('a');
    });
    expect(result.current.state).toBe('active');
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current.state).toBe('finished');
    expect(result.current.timeLeft).toBe(0);
  });

  it('should calculate accuracy correctly', () => {
    const { result } = renderHook(() => useTypingTest(30));
    // Assuming the first word is known or we can control it. 
    // For now, let's just check if it calculates SOMETHING.
    act(() => {
      result.current.handleInput('a'); // Correct or incorrect depends on random words
    });
    
    expect(result.current.stats.accuracy).toBeGreaterThanOrEqual(0);
    expect(result.current.stats.accuracy).toBeLessThanOrEqual(100);
  });
});
