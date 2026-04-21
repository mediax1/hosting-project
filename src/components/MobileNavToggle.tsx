"use client";

import { useSidebar } from "./SidebarContext";
import { Menu } from "lucide-react";

export default function MobileNavToggle() {
  const { setIsOpen } = useSidebar();
  
  return (
    <button 
      onClick={() => setIsOpen(true)} 
      className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-[#141414] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
