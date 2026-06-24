import React, { memo } from 'react';

interface CharacterProps {
  char: string;
  state: 'waiting' | 'correct' | 'incorrect';
  isCurrent: boolean;
  isGhost: boolean;
}

const Character = memo(({ char, state, isCurrent, isGhost }: CharacterProps) => {
  let color = 'inherit';
  if (state === 'correct') color = 'var(--text-color)';
  if (state === 'incorrect') color = 'var(--error-color)';

  return (
    <span
      style={{ color }}
      className={`relative transition-colors duration-75 ${
        isCurrent 
          ? 'after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-[2px] after:h-[1.2em] after:bg-main after:animate-pulse' 
          : ''
      } ${
        isGhost
          ? 'before:content-[""] before:absolute before:left-0 before:bottom-0 before:w-[2px] before:h-[1.2em] before:bg-sub before:opacity-30'
          : ''
      }`}
    >
      {char}
    </span>
  );
});

Character.displayName = 'Character';

interface WordDisplayProps {
  words: string[];
  userInput: string;
  ghostIndex?: number;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ words, userInput, ghostIndex = 0 }) => {
  const targetText = words.join(' ');
  const chars = targetText.split('');

  return (
    <div className="relative text-xl md:text-2xl leading-relaxed select-none break-all text-sub transition-colors duration-300 font-mono">
      {chars.map((char, index) => {
        let state: 'waiting' | 'correct' | 'incorrect' = 'waiting';
        if (index < userInput.length) {
          state = userInput[index] === char ? 'correct' : 'incorrect';
        }

        return (
          <Character
            key={index}
            char={char}
            state={state}
            isCurrent={index === userInput.length}
            isGhost={index === ghostIndex}
          />
        );
      })}
    </div>
  );
};

export default memo(WordDisplay);
