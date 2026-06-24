import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col space-y-8 animate-pulse">
      {/* Welcome Message Skeleton */}
      <div className="flex justify-center">
        <div className="h-6 bg-sub/10 rounded w-48"></div>
      </div>

      {/* Word Display Skeleton */}
      <div className="relative p-2 rounded-xl min-h-[120px] flex flex-wrap gap-x-4 gap-y-3 items-center order-first">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i} 
            className="h-7 bg-sub/10 rounded" 
            style={{ width: `${Math.floor(Math.random() * (80 - 40 + 1) + 40)}px` }}
          ></div>
        ))}
      </div>

      {/* Controls Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 px-2">
        <div className="flex bg-sub/10 rounded-md p-1 space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-12 h-8 bg-sub/10 rounded-sm"></div>
          ))}
        </div>
        <div className="h-8 bg-sub/10 rounded w-20"></div>
      </div>

      {/* Restart Button Skeleton */}
      <div className="flex justify-center">
        <div className="w-12 h-12 bg-sub/10 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
