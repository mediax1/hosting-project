import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import ServerList from "@/components/ServerList";

export default async function ServersPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  let servers: any[] = [];
  try {
    const db = (await clientPromise).db();
    const record = await db.collection("users").findOne({ discordId: user.id });
    servers = (record?.servers ?? []).map((s: Record<string, unknown>) => ({
      ...s,
      expiresAt: new Date(s.expiresAt as Date).toISOString(),
      createdAt: new Date(s.createdAt as Date).toISOString(),
    }));
  } catch (error) {
    console.error("Failed to connect to MongoDB, using default data for UI.");
  }

  const activeCount = servers.filter((s: { status: string }) => s.status !== "deleted").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-black tracking-tight">Current Servers</h1>
        <p className="text-gray-400 mt-2 text-sm font-medium">Manage your active and inactive servers.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#FFB800]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white text-lg font-bold">Your Servers</h2>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">{activeCount} ACTIVE</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <ServerList
            initialServers={servers}
            pterodactylUrl={process.env.NEXT_PUBLIC_PTERODACTYL_URL ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
