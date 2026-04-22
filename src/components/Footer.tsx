import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full text-center py-3 md:py-4 text-[#555] text-[9px] sm:text-xs font-semibold tracking-wide flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-4">
      <Link href="#" className="hover:text-gray-300 transition">Advertise with us</Link>
      <span className="text-[#333]">•</span>
      <Link href="#" className="hover:text-gray-300 transition">About</Link>
      <span className="text-[#333]">•</span>
      <Link href="/privacy" className="hover:text-gray-300 transition">Privacy Policy</Link>
      <span className="text-[#333]">•</span>
      <Link href="/tos" className="hover:text-gray-300 transition">Terms &amp; Conditions</Link>
    </footer>
  );
}
