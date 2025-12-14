import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProfileInfo from './components/ProfileInfo';
import ContentTabs from './components/ContentTabs';
import ContentGrid from './components/ContentGrid';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import MemeGeneratorModal from './components/MemeGeneratorModal';
import TradeSimulatorModal from './components/TradeSimulatorModal';
import { TabType } from './types';
import { MOCK_POSTS } from './constants';
import { ScanLine } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.POSTS);
  const [isMemeModalOpen, setIsMemeModalOpen] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-50 bg-black w-full">
        <TopBar />
      </div>

      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-[240px] w-full pb-[60px] md:pb-0">
        
        {/* Desktop Header Actions */}
        <div className="hidden md:flex justify-end items-center gap-4 px-8 py-4 sticky top-0 bg-black/90 backdrop-blur-sm z-50">
           <button className="flex items-center gap-2 bg-[#2f2f2f] hover:bg-[#3f3f3f] px-3 py-1.5 rounded text-sm font-semibold transition-colors">
               <span className="text-white">Get App</span>
           </button>
           <button className="text-white hover:bg-[#1f1f1f] p-2 rounded-full transition-colors">
               <ScanLine size={20} />
           </button>
        </div>

        <main className="px-0 md:px-8 pb-10">
          <ProfileInfo 
            onOpenMemeGenerator={() => setIsMemeModalOpen(true)} 
            onOpenTradeSimulator={() => setIsTradeModalOpen(true)}
          />
          
          <div className="mt-2 border-t border-gray-800 md:border-t-0">
            <ContentTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
            />
            
            <div className="mt-1 px-1 md:px-0">
                <ContentGrid 
                    posts={MOCK_POSTS} 
                    activeTab={activeTab} 
                />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>

      {/* Meme Generator Modal */}
      {isMemeModalOpen && (
        <MemeGeneratorModal onClose={() => setIsMemeModalOpen(false)} />
      )}

      {/* Trade Simulator Modal */}
      {isTradeModalOpen && (
        <TradeSimulatorModal onClose={() => setIsTradeModalOpen(false)} />
      )}
    </div>
  );
};

export default App;