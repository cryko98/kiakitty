import React from 'react';
import { Home, Compass, Users, Video, MessageSquare, Activity, Upload, MoreHorizontal, Search } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 w-[240px] h-screen bg-black border-r border-gray-800 flex flex-col pt-4 overflow-y-auto z-50 custom-scrollbar">
      {/* Logo */}
      <div className="px-6 mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-1">
          <span className="text-white">TikTok</span>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative group">
           <input 
             type="text" 
             placeholder="Search gem..." 
             className="w-full bg-[#2F2F2F] text-white text-sm py-2.5 pl-4 pr-10 rounded-full outline-none focus:bg-[#3F3F3F] transition-colors placeholder-gray-500"
           />
           <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white">
             <Search size={18} />
           </button>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex flex-col gap-1 px-2 pb-4 border-b border-gray-800">
        <NavItem icon={Home} label="For You" />
        <NavItem icon={Compass} label="Explore" />
        <NavItem icon={Users} label="Whales" />
        <NavItem icon={Users} label="Frens" />
        <NavItem icon={Video} label="Raids" />
        <NavItem icon={MessageSquare} label="DMs" badge={17} />
        <NavItem icon={Activity} label="Activity" badge={39} />
        <NavItem icon={Upload} label="Shill" />
        <NavItem icon={Users} label="Profile" isActive />
        <NavItem icon={MoreHorizontal} label="More" />
      </div>

      {/* Footer Links */}
      <div className="mt-auto px-4 py-6 text-[11px] text-gray-500 leading-relaxed border-t border-gray-800">
        <p>About Newsroom Contact</p>
        <p>TikTok for Good Advertise</p>
        <p>Developers Transparency</p>
        <div className="mt-4">© 2025 Kia Kitty Cat</div>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, isActive, badge }: { icon: any, label: string, isActive?: boolean, badge?: number }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors ${isActive ? 'text-[#fe2c55]' : 'text-white hover:bg-[#1f1f1f]'}`}>
    <Icon size={24} strokeWidth={isActive ? 3 : 2} />
    <span className={`font-bold text-lg ${isActive ? '' : 'font-semibold'}`}>{label}</span>
    {badge && (
      <span className="ml-auto bg-[#fe2c55] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
        {badge}
      </span>
    )}
  </div>
);

export default Sidebar;