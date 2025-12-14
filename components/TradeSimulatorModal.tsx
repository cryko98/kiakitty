import React, { useState, useRef } from 'react';
import { X, Rocket, Skull, Coins, History, AlertTriangle, Wallet } from 'lucide-react';
import { PROFILE_PIC_URL, TICKER } from '../constants';

interface TradeSimulatorModalProps {
  onClose: () => void;
}

type GameState = 'IDLE' | 'RUNNING' | 'CRASHED';
type UserState = 'IDLE' | 'BETTING' | 'IN_GAME' | 'CASHED_OUT';

const INITIAL_KIA_BALANCE = 1000;

const TradeSimulatorModal: React.FC<TradeSimulatorModalProps> = ({ onClose }) => {
  // --- Global State ---
  const [balance, setBalance] = useState(INITIAL_KIA_BALANCE);
  const [history, setHistory] = useState<number[]>([]);
  
  // --- Game Round State ---
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [crashPoint, setCrashPoint] = useState(0);
  const [lastMilestone, setLastMilestone] = useState(1);
  const [celebrationActive, setCelebrationActive] = useState(false);
  
  // --- User Action State ---
  const [betAmount, setBetAmount] = useState<string>('100');
  const [userState, setUserState] = useState<UserState>('IDLE');

  // Refs for animation loop
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const celebrationTimeoutRef = useRef<number | null>(null);

  // --- Game Logic ---

  const generateCrashPoint = () => {
    // Proven fair-ish crash algorithm logic (simplified)
    const e = 2 ** 32;
    const h = crypto.getRandomValues(new Uint32Array(1))[0];
    const crash = Math.floor((100 * e - h) / (e - h)) / 100;
    
    // Minimum 1.10x so it never crashes instantly at 1.00x or 0x
    // This ensures strictly positive gameplay > 1.0
    return Math.max(1.10, crash); 
  };

  const startGame = () => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) return alert("Invalid bet amount");
    if (bet > balance) return alert("Insufficient funds");

    // Deduct bet
    setBalance(prev => prev - bet);
    setUserState('IN_GAME');
    setGameState('RUNNING');
    setMultiplier(1.00);
    setLastMilestone(1);
    setCelebrationActive(false);
    
    const point = generateCrashPoint();
    setCrashPoint(point);

    // Use performance.now() for smoother high-precision timing
    startTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(updateGame);
  };

  const updateGame = () => {
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000; // seconds
    
    // Smooth exponential growth equation: 1.00 * e^(k * t)
    // k = 0.12 (reduced from 0.15) for a slower, smoother crawl
    const currentMult = Math.max(1.00, Math.pow(Math.E, 0.12 * elapsed)); 
    
    setMultiplier(currentMult);

    // Check for milestone pulse (every integer: 2x, 3x...)
    const floorMult = Math.floor(currentMult);
    if (floorMult > lastMilestone) {
        setLastMilestone(floorMult);
        // Trigger celebration at specific milestones
        if ([2, 5, 10, 20, 50, 100].includes(floorMult)) {
            triggerCelebration();
        }
    }

    if (currentMult >= crashPoint) {
      // CRASH!
      handleCrash(crashPoint);
    } else {
      requestRef.current = requestAnimationFrame(updateGame);
    }
  };

  const triggerCelebration = () => {
      setCelebrationActive(true);
      if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
      // @ts-ignore - setTimeout returns number in browser
      celebrationTimeoutRef.current = setTimeout(() => {
          setCelebrationActive(false);
      }, 800);
  };

  const handleCrash = (finalValue: number) => {
    setGameState('CRASHED');
    setMultiplier(finalValue);
    setHistory(prev => [finalValue, ...prev].slice(0, 8)); // Keep last 8
    setCelebrationActive(false); // Stop any celebration immediately
    
    if (cancelAnimationFrame && requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    // Reset user state after a delay
    setTimeout(() => {
        setGameState('IDLE');
        setUserState('IDLE');
        setMultiplier(1.00);
    }, 3000);
  };

  const cashOut = () => {
    if (userState !== 'IN_GAME' || gameState !== 'RUNNING') return;

    const winAmount = parseFloat(betAmount) * multiplier;
    setBalance(prev => prev + winAmount);
    setUserState('CASHED_OUT');
  };

  // --- Visual Helpers ---

  // Refined coordinate mapping for smooth curve from corner to corner
  const getVisualProgress = (m: number) => {
      // We map the range 1.00x to 10.00x to the screen canvas (0% to 100%)
      const TARGET_MAX = 10.0;
      
      // Calculate linear progress based on Log scale (standard for charts)
      // 0.0 at 1x, 1.0 at 10x
      let progress = Math.log(m) / Math.log(TARGET_MAX);
      
      // Clamp to ensure it doesn't fly off too wildly, but allow some overshooting
      progress = Math.max(0, progress);

      // X Axis: Linear time progression across the screen
      const x = Math.min(100, progress * 100);
      
      // Y Axis: Curve (convex)
      // Using power 1.15 for a nice visible arc that isn't too steep
      const y = Math.min(95, Math.pow(progress, 1.15) * 95);
      
      return { x, y };
  };

  const { x, y } = getVisualProgress(multiplier);

  // Dynamic Background Speed
  const getSpeedStyle = () => {
      if (gameState !== 'RUNNING') return {};
      const baseDuration = 3; // Slower base duration for smoother feel
      const speedFactor = Math.max(0.2, 1 - (Math.log(multiplier) * 0.15));
      return { animationDuration: `${baseDuration * speedFactor}s` };
  };

  // Avatar Emotion Logic
  const getAvatarStyle = () => {
    // 1. Crash State
    if (gameState === 'CRASHED') {
        if (userState === 'IN_GAME') return 'animate-crash-sequence border-red-600'; // Shocked then Dead
        return 'grayscale brightness-50 border-gray-700'; // Just Dead/Static
    }

    // 2. Celebration State (Overrides normal in-game)
    if (celebrationActive && userState === 'IN_GAME') {
        return 'animate-celebrate border-[#fe2c55] shadow-[0_0_20px_#fe2c55] scale-110';
    }

    // 3. Win State
    if (userState === 'CASHED_OUT') return 'border-[#20d5ec] shadow-[0_0_30px_#20d5ec] scale-110'; 
    
    // 4. In-Game State (Nervous)
    if (userState === 'IN_GAME') return 'animate-shake border-yellow-400'; 
    
    // 5. Idle
    return 'border-gray-600'; 
  };

  const isMilestoneFrame = multiplier > 1.5 && (multiplier % 1 < 0.1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all duration-300">
      <div className={`bg-[#121212] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col border transition-colors duration-300 relative ${gameState === 'CRASHED' ? 'border-red-900/50' : 'border-gray-800'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 bg-[#0b0e11] border-b border-gray-800 z-30 relative">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                <Rocket className="text-yellow-400" size={18} fill="currentColor" />
            </div>
            <span className="font-black text-white tracking-wider italic text-lg">KIA CAT CRASH</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors hover:bg-white/10 p-1 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Game Area */}
        <div className="relative h-[400px] bg-[#1a1d24] overflow-hidden flex flex-col items-center justify-center group">
            
            {/* Animated Grid Background */}
            <div className={`absolute inset-0 opacity-30 pointer-events-none ${gameState === 'RUNNING' ? 'animate-scroll-down' : ''}`}
                 style={{
                   backgroundImage: 'linear-gradient(rgba(32, 213, 236, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(32, 213, 236, 0.1) 1px, transparent 1px)',
                   backgroundSize: '50px 50px',
                   ...getSpeedStyle()
                 }}>
            </div>

            {/* Passing Stars/Particles */}
            <div className={`absolute inset-0 pointer-events-none ${gameState === 'RUNNING' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                <div className="absolute top-0 left-[20%] w-[2px] h-[100px] bg-gradient-to-b from-transparent via-white to-transparent animate-star-fall" style={{animationDelay: '0.2s', ...getSpeedStyle()}}></div>
                <div className="absolute top-0 left-[60%] w-[1px] h-[60px] bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-star-fall" style={{animationDelay: '0.5s', ...getSpeedStyle()}}></div>
                <div className="absolute top-0 left-[80%] w-[2px] h-[120px] bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-star-fall" style={{animationDelay: '0.8s', ...getSpeedStyle()}}></div>
            </div>

            {/* The Multiplier Display */}
            <div className="relative z-20 text-center mt-[-40px]">
                 {gameState === 'CRASHED' && (
                     <div className="text-red-500 font-bold text-2xl mb-2 animate-bounce flex items-center justify-center gap-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                         <Skull size={28} /> REKT
                     </div>
                 )}
                 {userState === 'CASHED_OUT' && gameState !== 'IDLE' && (
                     <div className="text-[#20d5ec] font-bold text-2xl mb-2 flex items-center justify-center gap-2 animate-pulse drop-shadow-[0_0_10px_rgba(32,213,236,0.5)]">
                         <Coins size={28} /> CASHED!
                     </div>
                 )}
                 
                 <div className={`text-7xl md:text-8xl font-mono font-black tracking-tighter select-none ${
                     gameState === 'CRASHED' ? 'text-red-500 scale-100' : 
                     userState === 'CASHED_OUT' ? 'text-[#20d5ec]' : 
                     celebrationActive ? 'text-[#fe2c55] scale-110 drop-shadow-[0_0_30px_#fe2c55]' :
                     isMilestoneFrame ? 'text-white scale-110 drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]' :
                     'text-white drop-shadow-xl'
                 }`}>
                     {multiplier.toFixed(2)}x
                 </div>
                 
                 {/* Live Winnings Preview */}
                 {userState === 'IN_GAME' && (
                     <div className="text-yellow-400 font-mono font-bold mt-3 bg-black/60 px-4 py-1.5 rounded-full inline-flex items-center gap-2 border border-yellow-400/30 backdrop-blur-md shadow-lg">
                         <Wallet size={14} />
                         +{(parseFloat(betAmount) * multiplier).toFixed(0)} {TICKER}
                     </div>
                 )}
            </div>

            {/* The Graph & Avatar */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Visual Line - Gradient & Glowing */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute bottom-0 left-0">
                     <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#20d5ec" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#fe2c55" stopOpacity="1" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                     </defs>
                     
                     {/* Area Glow */}
                     <path 
                        d={`M 0 100 L ${x} ${100 - y} L 0 ${100 - y} Z`} 
                        fill="url(#lineGradient)" 
                        className="opacity-20"
                     />
                     
                     {/* Main Line */}
                     <path 
                        d={`M 0 100 L ${x} ${100 - y}`} 
                        fill="none" 
                        stroke={gameState === 'CRASHED' ? '#ef4444' : 'url(#lineGradient)'} 
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

                {/* Avatar Positioning */}
                <div 
                    className="absolute will-change-transform z-10"
                    style={{
                        left: `${x}%`,
                        top: `${100 - y}%`,
                        transform: 'translate(-50%, -50%)' // Center the avatar on the point
                    }}
                >
                     {/* Jet Engine Flame Effect */}
                     {gameState === 'RUNNING' && (
                        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-8 h-16 pointer-events-none z-[-1]">
                             <div className="w-full h-full bg-gradient-to-t from-transparent via-yellow-500 to-red-500 blur-[4px] animate-flame origin-top rounded-b-full opacity-80"></div>
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-10 bg-white blur-[6px] animate-pulse"></div>
                        </div>
                     )}

                     <div className={`relative transition-all duration-200 ${getAvatarStyle()} rounded-full border-[3px] w-16 h-16 overflow-hidden bg-black shadow-2xl`}>
                         <img src={PROFILE_PIC_URL} className="w-full h-full object-cover" />
                     </div>
                </div>
            </div>

            {/* Crash History Bar */}
            <div className="absolute top-4 right-4 flex flex-col gap-1 items-end z-20">
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-black/40 px-2 py-1 rounded">
                    <History size={10} /> Recent
                </div>
                <div className="flex flex-col-reverse gap-1.5 max-h-[150px] overflow-hidden">
                    {history.map((h, i) => (
                        <div key={i} className={`text-xs font-mono font-bold px-2 py-1 rounded backdrop-blur-sm border-l-2 w-full text-right animate-in slide-in-from-right duration-300 ${
                            h >= 2.0 ? 'bg-green-500/10 text-green-400 border-green-500' : 'bg-red-500/10 text-red-400 border-red-500'
                        }`}>
                            {h.toFixed(2)}x
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="p-5 bg-[#121212] z-20 relative">
            
            {/* Balance Bar */}
            <div className="flex justify-between items-center mb-5 bg-[#1a1d24] p-3.5 rounded-2xl border border-gray-800 shadow-inner">
                 <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-[#20d5ec]/10 flex items-center justify-center">
                        <Wallet className="text-[#20d5ec]" size={16} />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Balance</span>
                        <span className="text-white font-mono font-bold text-lg leading-none mt-1">{balance.toFixed(0)}</span>
                     </div>
                 </div>
                 <div className="text-[#20d5ec] font-bold text-sm bg-[#20d5ec]/10 px-2 py-1 rounded">
                    {TICKER}
                 </div>
            </div>

            {/* Input & Buttons */}
            <div className="flex gap-4">
                 <div className="flex-1">
                     <div className="relative group">
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm group-focus-within:text-[#20d5ec] transition-colors">$</div>
                         <input 
                            type="number" 
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            disabled={userState !== 'IDLE'}
                            className="w-full bg-[#0b0e11] border border-gray-700 text-white font-mono font-bold text-xl py-3.5 pl-6 pr-3 rounded-xl focus:border-[#20d5ec] focus:outline-none focus:ring-1 focus:ring-[#20d5ec] disabled:opacity-50 transition-all shadow-sm"
                         />
                     </div>
                     <div className="flex gap-1.5 mt-2">
                         {['100', '500', '1k', 'Max'].map(val => (
                             <button 
                                key={val}
                                onClick={() => setBetAmount(val === 'Max' ? balance.toString() : val === '1k' ? '1000' : val)}
                                disabled={userState !== 'IDLE'}
                                className="flex-1 bg-[#1a1d24] hover:bg-[#252a33] text-[10px] text-gray-400 font-bold py-1.5 rounded-lg border border-gray-800 transition-colors disabled:opacity-50 hover:text-white"
                             >
                                 {val}
                             </button>
                         ))}
                     </div>
                 </div>

                 {userState === 'IDLE' || userState === 'CASHED_OUT' || (gameState === 'CRASHED' && userState !== 'IN_GAME') ? (
                     <button 
                        onClick={startGame}
                        disabled={gameState === 'RUNNING'}
                        className="flex-[1.4] bg-gradient-to-br from-[#20d5ec] to-[#0ea5e9] hover:from-[#1bc0d6] hover:to-[#0284c7] text-white font-black text-2xl rounded-2xl shadow-[0_6px_0_#0f766e] active:shadow-none active:translate-y-[6px] transition-all flex flex-col items-center justify-center leading-none disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                     >
                         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                         <div className="relative flex items-center gap-2 z-10">
                            LAUNCH <Rocket size={24} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                         </div>
                     </button>
                 ) : (
                     <button 
                        onClick={cashOut}
                        disabled={gameState === 'CRASHED'}
                        className={`flex-[1.4] font-black text-2xl rounded-2xl shadow-[0_6px_0_#065f46] active:shadow-none active:translate-y-[6px] transition-all flex flex-col items-center justify-center leading-none overflow-hidden relative ${
                            gameState === 'CRASHED' 
                            ? 'bg-gray-700 text-gray-500 shadow-none translate-y-[6px] cursor-not-allowed' 
                            : 'bg-gradient-to-br from-[#22c55e] to-[#16a34a] hover:from-[#4ade80] hover:to-[#22c55e] text-white'
                        }`}
                     >
                        <div className="relative z-10 flex flex-col items-center">
                             <div className="flex items-center gap-2 text-lg opacity-90">CASH OUT</div>
                             <span className="text-2xl font-mono mt-0.5 tracking-tight">
                                 +{(parseFloat(betAmount) * multiplier).toFixed(0)}
                             </span>
                        </div>
                     </button>
                 )}
            </div>

            {/* Helper Text */}
            <div className="text-center mt-4 h-6">
                {gameState === 'CRASHED' ? (
                    <span className="text-red-500 font-bold text-xs flex items-center justify-center gap-1 animate-in fade-in zoom-in duration-300">
                        <AlertTriangle size={12} /> ROCKET CRASHED AT {multiplier.toFixed(2)}x
                    </span>
                ) : gameState === 'RUNNING' ? (
                    <span className="text-[#20d5ec] font-bold text-xs animate-pulse">
                        TO THE MOON! 🚀
                    </span>
                ) : (
                    <span className="text-gray-500 text-xs">Place your bet and watch $KIA fly!</span>
                )}
            </div>

        </div>
      </div>
      
      {/* CSS for Advanced Animations */}
      <style>{`
        @keyframes scroll-down {
          from { background-position: 0 0; }
          to { background-position: 0 50px; }
        }
        .animate-scroll-down {
          animation: scroll-down 2s linear infinite;
        }

        @keyframes star-fall {
            0% { transform: translateY(-100px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(400px); opacity: 0; }
        }
        .animate-star-fall {
            animation: star-fall linear infinite;
        }

        @keyframes flame {
            0% { transform: translateX(-50%) scaleY(1); opacity: 0.8; }
            50% { transform: translateX(-50%) scaleY(1.2); opacity: 1; }
            100% { transform: translateX(-50%) scaleY(1); opacity: 0.8; }
        }
        .animate-flame {
            animation: flame 0.1s linear infinite;
        }

        @keyframes shake {
          0% { transform: rotate(0deg) translate(0,0); }
          25% { transform: rotate(2deg) translate(1px, 1px); }
          50% { transform: rotate(0deg) translate(0,0); }
          75% { transform: rotate(-2deg) translate(-1px, -1px); }
          100% { transform: rotate(0deg) translate(0,0); }
        }
        .animate-shake {
          animation: shake 0.1s infinite;
        }
        
        @keyframes celebrate-pop {
            0% { transform: scale(1) rotate(0deg); }
            40% { transform: scale(1.4) rotate(-15deg); }
            60% { transform: scale(1.4) rotate(15deg); }
            80% { transform: scale(1.2) rotate(0deg); }
            100% { transform: scale(1) rotate(0deg); }
        }
        .animate-celebrate {
            animation: celebrate-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes crash-shock {
            0% { transform: scale(1) translate(0,0); filter: grayscale(0); }
            20% { transform: scale(1.3) translate(-5px, 5px) rotate(-10deg); filter: grayscale(0); }
            40% { transform: scale(1.3) translate(5px, -5px) rotate(10deg); filter: grayscale(0); }
            60% { transform: scale(1.1) translate(-2px, 2px); filter: grayscale(50%); }
            100% { transform: scale(0.9) rotate(12deg); filter: grayscale(100%) contrast(1.25); }
        }
        .animate-crash-sequence {
            animation: crash-shock 0.8s forwards;
        }
      `}</style>
    </div>
  );
};

export default TradeSimulatorModal;