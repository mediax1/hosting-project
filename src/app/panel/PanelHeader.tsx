"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/SidebarContext";
import { Menu } from "lucide-react";

interface PanelHeaderProps {
  username: string;
  avatarUrl: string;
}

export default function PanelHeader({ username, avatarUrl }: PanelHeaderProps) {
  const { setIsOpen } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside as EventListener);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside as EventListener);
    };
  }, [dropdownOpen]);

  return (
    <header className="h-14 sm:h-16 border-b border-white/5 px-3 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-30">
      {/* Left: Hamburger (mobile) + Dashboard title (desktop) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden w-9 h-9 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="hidden md:block text-white font-bold text-lg tracking-tight">Dashboard</h2>
      </div>

      {/* Center: Logo (mobile only) */}
      <div className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <Link href="/" className="h-20 flex items-center justify-center">
          <img src="/images/DB.svg" alt="DB Logo" className="h-full w-auto object-contain" />
        </Link>
      </div>

      {/* Right: notification + profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification bell */}
        <button className="w-9 h-9 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>

        <div className="h-6 w-px bg-white/10 mx-0.5 sm:mx-1 hidden sm:block"></div>

        {/* Profile dropdown — click-based for mobile + desktop */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer py-2"
          >
            <div className={`w-9 h-9 rounded-full bg-gradient-to-tr from-[#FFB800] to-[#E5A500] p-[2px] shadow-[0_0_15px_rgba(255,184,0,0.15)] ${dropdownOpen ? "shadow-[0_0_20px_rgba(255,184,0,0.3)]" : ""} transition-shadow`}>
              <div className="w-full h-full rounded-full bg-[#111] border border-white/10 flex items-center justify-center overflow-hidden relative">
                <Image src={avatarUrl} alt="User" fill sizes="36px" className="object-cover" />
              </div>
            </div>
            {/* Username: hidden on small screens, shown on sm+ */}
            <div className="hidden sm:flex flex-col">
              <span className="text-white text-sm font-bold leading-none">{username}</span>
            </div>
            <svg className={`w-4 h-4 text-gray-500 hidden sm:block ${dropdownOpen ? "text-white rotate-180" : ""} transition-all duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {/* Dropdown menu */}
          <div className={`absolute right-0 top-full mt-1 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl transition-all duration-200 transform z-50 ${dropdownOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-2"
            }`}>
            <div className="p-1.5">
              {/* Show username in dropdown on mobile */}
              <div className="sm:hidden px-3 py-2 border-b border-white/5 mb-1">
                <span className="text-white text-sm font-bold">{username}</span>
              </div>
              <Link
                href="/api/auth/logout"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors text-sm font-bold"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
