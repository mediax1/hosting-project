"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleStart = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    router.push(token ? "/panel" : "/login");
  };

  return (
    <section className="min-h-screen bg-[#080808] flex items-center px-6">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

        <div className="flex flex-col gap-8">
          <p className="text-gray-500 text-sm uppercase tracking-[0.2em] font-medium">
            Discord Bot Hosting
          </p>

          <h1 className="text-white text-6xl lg:text-7xl font-black leading-none tracking-tight">
            Keep your
            <br />
            bot{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              alive.
            </span>
          </h1>

          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Simple, affordable hosting built for Discord bots. Deploy in seconds, forget about downtime.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors duration-150"
            >
              Start for free
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-white/5">
            {[
              { value: "$0", label: "to start" },
              { value: "99.9%", label: "uptime" },
              { value: "< 1min", label: "deploy time" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white font-bold text-lg">{s.value}</p>
                <p className="text-gray-600 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute w-64 h-64 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative w-full max-w-sm">
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 5a1 1 0 00-1 1v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L13 11.586V8a1 1 0 00-1-1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">MyBot</p>
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Online
                  </p>
                </div>
                <div className="ml-auto text-xs text-gray-600">just now</div>
              </div>

              {[
                { cmd: "/help", res: "Here are my commands..." },
                { cmd: "/ping", res: "Pong! 12ms latency" },
                { cmd: "/stats", res: "Server has 1,204 members" },
              ].map((item) => (
                <div key={item.cmd} className="space-y-1">
                  <p className="text-blue-400 text-sm font-mono">{item.cmd}</p>
                  <p className="text-gray-400 text-xs pl-3 border-l border-white/10">{item.res}</p>
                </div>
              ))}

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-600">
                <span>Uptime: 47d 12h</span>
                <span className="text-green-500">● Healthy</span>
              </div>
            </div>

            <div className="mt-3 bg-[#111111] border border-white/8 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs">Memory usage</p>
                <p className="text-white text-sm font-semibold mt-0.5">128 MB / 512 MB</p>
              </div>
              <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}