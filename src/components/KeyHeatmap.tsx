import React from 'react';

interface KeyHeatmapProps {
  keyMap: Record<string, { correct: number; incorrect: number }>;
}

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const KeyHeatmap: React.FC<KeyHeatmapProps> = ({ keyMap }) => {
  const getKeyColor = (char: string) => {
    const data = keyMap[char];
    if (!data) return 'bg-sub/5 text-sub/40';

    const total = data.correct + data.incorrect;
    const accuracy = data.correct / total;

    if (accuracy === 1) return 'bg-main text-bg font-bold shadow-[0_0_10px_rgba(var(--main-color),0.3)]';
    if (accuracy > 0.8) return 'bg-main/60 text-bg font-bold';
    if (accuracy > 0.5) return 'bg-error/40 text-text';
    return 'bg-error text-bg font-bold animate-pulse';
  };

  return (
    <div className="flex flex-col items-center space-y-2 opacity-80 scale-90 md:scale-100">
      <div className="text-[10px] uppercase tracking-[0.2em] text-sub mb-4">Accuracy Heatmap</div>
      {ROWS.map((row, i) => (
        <div 
          key={i} 
          className="flex space-x-1 md:space-x-2"
          style={{ paddingLeft: i === 1 ? '1.5rem' : i === 2 ? '3rem' : '0' }}
        >
          {row.map((key) => (
            <div
              key={key}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center text-xs md:text-sm transition-all duration-500 ${getKeyColor(key)}`}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KeyHeatmap;
