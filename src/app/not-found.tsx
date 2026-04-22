"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Press_Start_2P } from "next/font/google";
import Navbar from "@/components/Navbar";

const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const DINO_STANDING = [
  "           XXXXXXXXX",
  "          XXXXXXXXXXX",
  "          XXXX X XXXX",
  "          XXXXXXXXXXX",
  "          XXXXXXXXXXX",
  "          XXXXXXXXXXX",
  "          XXXXX",
  "          XXXXXXXX",
  "X       XXXXXXX",
  "XX     XXXXXXXX",
  "XXX   XXXXXXXXX",
  "XXXXXXXXXXXXXXXX",
  " XXXXXXXXXXXXXX",
  "  XXXXXXXXXXXX",
  "   XXXXXXXXXX",
  "    XXXXXXXX",
  "     XXXXXX",
  "      X  X",
  "      X  X",
  "      XX XX"
];

const DINO_LEFT = [
  "           XXXXXXXXX",
  "          XXXXXXXXXXX",
  "          XXXX X XXXX",
  "          XXXXXXXXXXX",
  "          XXXXXXXXXXX",
  "          XXXXXXXXXXX",
  "          XXXXX",
  "          XXXXXXXX",
  "X       XXXXXXX",
  "XX     XXXXXXXX",
  "XXX   XXXXXXXXX",
  "XXXXXXXXXXXXXXXX",
  " XXXXXXXXXXXXXX",
  "  XXXXXXXXXXXX",
  "   XXXXXXXXXX",
  "    XXXXXXXX",
  "     XXXXXX",
  "      X  X",
  "      XX"
];

const DINO_RIGHT = [
  "           XXXXXXXXX",
  "          XXXXXXXXXXX",
  "          XXXX X XXXX",
  "          XXXXXXXXXXX",
  "          XXXXXXXXXXX",
  "          XXXXXXXXXXX",
  "          XXXXX",
  "          XXXXXXXX",
  "X       XXXXXXX",
  "XX     XXXXXXXX",
  "XXX   XXXXXXXXX",
  "XXXXXXXXXXXXXXXX",
  " XXXXXXXXXXXXXX",
  "  XXXXXXXXXXXX",
  "   XXXXXXXXXX",
  "    XXXXXXXX",
  "     XXXXXX",
  "      X  X",
  "         XX"
];

const DIGIT_4 = [
  "   X",
  "  XX",
  "  XX",
  " XXX",
  " XXX",
  " X X",
  " X X",
  "XX X",
  "XX X",
  "XXXXXXX",
  "XXXXXXX",
  "   X",
  "   X",
  "   X"
];

const DIGIT_0 = [
  " XXXXX",
  "XXXXXXX",
  "XX   XX",
  "XX   XX",
  "XX   XX",
  "XX   XX",
  "XX   XX",
  "XX   XX",
  "XX   XX",
  "XX   XX",
  "XX   XX",
  "XXXXXXX",
  " XXXXX"
];

const METEOR_1 = [
  " X ",
  "XXX",
  " X ",
  "  X",
  "   X"
];

const METEOR_2 = [
  "XX",
  "XX",
  "  X",
  "   X"
];

const METEOR_3 = [
  " X",
  "X ",
  " X",
  "  X",
  "   X",
  "    X"
];


function PixelGrid({ grid, color, className = "" }: { grid: string[], color: string, className?: string }) {
  const height = grid.length;
  const width = Math.max(...grid.map((r) => r.length));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`block ${className}`}
      fill={color}
    >
      {grid.map((row, y) =>
        row.split("").map((cell, x) => {
          if (cell === "X") {
            return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />;
          }
          return null;
        })
      )}
    </svg>
  );
}

