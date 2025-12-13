import React from 'react';
import { Lock } from 'lucide-react';
import { Post, TabType } from '../types';

interface ContentGridProps {
  posts: Post[];
  activeTab: TabType;
}

const ContentGrid: React.FC<ContentGridProps> = ({ activeTab }) => {
  if (activeTab === TabType.LIKES || activeTab === TabType.PRIVATE) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 min-h-[400px]">
        {activeTab === TabType.PRIVATE ? (
             <div className="flex flex-col items-center">
                 <div className="mb-4 opacity-50"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg></div>
                 <h3 className="text-lg font-bold mb-1">No reposts yet</h3>
             </div>
        ) : (
             <div className="flex flex-col items-center">
                <div className="mb-4 opacity-50"><Lock size={60} strokeWidth={1} /></div>
                <h3 className="text-lg font-bold mb-1">This wallet's liked videos are private</h3>
                <p className="text-sm text-gray-500">Videos liked by kia_kitty_cat are currently hidden</p>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-[1200px]">
      <div className="w-full">
         <img 
           src="https://pbs.twimg.com/media/G8FDs5hXAAIv_EP?format=jpg&name=medium" 
           alt="Kia Kitty Cat Meme" 
           className="w-full h-auto rounded-xl border border-gray-800 hover:opacity-95 transition-opacity"
         />
      </div>
    </div>
  );
};

export default ContentGrid;