import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Delay before calling onComplete for smooth transition
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 flex items-center justify-center">
      <div className="text-center">
        {/* OAUSTECH Logo */}
        <div className="mb-8 animate-pulse">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-white p-2 shadow-2xl">
            <img 
              src="/OAUSTECH LOGO.png" 
              alt="OAUSTECH Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Fish Farming</h1>
          <p className="text-blue-100 text-lg">IoT Monitoring System</p>
          <p className="text-blue-200 text-sm mt-2">OAUSTECH Innovation</p>
        </div>
        
        {/* Progress bar */}
        <div className="w-80 bg-white/20 rounded-full h-4 mb-4 overflow-hidden">
          <div 
            className="bg-white h-4 rounded-full transition-all duration-100 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress percentage */}
        <p className="text-white text-xl font-semibold">{progress}%</p>
        
        {/* Loading text */}
        <p className="text-blue-100 mt-2">
          {progress < 30 ? 'Initializing sensors...' :
           progress < 60 ? 'Connecting to devices...' :
           progress < 90 ? 'Loading dashboard...' :
           'Almost ready!'}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;