import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import Link from "next/link";

export default async function PanelPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  let credits = 0;
  let servers: any[] = [];

  try {
    const db = (await clientPromise).db();
    const record = await db.collection("users").findOne({ discordId: user.id });
    credits = record?.credits ?? 0;
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
        <h1 className="text-white text-3xl font-black tracking-tight">Overview</h1>
        <p className="text-gray-400 mt-2 text-sm font-medium">Welcome back, check your stats and manage your servers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#FFB800]/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#FFB800]/20 transition-all duration-500" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#FFB800]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[#FFB800] text-xs font-bold px-2.5 py-1 bg-[#FFB800]/10 rounded-full">Balance</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Available Credits</p>
            <h2 className="text-white text-5xl font-black tracking-tight">{credits}</h2>
          </div>
          <div className="mt-8">
            <Link href="/panel/earn" className="block w-full text-center bg-[#FFB800] hover:bg-[#E5A500] text-black font-bold py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(255,184,0,0.2)]">
              Earn More
            </Link>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-bold px-2.5 py-1 bg-white/5 rounded-full">Network</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Active Servers</p>
            <h2 className="text-white text-5xl font-black tracking-tight">{activeCount}</h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Out of {servers.length} total deployments</p>
          </div>
          <div className="mt-8">
            <Link href="/panel/servers" className="block w-full text-center bg-[#1a1a1a] hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors border border-white/5">
              Manage Servers
            </Link>
          </div>
        </div>

        <Link href="/panel/create" className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/50 hover:bg-[#FFB800]/5 transition-all duration-300 min-h-[250px]">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#FFB800] group-hover:border-[#FFB800] transition-all duration-500 shadow-xl">
            <svg className="w-8 h-8 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h3 className="text-white text-xl font-bold mb-2">Create New Server</h3>
          <p className="text-gray-500 text-sm font-medium px-4">Deploy a new Discord bot in seconds.</p>
        </Link>
        
      </div>
    </div>
  );
}