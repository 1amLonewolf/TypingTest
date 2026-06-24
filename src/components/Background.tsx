import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Center ambient glow - moved to back */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/5 to-bg/10 pointer-events-none" />

      {/* Primary animated orb */}
      <div 
        className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-main/15 blur-[100px] animate-float" 
        style={{ animationDuration: '25s' }}
      />
      
      {/* Secondary animated orb */}
      <div 
        className="absolute bottom-[-15%] right-[-5%] w-[45%] h-[45%] rounded-full bg-main/15 blur-[80px] animate-float" 
        style={{ animationDuration: '30s', animationDelay: '-5s' }}
      />
      
      {/* Subtle accent orb */}
      <div 
        className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-sub/15 blur-[60px] animate-float" 
        style={{ animationDuration: '35s', animationDelay: '-10s' }}
      />
    </div>
  );
};

export default Background;
