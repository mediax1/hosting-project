import { getUser, getAvatarUrl } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Sidebar from "./Sidebar";
import Link from "next/link";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[72px] border-b border-white/5 px-6 flex items-center justify-between shrink-0 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-30">

          <div className="flex items-center gap-6">
            <h2 className="text-white font-bold text-lg tracking-tight">Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search here.."
                className="bg-[#141414] border border-white/5 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]/50 transition-colors w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>
              <button className="w-9 h-9 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </button>
            </div>

            <div className="h-6 w-px bg-white/10 mx-1"></div>

            <div className="relative group">
              <div className="flex items-center gap-3 cursor-pointer py-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FFB800] to-[#E5A500] p-[2px] shadow-[0_0_15px_rgba(255,184,0,0.15)] group-hover:shadow-[0_0_20px_rgba(255,184,0,0.3)] transition-shadow">
                  <div className="w-full h-full rounded-full bg-[#111] border border-white/10 flex items-center justify-center overflow-hidden relative">
                    <Image src={getAvatarUrl(user)} alt="User" fill className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-bold leading-none">{user.username}&apos;s Team</span>
                  <span className="text-gray-500 text-[11px] mt-1 font-medium">Administrator</span>
                </div>
                <svg className="w-4 h-4 text-gray-500 ml-2 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <div className="absolute right-0 top-full mt-1 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="p-1.5">
                  <Link href="/api/auth/logout" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors text-sm font-bold">
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

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
