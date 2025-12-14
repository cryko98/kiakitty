import React from 'react';
import { Share2, Link as LinkIcon, ChevronDown, UserPlus, Sparkles, Rocket } from 'lucide-react';
import { PROFILE_PIC_URL, USERNAME, COIN_NAME, STATS, CA_ADDRESS } from '../constants';

interface ProfileInfoProps {
  onOpenMemeGenerator: () => void;
  onOpenTradeSimulator: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ onOpenMemeGenerator, onOpenTradeSimulator }) => {
  return (
    <div className="flex flex-col items-center md:items-start md:flex-row gap-4 md:gap-8 px-4 py-6 md:py-8 max-w-[800px] text-white mx-auto md:mx-0">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-[96px] h-[96px] md:w-[116px] md:h-[116px] rounded-full overflow-hidden border border-gray-800">
             <img 
                src={PROFILE_PIC_URL} 
                alt="Profile" 
                className="w-full h-full object-cover"
             />
        </div>
      </div>

      {/* Info Column */}
      <div className="flex-1 min-w-0 flex flex-col items-center md:items-start text-center md:text-left w-full">
        {/* Row 1: Names & Verified */}
        <div className="flex flex-col items-center md:items-start gap-1 mb-3 md:mb-4">
          <h1 className="text-[20px] md:text-[32px] font-bold leading-tight flex items-center gap-2">
            {USERNAME}
            <span className="bg-[#20d5ec] text-white text-sm w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 md:w-3 md:h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
          </h1>
          <h2 className="text-sm md:text-lg font-semibold text-white">{COIN_NAME}</h2>
        </div>
        
        {/* Stats Row for Mobile (Below name) */}
        <div className="flex items-center gap-8 mb-4 text-base md:hidden">
             <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-white">{STATS.following}</span>
                <span className="text-gray-400 text-xs font-normal">Whales</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-white">{STATS.followers}</span>
                <span className="text-gray-400 text-xs font-normal">Holders</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-white">{STATS.likes}</span>
                <span className="text-gray-400 text-xs font-normal">Pumps</span>
             </div>
        </div>

        {/* Desktop Stats */}
        <div className="hidden md:flex items-center gap-6 mb-4 text-base">
          <div className="flex items-baseline gap-1.5 hover:underline cursor-pointer">
            <span className="font-bold text-lg text-white">{STATS.following}</span>
            <span className="text-gray-400 font-normal">Whales</span>
          </div>
          <div className="flex items-baseline gap-1.5 hover:underline cursor-pointer">
            <span className="font-bold text-lg text-white">{STATS.followers}</span>
            <span className="text-gray-400 font-normal">Holders</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-lg text-white">{STATS.likes}</span>
            <span className="text-gray-400 font-normal">Pumps</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full md:w-auto mb-4">
            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                {/* Mobile Actions */}
                <button className="md:hidden bg-[#fe2c55] hover:bg-[#ef2950] text-white px-8 py-2.5 rounded-[4px] font-bold text-sm flex-1">
                    Follow
                </button>
                <button className="md:hidden bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white px-3 py-2.5 rounded-[4px] font-semibold border border-gray-700">
                    <ChevronDown size={20} />
                </button>

                {/* Desktop Actions */}
                <a 
                    href="https://x.com/i/communities/2000134271680626950/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hidden md:flex items-center justify-center bg-[#fe2c55] hover:bg-[#ef2950] text-white px-8 py-2 rounded font-bold text-base transition-colors min-w-[208px]"
                >
                    Community
                </a>
                <a 
                    href="https://dexscreener.com/solana/2r2r2stj46o4tpfglegefyqx3pxuoxpo28nho32ud3pw" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hidden md:flex bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white px-4 py-2 rounded font-semibold transition-colors items-center gap-2"
                >
                    Chart
                </a>
                <button className="hidden md:flex bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white w-10 h-10 items-center justify-center rounded transition-colors">
                    <UserPlus size={20} />
                </button>
                <button className="hidden md:flex bg-transparent hover:bg-[#1f1f1f] text-white w-10 h-10 items-center justify-center rounded transition-colors">
                    <Share2 size={24} />
                </button>
            </div>
            
            {/* Meme Generator Button */}
            <button 
                onClick={onOpenMemeGenerator}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold py-2 rounded-[4px] md:rounded flex items-center justify-center gap-2 transition-all shadow-lg transform hover:scale-[1.02]"
            >
                <Sparkles size={18} className="text-black" />
                <span>Meme Generator</span>
            </button>

             {/* Kia Cat Crash Button (Formerly Trade Simulator) */}
             <button 
                onClick={onOpenTradeSimulator}
                className="w-full bg-[#1e293b] hover:bg-[#334155] border border-gray-700 text-[#20d5ec] font-bold py-2 rounded-[4px] md:rounded flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
                <Rocket size={18} />
                <span>Kia Cat Crash</span>
            </button>
        </div>

        {/* Bio */}
        <div className="whitespace-pre-line text-sm md:text-base leading-relaxed mb-4 text-center md:text-left px-2 md:px-0">
          <p>@gfuelenergy Ambassador</p>
          <p>Stonks go brrr 🔥</p>
          <p>Use code KIAKITTYCAT for 20% off your 📦</p>
          <p className="font-mono text-xs text-gray-300 mt-2 break-all bg-gray-900/50 p-1 rounded inline-block">
            CA: {CA_ADDRESS}
          </p>
        </div>

        {/* Link */}
        <div className="mb-2">
            <a href="https://www.tiktok.com/@kia_kitty_cat" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white hover:underline font-semibold text-sm">
            <LinkIcon size={14} className="text-white" />
            <span>tiktok.com/@kia_kitty_cat</span>
            </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;