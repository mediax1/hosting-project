"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const HOLD_DURATION = 2000;

type State = {
  credits: number;
  claimsToday: number;
  dailyLimit: number;
  cooldownMs: number;
  captchaEvery: number;
  lastClaimAt: string | null;
};

export default function EarnPage() {
  const [state, setState] = useState<State | null>(null);
  const [loading, setLoading] = useState(true);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const holdStart = useRef<number>(0);
  const captchaRef = useRef<HCaptcha>(null);

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
    setHoldProgress(0);
  }, [state]);

  const startHold = useCallback(() => {
    if (cooldownLeft > 0 || claiming || !state || state.claimsToday >= state.dailyLimit) return;
    setHolding(true);
    setMessage(null);
    holdStart.current = Date.now();

    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - holdStart.current;
      setHoldProgress(Math.min((elapsed / HOLD_DURATION) * 100, 100));
    }, 16);

    holdTimer.current = setTimeout(() => {
      clearInterval(progressTimer.current!);
      setHolding(false);
      setHoldProgress(100);
      const needsCaptcha = state.claimsToday > 0 && state.claimsToday % state.captchaEvery === 0;
      if (needsCaptcha && !captchaToken) {
        setShowCaptcha(true);
        setMessage({ type: "error", text: "Please complete the captcha to continue." });
      } else {
        doClaim(captchaToken ?? undefined);
      }
    }, HOLD_DURATION);
  }, [cooldownLeft, claiming, state, captchaToken, doClaim]);

  const cancelHold = useCallback(() => {
    if (!holding) return;
    clearTimeout(holdTimer.current!);
    clearInterval(progressTimer.current!);
    setHolding(false);
    setHoldProgress(0);
  }, [holding]);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setShowCaptcha(false);
    doClaim(token);
  };

  const atLimit = state ? state.claimsToday >= state.dailyLimit : false;
  const onCooldown = cooldownLeft > 0;
  const disabled = atLimit || onCooldown || claiming || loading;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <header className="border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-base">
          Hosting<span className="text-indigo-400">Site</span>
        </Link>
        <Link href="/panel" className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Back to panel
        </Link>
      </header>

      <main className="max-w-md mx-auto px-6 py-16">
        <p className="text-gray-500 text-sm mb-1">Panel / Earn</p>
        <h1 className="text-white text-2xl font-bold mb-2">Earn Credits</h1>
        <p className="text-gray-500 text-sm mb-10">
          Hold the button for 2 seconds to earn 1 credit. Every {state?.captchaEvery} claims a captcha is required.
        </p>

        <div className="flex gap-4 mb-10">
          <div className="bg-[#111111] border border-white/8 rounded-xl p-4 flex-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Credits</p>
            <p className="text-white text-3xl font-black">{state?.credits ?? 0}</p>
          </div>
          <div className="bg-[#111111] border border-white/8 rounded-xl p-4 flex-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Today</p>
            <p className="text-white text-3xl font-black">
              {state?.claimsToday ?? 0}
              <span className="text-gray-600 text-lg font-normal"> / {state?.dailyLimit ?? 10}</span>
            </p>
          </div>
        </div>

        {atLimit ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 text-center">
            <p className="text-yellow-400 font-semibold text-sm">Daily limit reached</p>
            <p className="text-gray-500 text-xs mt-1">Come back tomorrow to earn more credits.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <button
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                disabled={disabled}
                className="relative w-36 h-36 rounded-full bg-[#111111] border-2 border-white/10 flex items-center justify-center select-none disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:border-indigo-500"
                style={{ userSelect: "none" }}
              >
                <svg viewBox="0 0 144 144" className="absolute inset-0 w-full h-full -rotate-90" style={{ pointerEvents: "none" }}>
                  <circle cx="72" cy="72" r="68" fill="none" stroke="#ffffff10" strokeWidth="4" />
                  <circle
                    cx="72" cy="72" r="68"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 68}`}
                    strokeDashoffset={`${2 * Math.PI * 68 * (1 - holdProgress / 100)}`}
                    style={{ transition: holding ? "none" : "stroke-dashoffset 0.2s ease" }}
                  />
                </svg>
                <span className="text-white text-sm font-semibold z-10 text-center leading-tight px-2">
                  {onCooldown ? `${cooldownLeft}s` : holding ? "Hold..." : "Hold"}
                </span>
              </button>
            </div>

            {message && (
              <p className={`text-sm text-center ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {message.text}
              </p>
            )}

            {showCaptcha && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-gray-400 text-xs">Complete the captcha to continue</p>
                <HCaptcha
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                  onVerify={handleCaptchaVerify}
                  theme="dark"
                  loadAsync
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}