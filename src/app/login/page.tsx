"use client";

import Navbar from "@/components/Navbar";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const errorMessages: Record<string, string> = {
  no_code: "Authentication failed. Please try again.",
  token_failed: "Could not connect to Discord. Please try again.",
  user_failed: "Could not fetch your Discord profile. Please try again.",
  server_error: "Something went wrong. Please try again.",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleDiscordLogin = () => {
    window.location.href = "/api/auth/discord";
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center relative z-10 px-4 w-full">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-black tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {errorMessages[error] ?? "An unknown error occurred."}
            </div>
          )}

          <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
            <button
              onClick={handleDiscordLogin}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-[#FFB800] hover:bg-[#E5A500] text-black text-sm font-bold rounded-xl transition-colors duration-150 shadow-[0_0_25px_rgba(255,184,0,0.25)]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
              </svg>
              Continue with Discord
            </button>

            <p className="text-center text-gray-600 text-xs">
              By signing in you agree to our{" "}
              <Link href="/tos" className="text-[#FFB800]/70 hover:text-[#FFB800] transition-colors">
                Terms of Service
              </Link>
            </p>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            Don&apos;t have an account?{" "}
            <span className="text-gray-400">
              It&apos;s created automatically on first login.
            </span>
          </p>
        </div>
      </main>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}