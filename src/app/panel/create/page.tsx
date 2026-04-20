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
    <div className="min-h-screen bg-[#080808]">
      <header className="border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-base">
          Hosting<span className="text-indigo-400">Site</span>
        </Link>
        <Link href="/panel" className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Back to panel
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-gray-500 text-sm mb-1">Panel / Create</p>
        <h1 className="text-white text-2xl font-bold mb-10">Create Server</h1>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-gray-400 text-xs uppercase tracking-widest">Server Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-discord-bot"
              maxLength={32}
              className="w-full bg-[#111111] border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-xs uppercase tracking-widest">Language</label>
            <div className="flex gap-3">
              {(["python", "nodejs"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    language === lang
                      ? "border-indigo-500 bg-indigo-500/10 text-white"
                      : "border-white/8 bg-[#111111] text-gray-400 hover:text-white"
                  }`}
                >
                  {lang === "nodejs" ? "Node.js" : "Python"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-gray-400 text-xs uppercase tracking-widest">Plan</label>
            <div className="grid grid-cols-2 gap-3">
              {PLANS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPlan(p.key)}
                  className={`relative text-left p-4 rounded-xl border transition-colors ${
                    plan === p.key ? p.color + " bg-white/3" : "border-white/8 bg-[#111111] hover:border-white/20"
                  }`}
                >
                  {p.badge && (
                    <span className="absolute top-3 right-3 text-[10px] text-indigo-400 font-medium">{p.badge}</span>
                  )}
                  <p className="text-white font-semibold text-sm mb-2">{p.name}</p>
                  <div className="space-y-0.5 text-xs text-gray-500">
                    <p>RAM: <span className="text-gray-300">{p.ram}</span></p>
                    <p>CPU: <span className="text-gray-300">{p.cpu}</span></p>
                    <p>Storage: <span className="text-gray-300">{p.storage}</span></p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-500">
                    <span className="text-indigo-400 font-semibold">{p.price7}cr</span> / 7d &nbsp;·&nbsp;
                    <span className="text-indigo-400 font-semibold">{p.price30}cr</span> / 30d
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-xs uppercase tracking-widest">Duration</label>
            <div className="flex gap-3">
              {([7, 30] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    duration === d
                      ? "border-indigo-500 bg-indigo-500/10 text-white"
                      : "border-white/8 bg-[#111111] text-gray-400 hover:text-white"
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <p className="text-gray-500 text-sm">
              Total: <span className="text-white font-bold">{cost} credits</span>
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading || !name.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors duration-150"
            >
              {loading ? "Creating..." : "Create Server"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}