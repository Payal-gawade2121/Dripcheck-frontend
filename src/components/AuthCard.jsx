import React from 'react';

const HIGHLIGHTS = [
  'AI-curated outfits built from your own wardrobe',
  'Match any piece to a full look in seconds',
  'Track colours, fits and occasions automatically',
];

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="w-full max-w-6xl grid lg:grid-cols-[1.05fr_1fr] bg-white border border-gray-100 lg:rounded-[2rem] lg:shadow-[0_40px_120px_-30px_rgba(9,12,24,0.35)] overflow-hidden">
      {/* Brand panel — desktop only */}
      <aside className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-[#0a0f1c] text-white p-12 xl:p-14">
        <div
          className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-32 -left-20 w-[420px] h-[420px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 65%)' }}
        />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="font-black tracking-[0.28em] text-base">DRIPCHECK</span>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-[2.6rem] xl:text-5xl font-bold leading-[1.1] tracking-tight">
            Never wonder
            <br />
            what to wear again.
          </h2>
          <p className="mt-5 text-white/60 text-[15px] leading-relaxed max-w-sm">
            Your digital wardrobe, styled by AI. Add what you own and get complete looks that
            actually fit together.
          </p>

          <ul className="mt-9 space-y-3.5">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/75">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-2.5 h-2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/35">© {new Date().getFullYear()} DripCheck</p>
      </aside>

      {/* Form panel */}
      <div className="flex flex-col px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div className="lg:hidden flex items-center justify-center gap-2.5 mb-9">
          <div className="w-9 h-9 rounded-xl bg-[#0a0f1c] text-white flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4.5 h-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span className="font-black tracking-[0.2em] text-sm text-gray-900">DRIPCHECK</span>
        </div>

        <h1 className="text-[2rem] sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">{title}</h1>
        {subtitle && <p className="mt-2.5 text-gray-500 text-[15px]">{subtitle}</p>}

        <div className="mt-9 flex-1">{children}</div>

        {footer && <div className="mt-9">{footer}</div>}
      </div>
    </div>
  );
}
