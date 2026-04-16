"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    router.push(token ? "/panel" : "/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/40"
          : "bg-black"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-semibold text-lg tracking-wide hover:text-gray-300 transition-colors duration-200 select-none"
        >
          Hosting<span className="text-indigo-400">Site</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-300 text-sm font-medium px-4 py-2 rounded-md hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            Home
          </Link>

          <button
            onClick={handleGetStarted}
            className="text-white text-sm font-semibold px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-md shadow-indigo-900/50 hover:shadow-indigo-700/50"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}