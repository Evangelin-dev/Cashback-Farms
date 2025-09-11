import React, { ReactNode } from 'react';

interface BlueParticleNetworkProps {
  children?: ReactNode;
}

const BlueParticleNetwork: React.FC<BlueParticleNetworkProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-slate-800">
      {/* Animated background texture */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full animate-pulse" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)`,
          animationDuration: '8s'
        }}></div>
      </div>
      
      {/* Network nodes */}
      <div className="absolute inset-0">
        {/* Large central node */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
          <div className="absolute inset-0 w-8 h-8 border border-blue-400/30 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
        </div>
        
        {/* Orbital nodes */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute w-48 h-48 border border-blue-500/20 rounded-full animate-spin" style={{animationDuration: '20s'}}>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-indigo-400 rounded-full"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-300 rounded-full"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-300 rounded-full"></div>
          </div>
        </div>
        
        {/* Secondary orbital ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute w-80 h-80 border border-cyan-500/15 rounded-full animate-spin" style={{animationDuration: '30s', animationDirection: 'reverse'}}>
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
      
      {/* Connection lines */}
      <div className="absolute inset-0">
        {/* Horizontal connections */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
        
        {/* Vertical connections */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-pulse" style={{animationDuration: '7s'}}></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-indigo-400/20 to-transparent animate-pulse" style={{animationDuration: '5s', animationDelay: '3s'}}></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent animate-pulse" style={{animationDuration: '6s', animationDelay: '1.5s'}}></div>
      </div>
      
      {/* Scattered network nodes */}
      <div className="absolute inset-0">
        {Array.from({length: 16}).map((_, i) => {
          const size = Math.random() > 0.7 ? 'w-3 h-3' : 'w-2 h-2';
          const colors = ['bg-blue-400', 'bg-indigo-400', 'bg-cyan-400', 'bg-blue-300'];
          const color = colors[i % colors.length];
          
          return (
            <div
              key={i}
              className={`absolute ${size} ${color} rounded-full opacity-60 animate-pulse`}
              style={{
                left: `${10 + (Math.random() * 80)}%`,
                top: `${10 + (Math.random() * 80)}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              <div className={`absolute inset-0 ${size} border border-current rounded-full animate-ping opacity-30`} style={{animationDuration: `${3 + Math.random() * 2}s`}}></div>
            </div>
          );
        })}
      </div>
      
      {/* Data streams */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({length: 5}).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-8 bg-gradient-to-b from-blue-400/60 to-transparent animate-bounce opacity-50"
            style={{
              left: `${20 + (i * 15)}%`,
              top: '-2rem',
              animationDelay: `${i * 0.8}s`,
              animationDuration: '3s',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out'
            }}
          ></div>
        ))}
      </div>
      
      {/* Glitch effect bars */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-cyan-400 animate-pulse" style={{animationDuration: '0.5s'}}></div>
        <div className="absolute bottom-1/3 left-0 w-full h-0.5 bg-blue-400 animate-pulse" style={{animationDuration: '0.7s', animationDelay: '0.2s'}}></div>
      </div>
      
      {/* Matrix-style code rain effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {Array.from({length: 8}).map((_, i) => (
          <div
            key={i}
            className="absolute text-xs text-blue-400 font-mono animate-bounce"
            style={{
              left: `${12.5 * i}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '4s'
            }}
          >
            {Math.random().toString(36).substring(2, 8)}
          </div>
        ))}
      </div>
      
      {/* Central HUD overlay - render children if provided, otherwise show demo HUD content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="relative w-full max-w-4xl px-4">
          {/* HUD frame */}
          <div className="absolute inset-0 border-2 border-blue-400/30 bg-black/20 backdrop-blur-sm rounded-lg pointer-events-none"></div>
          <div className="absolute -inset-2 border border-cyan-400/20 rounded-lg animate-pulse pointer-events-none" style={{animationDuration: '3s'}}></div>

          {/* Content area: children override default demo content */}
          <div className="relative z-20">
            {children ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                {children}
              </div>
            ) : (
              <div className="relative text-center text-white/90 px-12 py-8">
                {/* <div className="text-xs text-blue-400 font-mono mb-2 opacity-70">NETWORK_STATUS: ACTIVE</div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent font-mono">
                  NEURAL_NET
                </h1>
                <div className="text-xs text-cyan-400 font-mono mb-4 opacity-70">NODES: 16 | CONNECTIONS: STABLE</div>
                <p className="text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
                  Advanced particle network simulation with real-time connections
                </p> */}

                {/* Status indicators */}
                {/* <div className="flex justify-center space-x-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-mono">ONLINE</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    <span className="text-xs text-blue-400 font-mono">SYNC</span>
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Corner HUD elements */}
      {/* <div className="absolute top-4 left-4 text-xs text-blue-400/60 font-mono">
        <div>SYS_ID: NX_7749</div>
        <div className="mt-1">UPTIME: 99.9%</div>
      </div>
      
      <div className="absolute top-4 right-4 text-xs text-cyan-400/60 font-mono text-right">
        <div>BANDWIDTH: ∞</div>
        <div className="mt-1">LATENCY: 0ms</div>
      </div>
      
      <div className="absolute bottom-4 left-4 text-xs text-indigo-400/60 font-mono">
        <div>PROTOCOL: TCP/IP</div>
      </div>
      
      <div className="absolute bottom-4 right-4 text-xs text-blue-400/60 font-mono text-right">
        <div>SECURITY: MAX</div>
      </div> */}
    </div>
  );
};

export default BlueParticleNetwork;