import React from 'react';
import { TabType } from '../types';
import { Grid, Heart, Lock } from 'lucide-react';

interface ContentTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex w-full border-b border-gray-800 mb-2 sticky top-[57px] md:top-0 bg-black z-40 max-w-[800px] mt-0 md:mt-2 justify-between md:justify-start">
      <TabButton 
        label="Videos" 
        icon={<Grid size={18} />}
        isActive={activeTab === TabType.POSTS} 
        onClick={() => setActiveTab(TabType.POSTS)} 
      />
      <TabButton 
        label="Reposts" 
        icon={<Lock size={18} />}
        isActive={activeTab === TabType.PRIVATE} 
        onClick={() => setActiveTab(TabType.PRIVATE)} 
      />
      <TabButton 
        label="Liked" 
        icon={<Heart size={18} />}
        isActive={activeTab === TabType.LIKES} 
        onClick={() => setActiveTab(TabType.LIKES)} 
      />
    </div>
  );
};

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-2 md:px-8 py-3 text-sm md:text-lg font-bold relative transition-colors ${
      isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
    }`}
  >
    <span className="md:hidden">{icon}</span>
    <span className="hidden md:inline">{label}</span>
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full transition-all w-1/2 mx-auto md:w-full" />
    )}
  </button>
);

export default ContentTabs;