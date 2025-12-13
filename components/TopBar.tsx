import React from 'react';
import { ChevronDown, Menu, UserPlus } from 'lucide-react';
import { COIN_NAME } from '../constants';

const TopBar: React.FC = () => {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-black/90 backdrop-blur-sm text-white border-b border-gray-800/50">
      <div className="w-8">
        <UserPlus size={24} className="text-white" />
      </div>
      
      <div className="flex items-center gap-1 font-bold text-lg">
        <span>{COIN_NAME}</span>
        <div className="bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-2 h-2 text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <ChevronDown size={16} />
      </div>

      <div className="w-8 flex justify-end">
        <Menu size={24} />
      </div>
    </div>
  );
};

export default TopBar;