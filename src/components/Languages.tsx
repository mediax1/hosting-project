

export default function Languages() {
  const supported = [
    {
      name: "Node.js",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M11.998 24a1.474 1.474 0 01-.735-.196l-2.34-1.385c-.35-.196-.179-.265-.063-.306.466-.161.559-.197 1.055-.478a.177.177 0 01.17.014l1.797 1.067a.228.228 0 00.218 0l7.005-4.044a.221.221 0 00.109-.19V7.517a.222.222 0 00-.11-.192l-7.003-4.042a.221.221 0 00-.218 0L4.878 7.325a.222.222 0 00-.11.192v8.085c0 .078.042.15.11.189l1.918 1.108c1.041.52 1.678-.093 1.678-.708V8.27a.2.2 0 01.2-.2h.874a.2.2 0 01.2.2v7.921c0 1.386-.755 2.18-2.069 2.18-.404 0-.722 0-1.609-.438L3.34 16.87a1.478 1.478 0 01-.735-1.278V7.517c0-.527.28-1.016.735-1.279l7.004-4.044a1.532 1.532 0 011.47 0l7.004 4.044c.455.263.735.752.735 1.279v8.075c0 .526-.28 1.016-.735 1.279l-7.004 4.044a1.474 1.474 0 01-.735.196z" />
        </svg>
      ),
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
    },
    {
      name: "Python",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.031v-2.867s-.109-3.404 3.348-3.404h5.771s3.24.052 3.24-3.131V3.129S18.28 0 11.914 0zM8.708 1.81a1.042 1.042 0 110 2.083 1.042 1.042 0 010-2.083zM12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.031v2.867s.109 3.404-3.348 3.404H9.447s-3.24-.052-3.24 3.131v5.401S5.72 24 12.086 24zm3.206-1.81a1.042 1.042 0 110-2.083 1.042 1.042 0 010 2.083z" />
        </svg>
      ),
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
  ];

  const coming = ["Rust", "Go", "Java", "Ruby"];

  return (
    <section className="bg-[#080808] py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-gray-500 text-sm uppercase tracking-[0.2em] font-medium mb-3">
            Runtime support
          </p>
          <h2 className="text-white text-4xl font-black tracking-tight">
            Your language, your bot.
          </h2>
          <p className="text-gray-500 text-base mt-3 max-w-md">
            We support the most popular bot runtimes today, with more on the way.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
          {supported.map((lang) => (
            <div
              key={lang.name}
              className={`flex items-center gap-4 p-5 rounded-xl border ${lang.border} ${lang.bg} group`}
            >
              <span className={lang.color}>{lang.icon}</span>
              <div>
                <p className="text-white font-semibold text-base">{lang.name}</p>
                <p className="text-green-400 text-xs font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Supported
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="text-gray-600 text-sm mr-1">Coming soon:</p>
          {coming.map((lang) => (
            <span
              key={lang}
              className="px-3 py-1 text-xs text-gray-500 border border-white/8 rounded-full bg-white/3"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}