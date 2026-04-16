import { getUser, getAvatarUrl } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function PanelPage() {
  const user = await getUser();

  if (!user) redirect("/login");

  const credits = 0;

  return (
    <div className="min-h-screen bg-[#080808]">
      <header className="border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-base">
          Hosting<span className="text-indigo-400">Site</span>
        </Link>

        <div className="flex items-center gap-3">
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

      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-gray-500 text-sm mb-1">Dashboard</p>
        <h1 className="text-white text-2xl font-bold mb-10">Overview</h1>

        <div className="bg-[#111111] border border-white/8 rounded-xl p-6 max-w-xs">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Credits</p>
          <p className="text-white text-5xl font-black">{credits}</p>
          <p className="text-gray-600 text-xs mt-2">Available to spend</p>
        </div>

        <Link
          href="/panel/earn"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors duration-150"
        >
          Earn Credits
        </Link>
      </main>
    </div>
  );
}