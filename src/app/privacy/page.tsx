"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";


export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col relative z-10 text-white selection:bg-[#FFB800] selection:text-black">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 md:px-8 py-12 md:py-24">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
            Your privacy is important to us. This policy explains how we collect, use, and protect your data.
            <br />
            Last Updated: 22/04/2026
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#content"
              className="px-6 py-2.5 bg-[#FFB800] hover:bg-[#E5A500] text-black text-sm font-bold rounded-xl shadow-sm shadow-[#FFB800]/20 transition-all active:scale-95"
            >
              Read Policy
            </a>
            <Link
              href="/"
              className="px-6 py-2.5 border border-white/10 hover:bg-white/5 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div id="content" className="space-y-8 scroll-mt-24">
          
          {/* Section 1 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>
                When you use dynexus bot.space hosting, we may collect the following types of information:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#FFB800]">
                <li><span className="text-white font-medium">Account Information:</span> such as your email address, Discord ID, and username when you register.</li>
                <li><span className="text-white font-medium">Server Data:</span> files, databases, and configurations that you upload to our containers to run your applications.</li>
                <li><span className="text-white font-medium">Usage Data:</span> interactions with our panel, IP addresses, and standard server log information for security and optimization purposes.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We use the collected data exclusively to:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#FFB800]">
                <li>Provide, maintain, and improve our hosting services.</li>
                <li>Process your transactions and manage billing.</li>
                <li>Provide customer support and respond to inquiries.</li>
                <li>Monitor for security vulnerabilities and prevent malicious activities (such as DDoS attacks or abuse of our infrastructure).</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              3. Data Security & Protection
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              We implement industry-standard security measures to protect your personal data and server files against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission or electronic storage method is 100% secure. You are also responsible for keeping your login credentials safe.
            </p>
          </div>

          {/* Section 4 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              4. Data Sharing & Third Parties
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light mb-6">
              dynexus bot.space hosting does <span className="text-white font-medium">not</span> sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and trusted affiliates. We may use third-party service providers to help us operate our business (e.g., payment gateways), provided that they agree to keep your information confidential.
            </p>
          </div>

          {/* Section 5 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              5. Data Retention and Deletion
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. If you delete your account or cancel your services, your associated server data and personal information will be permanently erased from our active servers within a reasonable timeframe, unless legally required to retain it.
            </p>
          </div>

          {/* Section 6 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              6. Your Consent & Changes to Policy
            </h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>
                By using our services, you signify your acceptance of this policy and our Terms of Service. If you do not agree, please do not use our site.
              </p>
              <p>
                We reserve the right to update this Privacy Policy at any time. We encourage users to frequently check this page for any changes. Your continued use of the service following the posting of changes to this policy will be deemed your acceptance of those changes.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              7. Contact Us
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us through our Discord server or via email at contact@dynexus.space.
            </p>
          </div>

        </div>
      </main>


    </div>
  );
}
