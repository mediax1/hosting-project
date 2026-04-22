"use client";

import { useState, useEffect } from "react";

const DISCORD_SUPPORT_URL = "https://discord.gg/dp6c9Tg6H";

export default function SupportWidget() {
  const [showTooltip, setShowTooltip] = useState(false);

  // Pulse the tooltip every 60 seconds
  useEffect(() => {
    // Show on initial mount after 3s
    const initialTimer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 4000);
    }, 3000);

    // Then every 60 seconds
    const interval = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 4000);
    }, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      id="support-widget"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2"
    >
      {/* Tooltip bubble */}
      <div
        className={`
          pointer-events-none select-none
          rounded-lg px-4 py-2
          text-xs font-bold tracking-wider uppercase
          whitespace-nowrap
          transition-all duration-500 ease-out
          ${
            showTooltip
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }
        `}
        style={{
          background: "rgba(0,0,0,0.85)",
          border: "1px solid #facc15",
          color: "#facc15",
          boxShadow: "0 0 18px rgba(250,204,21,0.25)",
        }}
      >
        💬 Get support now!
        {/* Small triangle pointer */}
        <div
          className="absolute -bottom-1.5 right-5 w-3 h-3 rotate-45"
          style={{
            background: "rgba(0,0,0,0.85)",
            borderRight: "1px solid #facc15",
            borderBottom: "1px solid #facc15",
          }}
        />
      </div>

      {/* Circular button with Support label */}
      <div className="flex flex-col items-center gap-1.5">
        <a
          id="support-widget-btn"
          href={DISCORD_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full cursor-pointer transition-transform duration-300 hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
            border: "1.5px solid #facc15",
            boxShadow:
              "0 0 20px rgba(250,204,21,0.35), 0 0 60px rgba(250,204,21,0.12)",
          }}
          aria-label="Get Discord Support"
        >
          {/* Discord icon — white */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:scale-110"
          >
            <path
              d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"
              fill="#ffffff"
            />
          </svg>

          {/* Pulsing ring animation */}
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: "2px solid #facc15",
              opacity: 0.4,
              animationDuration: "2s",
            }}
          />
        </a>

        {/* Support label */}
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: "#facc15", textShadow: "0 0 8px rgba(250,204,21,0.4)" }}
        >
          Support
        </span>
      </div>
    </div>
  );
}
