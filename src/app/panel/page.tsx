import { getUser, getAvatarUrl } from "@/lib/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import Image from "next/image";
import Link from "next/link";
import ServerList from "../../components/ServerList";

export default async function PanelPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const db = (await clientPromise).db();
  const record = await db.collection("users").findOne({ discordId: user.id });
  const credits = record?.credits ?? 0;
  const servers = (record?.servers ?? []).map((s: Record<string, unknown>) => ({
    ...s,
    expiresAt: new Date(s.expiresAt as Date).toISOString(),
    createdAt: new Date(s.createdAt as Date).toISOString(),
  }));

  return (
    <div className="min-h-screen bg-[#080808]">
      <header className="border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-base">
          Hosting<span className="text-indigo-400">Site</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/api/auth/logout" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Logout</Link>
          <span className="text-gray-400 text-sm">{user.username}</span>
          <Image
            src={getAvatarUrl(user)}
            alt={user.username}
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div>
          <p className="text-gray-500 text-sm mb-1">Dashboard</p>
          <h1 className="text-white text-2xl font-bold mb-6">Overview</h1>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#111111] border border-white/8 rounded-xl p-6">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Credits</p>
              <p className="text-white text-5xl font-black">{credits}</p>
              <p className="text-gray-600 text-xs mt-2 mb-5">Available to spend</p>
              <Link
                href="/panel/earn"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors duration-150"
              >
                Earn Credits
              </Link>
            </div>

            <Link
              href="/panel/create"
              className="bg-[#111111] border border-white/8 hover:border-white/20 rounded-xl p-6 flex flex-col justify-between transition-colors duration-150 group"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-base">Create Server</p>
                <p className="text-gray-500 text-xs mt-1">Deploy a new bot server</p>
              </div>
              <p className="text-indigo-400 text-xs mt-6 group-hover:text-indigo-300 transition-colors">Get started →</p>
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-bold">Your Servers</h2>
            <span className="text-gray-600 text-xs">
              {servers.filter((s: { status: string }) => s.status !== "deleted").length} server(s)
            </span>
          </div>
          <ServerList
            initialServers={servers}
            pterodactylUrl={process.env.NEXT_PUBLIC_PTERODACTYL_URL ?? ""}
          />
        </div>
      </main>
    </div>
  );
}