export default function NotFound() {
  const [dinoState, setDinoState] = useState(0); // 0: standing, 1: left, 2: right
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    // Legs animation
    const interval = setInterval(() => {
      if (!isJumping) {
        setDinoState((prev) => (prev === 1 ? 2 : 1));
      } else {
        setDinoState(0);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [isJumping]);

  useEffect(() => {
    // Jump handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isJumping) {
        e.preventDefault();
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isJumping]);

  return (
    <div 
      className="h-[100dvh] bg-transparent text-white flex flex-col items-center select-none overflow-hidden cursor-pointer w-full" 
      onClick={() => {
        if(!isJumping) {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), 500);
        }
      }}
    >
      <Navbar />
      <div className="relative w-full max-w-4xl flex flex-col items-center justify-center flex-1 px-4 md:px-8 pb-10 md:pb-20">
        
        {/* 404 Text & Dino */}
        <div className="relative flex items-end justify-center w-full mb-8 md:mb-16 h-48 sm:h-64 md:h-80">
            {/* The 404 background text */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 sm:gap-6 md:gap-10">
                <PixelGrid grid={DIGIT_4} color="#FFB800" className="w-14 sm:w-20 md:w-24 lg:w-28 h-auto transform -translate-y-4 md:-translate-y-8" />
                <PixelGrid grid={DIGIT_0} color="#FFB800" className="w-14 sm:w-20 md:w-24 lg:w-28 h-auto transform -translate-y-4 md:-translate-y-8" />
                <PixelGrid grid={DIGIT_4} color="#FFB800" className="w-14 sm:w-20 md:w-24 lg:w-28 h-auto transform -translate-y-4 md:-translate-y-8" />
            </div>

            {/* Meteors */}
            <div className="absolute top-4 sm:top-10 md:top-16 left-[10%] sm:left-[15%] md:left-[25%] animate-[pulse_2s_infinite_alternate] opacity-80">
                 <PixelGrid grid={METEOR_1} color="#666" className="w-4 sm:w-6 md:w-10 h-auto" />
            </div>
            <div className="absolute top-16 sm:top-24 md:top-32 left-[20%] sm:left-[25%] md:left-[32%] animate-[pulse_1.5s_infinite_alternate] opacity-60">
                 <PixelGrid grid={METEOR_2} color="#444" className="w-3 sm:w-5 md:w-6 h-auto" />
            </div>
            <div className="absolute top-10 sm:top-12 md:top-20 left-[30%] sm:left-[35%] md:left-[38%] animate-[pulse_1.8s_infinite_alternate] opacity-70">
                 <PixelGrid grid={METEOR_3} color="#555" className="w-3 sm:w-4 md:w-6 h-auto" />
            </div>

            {/* Ground Lines */}
            <div className="absolute bottom-2 md:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[20rem] md:max-w-md lg:max-w-lg h-1 bg-transparent flex justify-between items-end z-0 px-4 md:px-12 opacity-80">
                <div className="w-8 md:w-16 h-0.5 md:h-1 bg-white" />
                <div className="w-4 md:w-6 h-0.5 md:h-1 bg-white transform translate-y-2 md:translate-y-3" />
                <div className="w-2 md:w-4 h-0.5 md:h-1 bg-white transform translate-y-1" />
                <div className="w-8 md:w-12 h-0.5 md:h-1 bg-white" />
                <div className="w-12 md:w-24 h-0.5 md:h-1 bg-white transform translate-y-1 md:translate-y-2" />
            </div>
            <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[16rem] md:max-w-[20rem] h-1 bg-transparent flex justify-between items-end z-0 px-2 md:px-8 opacity-80">
                <div className="w-6 md:w-10 h-0.5 md:h-1 bg-white transform -translate-y-1" />
                <div className="w-16 md:w-32 h-1 bg-transparent" />
                <div className="w-4 md:w-8 h-0.5 md:h-1 bg-white transform translate-y-1 md:translate-y-2" />
            </div>

            {/* Dino */}
            <div 
              className={`z-10 transition-transform duration-500 ease-out pb-2 md:pb-4 ${
                isJumping ? "-translate-y-24 md:-translate-y-36" : "translate-y-0"
              }`}
              style={{ transitionTimingFunction: isJumping ? 'cubic-bezier(0.2, 0.8, 0.2, 1)' : 'cubic-bezier(0.8, 0, 0.8, 0.2)' }}
            >
                <PixelGrid 
                  grid={dinoState === 0 ? DINO_STANDING : dinoState === 1 ? DINO_LEFT : DINO_RIGHT} 
                  color="#ffffff" 
                  className="w-16 sm:w-20 md:w-32 lg:w-40 h-auto" 
                />
            </div>
        </div>

        {/* Text */}
        <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#FFB800] mb-4 md:mb-8 text-center capitalize tracking-widest ${pressStart2P.className} leading-tight`} style={{ textShadow: "2px 2px 0px rgba(255,184,0,0.2)", wordSpacing: "0.2em" }}>
          Page not found
        </h1>
        
        <Link href="/" className="text-white text-lg md:text-xl font-medium hover:text-[#FFB800] hover:underline tracking-wide transition-colors z-20">
          Go to home
        </Link>
        <p className="text-gray-400 text-[10px] md:text-xs mt-4 md:mt-6 opacity-70 animate-pulse">Press space or tap to jump</p>

      </div>
    </div>
  );
}
