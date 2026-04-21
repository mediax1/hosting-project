"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PLANS = [
  { key: "starter",  name: "Starter",  badge: null,           color: "border-white/10",      ram: "256MB", cpu: "20%",  storage: "1GB", price7: 20,  price30: 60  },
  { key: "standard", name: "Standard", badge: "⭐ Most Popular", color: "border-indigo-500/60", ram: "1GB",   cpu: "50%",  storage: "2GB", price7: 40,  price30: 140 },
  { key: "pro",      name: "Pro",      badge: null,           color: "border-white/10",      ram: "2GB",   cpu: "100%", storage: "4GB", price7: 80,  price30: 280 },
  { key: "power",    name: "Power",    badge: null,           color: "border-white/10",      ram: "4GB",   cpu: "150%", storage: "6GB", price7: 150, price30: 520 },
];

export default function CreateServerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState<"nodejs" | "python">("python");
  const [plan, setPlan] = useState("standard");
  const [duration, setDuration] = useState<7 | 30>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = PLANS.find((p) => p.key === plan)!;
  const cost = duration === 7 ? selectedPlan.price7 : selectedPlan.price30;

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Server name is required."); return; }
    setLoading(true);
    setError(null);
    const res = await fetch("/api/servers/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), language, plan, duration }),
    });

    let data: { error?: string } = {};
    try {
      data = await res.json();
    } catch {
      setError("Server error. Please try again.");
      setLoading(false);
      return;
    }

    if (res.ok) {
      router.push("/panel");
    } else {
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-black tracking-tight">Create Server</h1>
        <p className="text-gray-400 mt-2 text-sm font-medium">Deploy a new high-performance bot server.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFB800]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="space-y-8 relative z-10">
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Server Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-discord-bot"
              maxLength={32}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FFB800]/50 transition-colors shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Language</label>
            <div className="flex gap-3">
              {(["python", "nodejs"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all duration-200 ${
                    language === lang
                      ? "border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800] shadow-[0_0_15px_rgba(255,184,0,0.15)]"
                      : "border-white/10 bg-[#1a1a1a] text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {lang === "nodejs" ? "Node.js" : "Python"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Plan</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PLANS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPlan(p.key)}
                  className={`relative text-left p-5 rounded-xl border transition-all duration-200 ${
                    plan === p.key ? "border-[#FFB800] bg-[#FFB800]/5 shadow-[0_0_20px_rgba(255,184,0,0.1)]" : "border-white/10 bg-[#1a1a1a] hover:border-white/30"
                  }`}
                >
                  {p.badge && (
                    <span className="absolute top-4 right-4 text-[10px] text-[#FFB800] font-bold bg-[#FFB800]/10 px-2 py-1 rounded-full">{p.badge}</span>
                  )}
                  <p className="text-white font-black text-lg mb-2">{p.name}</p>
                  <div className="space-y-1 text-xs text-gray-500 font-medium">
                    <p>RAM: <span className="text-gray-300 font-bold">{p.ram}</span></p>
                    <p>CPU: <span className="text-gray-300 font-bold">{p.cpu}</span></p>
                    <p>Storage: <span className="text-gray-300 font-bold">{p.storage}</span></p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500 font-medium flex items-center justify-between">
                    <span>
                      <span className="text-[#FFB800] font-black text-sm">{p.price7}cr</span> / 7d
                    </span>
                    <span>
                      <span className="text-[#FFB800] font-black text-sm">{p.price30}cr</span> / 30d
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Duration</label>
            <div className="flex gap-3">
              {([7, 30] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all duration-200 ${
                    duration === d
                      ? "border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800] shadow-[0_0_15px_rgba(255,184,0,0.15)]"
                      : "border-white/10 bg-[#1a1a1a] text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm font-medium p-3 bg-red-400/10 border border-red-400/20 rounded-lg">{error}</p>}

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Cost</p>
              <p className="text-white text-xl font-black">{cost} <span className="text-sm font-semibold text-gray-400">credits</span></p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !name.trim()}
              className="px-8 py-3 bg-[#FFB800] hover:bg-[#E5A500] disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-black rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(255,184,0,0.25)]"
            >
              {loading ? "Creating..." : "Deploy Server"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}