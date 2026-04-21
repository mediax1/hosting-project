"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import HCaptcha from "@hcaptcha/react-hcaptcha";

type State = {
  credits: number;
  claimsToday: number;
  dailyLimit: number;
  cooldownMs: number;
  captchaEvery: number;
  lastClaimAt: string | null;
  nextResetAt: string;
};

function useCountdown(targetISO: string | null) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!targetISO) return;
    const update = () => {
      const diff = new Date(targetISO).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0 }); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [targetISO]);

  return timeLeft;
}

const SEGMENTS = [
  { emoji: "🪙", label: "1",  color: "#141414", type: "coin" },
  { emoji: "🪙", label: "10", color: "#1c1c1c", type: "coin" },
  { emoji: "🪙", label: "50", color: "#141414", type: "coin" },
  { emoji: null,  label: "+2", color: "#1c1c1c", type: "discord" },
  { emoji: "🪙", label: "2",  color: "#141414", type: "coin" },
  { emoji: "🪙", label: "20", color: "#1c1c1c", type: "coin" },
];

const SLICE_DEG = 360 / SEGMENTS.length;

export default function EarnPage() {
  const [state, setState] = useState<State | null>(null);
  const [loading, setLoading] = useState(true);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const [spinning, setSpinning] = useState(false);
  const [skipAnim, setSkipAnim] = useState(false);
  const [rotation, setRotation] = useState(0);

  const captchaRef = useRef<HCaptcha>(null);
  const timeLeft = useCountdown(state?.nextResetAt ?? null);

  const fetchState = useCallback(async () => {
    const res = await fetch("/api/credits/claim");
    if (res.ok) {
      const data = await res.json();
      setState(data);
      if (data.lastClaimAt) {
        const elapsed = Date.now() - new Date(data.lastClaimAt).getTime();
        const remaining = Math.max(0, data.cooldownMs - elapsed);
        setCooldownLeft(Math.ceil(remaining / 1000));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchState(); }, [fetchState]);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const t = setInterval(() => {
      setCooldownLeft((p) => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldownLeft]);

  const doClaim = useCallback(async (token?: string) => {
    setClaiming(true);
    setMessage(null);
    const res = await fetch("/api/credits/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ captchaToken: token ?? undefined }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage({ type: "success", text: "+1 credit earned!" });
      setState((prev) => prev ? { ...prev, credits: data.credits, claimsToday: data.claimsToday } : prev);
      setCooldownLeft(Math.ceil((state?.cooldownMs ?? 60000) / 1000));
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } else if (data.needsCaptcha) {
      setShowCaptcha(true);
      setMessage({ type: "error", text: "Please complete the captcha to continue." });
    } else {
      setMessage({ type: "error", text: data.error });
    }
    setClaiming(false);
  }, [state]);

  const spin = useCallback(() => {
    if (cooldownLeft > 0 || claiming || !state || state.claimsToday >= state.dailyLimit || spinning) return;
    setSpinning(true);
    setMessage(null);

    const needsCaptcha = state.claimsToday > 0 && state.claimsToday % state.captchaEvery === 0;

    if (skipAnim) {
      if (needsCaptcha && !captchaToken) {
        setSpinning(false);
        setShowCaptcha(true);
        setMessage({ type: "error", text: "Please complete the captcha to continue." });
      } else {
        doClaim(captchaToken ?? undefined).finally(() => setSpinning(false));
      }
      return;
    }

    const extra = Math.floor(Math.random() * 360);
    const target = rotation + 1800 + extra;
    setRotation(target);

    setTimeout(() => {
      if (needsCaptcha && !captchaToken) {
        setSpinning(false);
        setShowCaptcha(true);
        setMessage({ type: "error", text: "Please complete the captcha to continue." });
      } else {
        doClaim(captchaToken ?? undefined).finally(() => setSpinning(false));
      }
    }, 3200);
  }, [cooldownLeft, claiming, state, spinning, skipAnim, captchaToken, doClaim, rotation]);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setShowCaptcha(false);
    doClaim(token).finally(() => setSpinning(false));
  };

  const atLimit = state ? state.claimsToday >= state.dailyLimit : false;
  const onCooldown = cooldownLeft > 0;
  const canSpin = !atLimit && !onCooldown && !claiming && !loading && !spinning;
  const pad = (n: number) => String(n).padStart(2, "0");

  const WHEEL_SIZE = 340;
  const R = WHEEL_SIZE / 2 - 10;
  const CX = WHEEL_SIZE / 2;
  const CY = WHEEL_SIZE / 2;
  const GAP = 2.5;

  const slicePaths = SEGMENTS.map((seg, i) => {
    const a1 = ((i * SLICE_DEG) + GAP / 2 - 90) * Math.PI / 180;
    const a2 = (((i + 1) * SLICE_DEG) - GAP / 2 - 90) * Math.PI / 180;
    const x1 = CX + R * Math.cos(a1);
    const y1 = CY + R * Math.sin(a1);
    const x2 = CX + R * Math.cos(a2);
    const y2 = CY + R * Math.sin(a2);
    return (
      <path
        key={i}
        d={`M${CX},${CY} L${x1},${y1} A${R},${R} 0 0,1 ${x2},${y2} Z`}
        fill={seg.color}
      />
    );
  });

  const sliceContents = SEGMENTS.map((seg, i) => {
    const midAngle = ((i + 0.5) * SLICE_DEG - 90) * Math.PI / 180;
    const labelR = R * 0.65;
    const tx = CX + labelR * Math.cos(midAngle);
    const ty = CY + labelR * Math.sin(midAngle);

    if (seg.type === "discord") {
      return (
        <g key={`c${i}`} transform={`translate(${tx}, ${ty})`}>
          <g transform="translate(-14, -14) scale(1.2)">
            <path
              d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"
              fill="#5865F2"
              transform="scale(0.9)"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,.5))" }}
            />
          </g>
          <g transform="translate(16, 16)">
            <rect x="-17" y="-10" width="34" height="20" rx="10" fill="#FFB800" />
            <text x="0" y="1" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="800" fill="#000">
              {seg.label}
            </text>
          </g>
        </g>
      );
    }

    return (
      <g key={`c${i}`} transform={`translate(${tx}, ${ty})`}>
        <text textAnchor="middle" dominantBaseline="central" fontSize="32" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,.6))" }}>
          {seg.emoji}
        </text>
        <g transform="translate(18, 18)">
          <rect x="-17" y="-10" width="34" height="20" rx="10" fill="#FFB800" />
          <text x="0" y="1" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="800" fill="#000">
            {seg.label}
          </text>
        </g>
      </g>
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative overflow-hidden font-sans flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 w-full">

        <div className="text-center mb-4">
          {atLimit ? (
            <h1 className="text-white text-2xl sm:text-3xl font-black tracking-tight">
              You have already used<br />your Free Spin
            </h1>
          ) : (
            <>
              <p className="text-[#FFB800] font-bold text-sm tracking-wide mb-1">Free spin every day</p>
              <h1 className="text-white text-2xl sm:text-3xl font-black tracking-tight">Spin to Earn Credits</h1>
            </>
          )}
        </div>

        <div className="relative z-20 mb-[-16px]" style={{ filter: "drop-shadow(0 0 14px rgba(255,184,0,.5))" }}>
          <svg width="42" height="34" viewBox="0 0 42 34" fill="none">
            <path d="M21 32L3 4h36L21 32Z" stroke="#FFB800" strokeWidth="3" fill="transparent" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="relative flex-shrink-0" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
          <svg
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            className="absolute inset-0"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning && !skipAnim ? "transform 3s cubic-bezier(.15,.7,.2,1)" : "none",
              filter: "drop-shadow(0 0 40px rgba(255,184,0,.15))",
            }}
          >
            {slicePaths}
            <circle cx={CX} cy={CY} r={R + 1} fill="none" stroke="#FFB800" strokeWidth="4" />
            {sliceContents}
          </svg>

          <button
            onClick={spin}
            disabled={!canSpin}
            className="absolute rounded-full flex flex-col items-center justify-center z-20 transition-transform active:scale-95 disabled:active:scale-100"
            style={{
              width: 130,
              height: 130,
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              background: "radial-gradient(circle at 35% 30%, #ffffff, #d4d4d4)",
              boxShadow: "0 0 40px rgba(255,255,255,.3), inset 0 -4px 12px rgba(0,0,0,.08)",
              border: "7px solid #0a0a0a",
              cursor: canSpin ? "pointer" : "default",
            }}
          >
            {atLimit || onCooldown ? (
              <>
                <span className="text-[#666] text-[10px] font-bold uppercase tracking-widest mb-0.5">
                  {atLimit ? "Resets In" : "Next Spin"}
                </span>
                <span className="text-[#111] text-[22px] font-black font-mono tracking-tight leading-none">
                  {atLimit
                    ? `${pad(timeLeft.h)}:${pad(timeLeft.m)}:${pad(timeLeft.s)}`
                    : `${pad(Math.floor(cooldownLeft / 60))}:${pad(cooldownLeft % 60)}`}
                </span>
              </>
            ) : (
              <span className="text-[#111] text-[26px] font-black">{spinning ? "..." : "SPIN"}</span>
            )}
          </button>
        </div>

        {message && (
          <p className={`text-sm mt-3 z-10 font-medium ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {message.text}
          </p>
        )}

        <div className="flex gap-3 w-full max-w-xs mt-5 z-10 px-4">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#FFB800]/50 rounded-2xl p-3 flex-1 text-center shadow-[0_0_15px_rgba(255,184,0,0.1)]">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-0.5">Credits</p>
            <p className="text-white text-xl font-black">{state?.credits ?? 0}</p>
          </div>
          <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#FFB800]/50 rounded-2xl p-3 flex-1 text-center shadow-[0_0_15px_rgba(255,184,0,0.1)]">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-0.5">Spins Today</p>
            <p className="text-white text-xl font-black">
              {state?.claimsToday ?? 0}
              <span className="text-gray-600 text-sm font-normal"> / {state?.dailyLimit ?? 10}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-5 z-10">
          <span className="text-gray-300 text-base">Skip animation</span>
          <button
            onClick={() => setSkipAnim(!skipAnim)}
            className="relative w-[52px] h-[28px] rounded-full transition-colors"
            style={{ background: skipAnim ? "#FFB800" : "#2a2a2a" }}
          >
            <div
              className="absolute top-[3px] w-[22px] h-[22px] rounded-full transition-all"
              style={{
                left: skipAnim ? "calc(100% - 25px)" : "3px",
                background: skipAnim ? "#111" : "#fff",
              }}
            />
          </button>
        </div>
      </main>

      {showCaptcha && (
        <div className="fixed inset-0 bg-black/85 flex flex-col items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 p-8 rounded-3xl flex flex-col items-center max-w-sm w-full">
            <h3 className="text-white text-xl font-bold mb-1">Verification Required</h3>
            <p className="text-gray-400 text-sm mb-6 text-center">Complete the captcha to claim your reward.</p>
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
              onVerify={handleCaptchaVerify}
              theme="dark"
              loadAsync
            />
            <button
              onClick={() => { setShowCaptcha(false); setSpinning(false); setMessage(null); }}
              className="mt-6 text-gray-500 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}