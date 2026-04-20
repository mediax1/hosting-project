"use client";

import { useState, useEffect } from "react";

const PLAN_COLORS: Record<string, string> = {
  starter: "text-gray-400",
  standard: "text-indigo-400",
  pro: "text-purple-400",
  power: "text-red-400",
};

const PLAN_SPECS: Record<string, { ram: string; cpu: string; storage: string }> = {
  starter:  { ram: "256MB", cpu: "20%",  storage: "1GB" },
  standard: { ram: "1GB",   cpu: "50%",  storage: "2GB" },
  pro:      { ram: "2GB",   cpu: "100%", storage: "4GB" },
  power:    { ram: "4GB",   cpu: "150%", storage: "6GB" },
};

const PLAN_PRICES: Record<string, { price7: number; price30: number }> = {
  starter:  { price7: 20,  price30: 60  },
  standard: { price7: 40,  price30: 140 },
  pro:      { price7: 80,  price30: 280 },
  power:    { price7: 150, price30: 520 },
};

type Server = {
  id: string;
  pteroUuid: string;
  name: string;
  language: string;
  plan: string;
  duration: number;
  expiresAt: string;
  status: string;
};

function LiveTimer({ expiresAt }: { expiresAt: string }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setDisplay("Expired"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (d > 0) setDisplay(`${d}d ${h}h ${m}m ${s}s`);
      else setDisplay(`${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  return <span>{display}</span>;
}

function RenewModal({ server, onClose, onRenewed }: { server: Server; onClose: () => void; onRenewed: (newExpiry: string, creditsLeft: number) => void }) {
  const [duration, setDuration] = useState<7 | 30>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cost = duration === 7 ? PLAN_PRICES[server.plan].price7 : PLAN_PRICES[server.plan].price30;

  const handleRenew = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/servers/renew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverId: server.id, duration }),
    });
    const data = await res.json();
    if (res.ok) {
      onRenewed(data.newExpiry, data.creditsLeft);
      onClose();
    } else {
      setError(data.error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 w-full max-w-sm space-y-5">
        <div>
          <h3 className="text-white font-bold text-base">Renew Server</h3>
          <p className="text-gray-500 text-xs mt-1">{server.name}</p>
        </div>

        <div className="space-y-2">
          <p className="text-gray-400 text-xs uppercase tracking-widest">Duration</p>
          <div className="flex gap-3">
            {([7, 30] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  duration === d
                    ? "border-indigo-500 bg-indigo-500/10 text-white"
                    : "border-white/8 text-gray-400 hover:text-white"
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="flex items-center justify-between pt-1">
          <p className="text-gray-500 text-sm">Cost: <span className="text-white font-bold">{cost} credits</span></p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRenew}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? "Renewing..." : "Renew"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServerList({ initialServers, pterodactylUrl }: { initialServers: Server[]; pterodactylUrl: string }) {
  const [servers, setServers] = useState(initialServers);
  const [renewingServer, setRenewingServer] = useState<Server | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleRenewed = (serverId: string, newExpiry: string) => {
    setServers((prev) =>
      prev.map((s) => s.id === serverId ? { ...s, expiresAt: newExpiry, status: "active" } : s)
    );
  };

  const handleDelete = async (serverId: string) => {
    setDeletingId(serverId);
    const res = await fetch("/api/servers/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverId }),
    });
    if (res.ok) {
      setServers((prev) => prev.map((s) => s.id === serverId ? { ...s, status: "deleted" } : s));
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const active = servers.filter((s) => s.status !== "deleted");

  if (active.length === 0) {
    return (
      <div className="bg-[#111111] border border-white/8 rounded-xl p-10 text-center">
        <p className="text-gray-500 text-sm">No servers yet</p>
        <p className="text-gray-600 text-xs mt-1">Create your first server to get started</p>
      </div>
    );
  }

  return (
    <>
      {renewingServer && (
        <RenewModal
          server={renewingServer}
          onClose={() => setRenewingServer(null)}
          onRenewed={(newExpiry) => handleRenewed(renewingServer.id, newExpiry)}
        />
      )}

      <div className="space-y-3">
        {active.map((server) => {
          const expired = new Date(server.expiresAt).getTime() < Date.now();
          const specs = PLAN_SPECS[server.plan];
          const planColor = PLAN_COLORS[server.plan];
          const isDeleting = deletingId === server.id;
          const confirmingDelete = confirmDeleteId === server.id;

          return (
            <div key={server.id} className="bg-[#111111] border border-white/8 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${expired ? "bg-red-500" : "bg-green-400"}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold text-sm">{server.name}</p>
                      <span className={`text-xs font-medium capitalize ${planColor}`}>{server.plan}</span>
                      <span className="text-gray-600 text-xs">{server.language === "nodejs" ? "Node.js" : "Python"}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                      <span>{specs?.ram} RAM</span>
                      <span>·</span>
                      <span>{specs?.cpu} CPU</span>
                      <span>·</span>
                      <span>{specs?.storage} Disk</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!expired && server.pteroUuid && (
                    <a
                      href={`${pterodactylUrl}/server/${server.pteroUuid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/8 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Manage
                    </a>
                  )}
                  <button
                    onClick={() => setRenewingServer(server)}
                    className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-400 text-xs font-medium rounded-lg transition-colors"
                  >
                    Renew
                  </button>
                  {confirmingDelete ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(server.id)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-40"
                      >
                        {isDeleting ? "..." : "Confirm"}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 text-gray-500 hover:text-white text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(server.id)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <div className={`mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs ${expired ? "text-red-400" : "text-gray-500"}`}>
                <span>{expired ? "Expired" : "Expires in"}</span>
                <span className={`font-mono ${expired ? "text-red-400" : "text-gray-300"}`}>
                  <LiveTimer expiresAt={server.expiresAt} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}