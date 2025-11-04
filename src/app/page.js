// app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 via-white to-sky-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              {/* SVG logo */}
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10.5C3 16.299 8.043 21 14 21v-2.5"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.95"
                  />
                  <path
                    d="M21 8.5c0-5.5-6.477-6-7.5-6C11.478 2.5 6 3 6 8.5S11.478 15 13.5 15c1.023 0 7.5-.5 7.5-6.5z"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.95"
                  />
                </svg>
              </div>

              <div className="leading-tight">
                <h1 className="text-lg sm:text-2xl font-semibold text-slate-800">Call Engine</h1>
                <p className="text-xs sm:text-sm text-slate-500">Automated sheet-driven calling workflow</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-3">
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Get Started
                <svg className="w-4 h-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <a
                href="tel:+911234567890"
                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 transition text-sm sm:text-base"
                aria-label="Call Call Engine"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.83.36 1.64.7 2.4a2 2 0 0 1-.45 2.11L8.7 9.7a16 16 0 0 0 6 6l1.47-1.47a2 2 0 0 1 2.11-.45c.76.34 1.57.58 2.4.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="0.6" />
                </svg>
                Call
              </a>
            </nav>

            {/* mobile controls */}
            <div className="flex md:hidden items-center gap-2">
              <Link href="/editor" className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Start</Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left content */}
          <section className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight">
                Automate voice calls from your sheets — reliably.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600">
                Call Engine connects Google Sheets, Make.com and Twilio into a single workflow: edit contacts,
                save to the sheet, and trigger calls — all from a polished, secure UI.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-3 px-5 py-3 bg-blue-600 text-white rounded-lg text-sm sm:text-base font-semibold shadow hover:bg-blue-700 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Get Started
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-lg text-sm sm:text-base text-slate-700 hover:bg-slate-50 transition"
                >
                  Learn more
                </a>
              </div>
            </div>

            {/* Feature cards */}
            <div id="features" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureCard
                title="Sheet-driven"
                text="Your Google Sheet is the single source of truth. Edit, save, and run with confidence."
                icon="sheet"
              />
              <FeatureCard
                title="No-code + Code"
                text="Use Make.com scenarios for orchestration, while the UI gives you control and visibility."
                icon="flow"
              />
              <FeatureCard
                title="Secure"
                text="Service account + server APIs keep sensitive credentials secure & server-side."
                icon="shield"
              />
              <FeatureCard
                title="Extensible"
                text="Add analytics, logging, or multi-channel actions — Call Engine grows with your needs."
                icon="expand"
              />
            </div>
          </section>

          {/* Mockup / visual card */}
          <aside className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="bg-linear-to-br from-blue-700 to-indigo-600 p-5 sm:p-6 rounded-3xl text-white shadow-2xl transform hover:-translate-y-1 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">Call Engine</div>
                    <div className="text-xs opacity-90 mt-1">Sheet → Make.com → Twilio</div>
                  </div>
                  <div className="bg-white/10 px-3 py-1 rounded text-sm">Live</div>
                </div>

                <div className="mt-4 bg-white/10 p-3 rounded-lg">
                  <div className="text-xs text-white/90">Contacts</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>Alice</div>
                    <div className="text-right">+91 91234 56789</div>
                    <div>Bob</div>
                    <div className="text-right">+91 98765 43210</div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link href="/editor" className="px-3 py-2 bg-white text-blue-700 rounded shadow-sm text-sm">Open Editor</Link>
                  <a href="#" className="px-3 py-2 border rounded text-sm">Docs</a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
          <div>© {new Date().getFullYear()} Call Engine</div>
          <div>Built with Next.js • Make.com • Twilio</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Small feature card component (inline) ---------- */
function FeatureCard({ title, text, icon }) {
  const Icon = getIcon(icon);
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex gap-3 items-start">
      <div className="w-12 h-12 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
        <Icon />
      </div>
      <div>
        <div className="font-semibold text-slate-800">{title}</div>
        <div className="text-sm text-slate-500 mt-1">{text}</div>
      </div>
    </div>
  );
}

function getIcon(name) {
  if (name === "sheet")
    return () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 3h10v4H7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 7h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "flow")
    return () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 7h10M7 12h10M7 17h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "shield")
    return () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l7 4v5c0 5-4 9-7 9s-7-4-7-9V7l7-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  // fallback
  return () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
