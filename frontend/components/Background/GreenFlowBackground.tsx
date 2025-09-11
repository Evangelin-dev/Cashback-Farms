import React, { ReactNode } from 'react';

interface GreenFlowBackgroundProps {
  children?: ReactNode;
}

const GreenFlowBackground: React.FC<GreenFlowBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-green-800 via-emerald-700 to-green-900">
      {/* Layered jungle canopy */}
      <div className="absolute inset-0">
        {/* Back layer - distant trees */}
        <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-green-900/80 to-transparent">
          {Array.from({length: 8}).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 opacity-40"
              style={{
                left: `${i * 12}%`,
                width: `${80 + Math.random() * 60}px`,
                height: `${200 + Math.random() * 150}px`,
                background: 'linear-gradient(to top, rgba(22, 101, 52, 0.8), rgba(34, 197, 94, 0.6))',
                clipPath: `polygon(40% 100%, 20% 60%, 10% 40%, 25% 20%, 45% 0%, 65% 15%, 80% 35%, 75% 65%, 60% 100%)`,
                animation: `sway ${8 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Middle layer - medium trees */}
        <div className="absolute bottom-0 left-0 w-full h-2/3">
          {Array.from({length: 6}).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 opacity-60"
              style={{
                left: `${5 + i * 15}%`,
                width: `${100 + Math.random() * 80}px`,
                height: `${250 + Math.random() * 200}px`,
                background: 'linear-gradient(to top, rgba(21, 128, 61, 0.9), rgba(34, 197, 94, 0.7))',
                clipPath: `polygon(45% 100%, 15% 70%, 5% 50%, 20% 25%, 50% 0%, 70% 20%, 85% 45%, 80% 75%, 55% 100%)`,
                animation: `sway ${6 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Front layer - close trees */}
        <div className="absolute bottom-0 left-0 w-full h-1/2">
          {Array.from({length: 4}).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 opacity-80"
              style={{
                left: `${10 + i * 20}%`,
                width: `${120 + Math.random() * 100}px`,
                height: `${300 + Math.random() * 250}px`,
                background: 'linear-gradient(to top, rgba(20, 83, 45, 1), rgba(34, 197, 94, 0.8))',
                clipPath: `polygon(50% 100%, 10% 80%, 0% 60%, 15% 40%, 30% 20%, 50% 0%, 70% 15%, 85% 35%, 90% 55%, 75% 80%)`,
                animation: `sway ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 1}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Sunlight rays filtering through */}
      <div className="absolute inset-0">
        {Array.from({length: 12}).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 opacity-30"
            style={{
              left: `${5 + i * 8}%`,
              width: '2px',
              height: '100%',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(254, 240, 138, 0.4), transparent)',
              transform: `rotate(${-5 + Math.random() * 10}deg)`,
              animation: `sunRays ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 8}s`
            }}
          ></div>
        ))}
      </div>

      {/* Jungle vines */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="vine1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.6)" />
              <stop offset="50%" stopColor="rgba(21, 128, 61, 0.8)" />
              <stop offset="100%" stopColor="rgba(22, 101, 52, 0.7)" />
            </linearGradient>
          </defs>
          
          {/* Hanging vines */}
          <path 
            d="M150,0 Q160,200 140,400 T120,800 Q125,900 130,1000" 
            stroke="url(#vine1)" 
            strokeWidth="8" 
            fill="none"
            className="opacity-50"
            style={{filter: 'blur(1px)'}}
          />
          <path 
            d="M350,0 Q370,150 360,300 T340,600 Q345,750 350,1000" 
            stroke="url(#vine1)" 
            strokeWidth="6" 
            fill="none"
            className="opacity-40"
            style={{filter: 'blur(1px)'}}
          />
          <path 
            d="M750,0 Q760,100 740,250 T720,500 Q725,700 730,1000" 
            stroke="url(#vine1)" 
            strokeWidth="7" 
            fill="none"
            className="opacity-45"
            style={{filter: 'blur(1px)'}}
          />
          
          {/* Vine leaves */}
          <ellipse cx="145" cy="300" rx="12" ry="8" fill="rgba(34, 197, 94, 0.7)" transform="rotate(45 145 300)" className="opacity-60 animate-pulse" />
          <ellipse cx="355" cy="200" rx="10" ry="6" fill="rgba(34, 197, 94, 0.6)" transform="rotate(-30 355 200)" className="opacity-50 animate-pulse" />
          <ellipse cx="745" cy="350" rx="11" ry="7" fill="rgba(34, 197, 94, 0.65)" transform="rotate(60 745 350)" className="opacity-55 animate-pulse" />
        </svg>
      </div>

      {/* Floating spores/pollen */}
      <div className="absolute inset-0">
        {Array.from({length: 20}).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              backgroundColor: Math.random() > 0.5 ? 'rgba(254, 240, 138, 0.8)' : 'rgba(34, 197, 94, 0.6)',
              animation: `float ${10 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 6}s`,
              filter: 'blur(0.5px)'
            }}
          ></div>
        ))}
      </div>

      {/* Misty atmosphere */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-2xl"
          style={{
            animation: 'mist 25s ease-in-out infinite',
            transform: 'skewY(2deg)'
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 right-0 w-full h-24 bg-gradient-to-l from-transparent via-green-200/20 to-transparent blur-xl"
          style={{
            animation: 'mist 20s ease-in-out infinite reverse',
            animationDelay: '8s',
            transform: 'skewY(-1deg)'
          }}
        ></div>
      </div>

      {/* Butterfly/bird silhouettes */}
      <div className="absolute inset-0">
        {Array.from({length: 5}).map((_, i) => (
          <div
            key={i}
            className="absolute opacity-30"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${10 + Math.random() * 50}%`,
              animation: `flutter ${8 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 10}s`
            }}
          >
            <div 
              className="w-3 h-2 bg-gradient-to-r from-lime-400/60 to-green-500/50 blur-sm"
              style={{
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                transform: 'rotate(15deg)'
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Jungle floor glow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-600/40 via-emerald-600/20 to-transparent blur-xl opacity-60"></div>

      {/* Content area */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        {children}
      </div>

      <style >{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg) scaleX(1); }
          50% { transform: rotate(2deg) scaleX(1.02); }
        }
        
        @keyframes sunRays {
          0%, 100% { 
            opacity: 0.2; 
            transform: translateX(0px) rotate(-5deg); 
          }
          50% { 
            opacity: 0.4; 
            transform: translateX(10px) rotate(5deg); 
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.3; 
          }
          25% { 
            transform: translateY(-20px) translateX(5px); 
            opacity: 0.6; 
          }
          75% { 
            transform: translateY(-10px) translateX(-3px); 
            opacity: 0.4; 
          }
        }
        
        @keyframes mist {
          0%, 100% { 
            transform: translateX(0px) skewY(2deg) scale(1); 
          }
          33% { 
            transform: translateX(30px) skewY(1deg) scale(1.1); 
          }
          66% { 
            transform: translateX(-20px) skewY(-1deg) scale(0.9); 
          }
        }
        
        @keyframes flutter {
          0%, 100% { 
            transform: translateX(0px) translateY(0px) scale(1); 
          }
          25% { 
            transform: translateX(15px) translateY(-10px) scale(1.1); 
          }
          50% { 
            transform: translateX(30px) translateY(-5px) scale(0.9); 
          }
          75% { 
            transform: translateX(20px) translateY(-15px) scale(1.05); 
          }
        }
      `}</style>
    </div>
  );
};

export default GreenFlowBackground;