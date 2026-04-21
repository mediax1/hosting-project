"use client";

import { SidebarProvider } from "@/components/SidebarContext";
import Sidebar from "./Sidebar";
import PanelHeader from "./PanelHeader";
import PromoPopup from "@/components/PromoPopup";

interface PanelShellProps {
  username: string;
  avatarUrl: string;
  children: React.ReactNode;
}

export default function PanelShell({ username, avatarUrl, children }: PanelShellProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <PanelHeader username={username} avatarUrl={avatarUrl} />
          {/* Desktop/iPad: overflow-hidden (no scroll), Mobile: overflow-y-auto (scroll allowed) */}
          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4 md:px-8 md:py-6 overflow-y-auto md:overflow-hidden scrollbar-hide">
            <div className="max-w-6xl mx-auto w-full md:h-full">
              {children}
            </div>
          </main>
          <PromoPopup />
        </div>
      </div>
    </SidebarProvider>
  );
}
