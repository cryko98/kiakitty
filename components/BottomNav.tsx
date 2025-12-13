import React from 'react';
import { Home, User, Plus, MessageSquare, Users } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[50px] bg-black border-t border-gray-800 flex justify-around items-center z-50 text-white max-w-md mx-auto">
      <NavButton icon={Home} label="Home" />
      <NavButton icon={Users} label="Friends" />
      
      {/* Create Button (Special) */}
      <div className="relative w-11 h-7 cursor-pointer hover:opacity-90 transition-opacity">
         <div className="absolute left-0 top-0 w-full h-full bg-[#20d5ec] rounded-lg translate-x-[-2px]"></div>
         <div className="absolute left-0 top-0 w-full h-full bg-[#fe2c55] rounded-lg translate-x-[2px]"></div>
         <div className="absolute left-0 top-0 w-full h-full bg-white rounded-lg flex items-center justify-center">
            <Plus size={20} className="text-black" />
         </div>
      </div>

      <NavButton icon={MessageSquare} label="Inbox" />
      <NavButton icon={User} label="Profile" isActive />
    </div>
  );
};

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ icon: Icon, label, isActive }) => (
  <div className={`flex flex-col items-center justify-center gap-[2px] cursor-pointer ${isActive ? 'text-white' : 'text-gray-500'}`}>
    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </div>
);

export default BottomNav;