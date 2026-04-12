import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-[#f0ede8] overflow-hidden flex flex-col">

      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -right-24 w-150 h-150 rounded-full bg-[radial-gradient(circle,rgba(213,100,60,0.12)_0%,transparent_70%)]" />
        <div className="absolute -bottom-20 -left-24 w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(100,60,200,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-6 border-b border-white/8">
        <span className="font-extrabold text-lg tracking-tight">
          reel<span className="text-[#d5643c]">.</span>up
        </span>
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            explore
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            upload
          </Link>
          <Link
            href="/login"
            className="text-sm px-4 py-1.5 rounded-full border border-white/25 hover:bg-white/8 hover:border-white/40 transition-all"
          >
            sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-20 flex-1">

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#d5643c] border border-[#d5643c]/35 px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d5643c] animate-pulse" />
          now live
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(40px,7vw,80px)] font-extrabold leading-none tracking-[-2px] max-w-3xl mb-6">
          Upload. Share.{" "}
          <em className="font-light not-italic text-white/40">Be seen.</em>
        </h1>

        {/* Subtext */}
        <p className="text-base font-light leading-relaxed text-white/55 max-w-md mb-12">
          A full-stack video platform where creators upload, share, and discover
          content — built with Next.js, MongoDB, and ImageKit.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="text-sm px-7 py-3 rounded-full bg-[#d5643c] text-white hover:bg-[#bf5530] transition-colors"
          >
            start uploading
          </Link>
          <Link
            href="/dashboard"
            className="text-sm px-7 py-3 rounded-full border border-white/20 text-white/70 hover:border-white/45 hover:text-white transition-all"
          >
            browse videos
          </Link>
        </div>

        {/* Tech stack chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-16">
          {[
            "Next.js 16",
            "TypeScript",
            "MongoDB",
            "NextAuth.js",
            "ImageKit",
            "Tailwind CSS",
          ].map((tech) => (
            <span
              key={tech}
              className="text-[11px] tracking-wide text-white/35 border border-white/10 px-4 py-1.5 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
