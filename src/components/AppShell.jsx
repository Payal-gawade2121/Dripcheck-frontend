import { useAuth } from '../AuthContext';

const NAV_ITEMS = [
  { page: 'home', label: 'Discover', icon: 'home' },
  { page: 'wardrobe', label: 'My Wardrobe', icon: 'hanger' },
  { page: 'ai-drip', label: 'AI Drip', icon: 'sparkles' },
  { page: 'wishlist', label: 'Wishlist', icon: 'heart' },
  { page: 'profile', label: 'Profile', icon: 'user' },
];

const MOBILE_ITEMS = ['home', 'wardrobe', 'ai-drip', 'profile'];

function NavIcon({ name, className = 'w-5 h-5' }) {
  switch (name) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'hanger':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'plus':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" className={className}>
          <path d="M12 4v16m8-8H4" />
        </svg>
      );
    case 'back':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M15 19l-7-7 7-7" />
        </svg>
      );
    default:
      return null;
  }
}

export function BrandMark({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-[#0a0f1c] text-white flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4.5 h-4.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>
      <span className="font-black tracking-[0.18em] text-sm text-gray-900">DRIPCHECK</span>
    </div>
  );
}

export default function AppShell({ currentPage, onNavigate, children }) {
  const { mobileNo } = useAuth();
  const initials = mobileNo ? mobileNo.toString().slice(-2) : 'ME';

  return (
    <div className="w-full h-dvh flex overflow-hidden bg-[#f4f4f5] font-sans">
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-[268px] shrink-0 flex-col border-r border-gray-200/80 bg-white">
        <div className="h-[72px] flex items-center px-6 border-b border-gray-100">
          <BrandMark />
        </div>

        <nav className="flex-1 overflow-y-auto app-scroll p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#0a0f1c] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <NavIcon name={item.icon} className={`w-[18px] h-[18px] ${active ? 'text-white' : 'text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => onNavigate('add-product')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span className="w-[18px] h-[18px] rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <NavIcon name="plus" className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">Add Item</span>
          </button>
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => onNavigate('profile')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">My Account</p>
              <p className="text-xs text-gray-500 truncate">{mobileNo || 'Not signed in'}</p>
            </div>
          </button>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Compact header for small screens (sidebar is hidden there). */}
        <div className="lg:hidden h-14 shrink-0 bg-white border-b border-gray-100 flex items-center justify-between px-4">
          <BrandMark />
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('add-product')}
              className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center"
              aria-label="Add item"
            >
              <NavIcon name="plus" className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600"
              aria-label="Profile"
            >
              {initials}
            </button>
          </div>
        </div>

        <main className="flex-1 min-h-0 flex flex-col pb-16 lg:pb-0">
          {children}
        </main>

        {/* Tab bar fallback below the lg breakpoint. */}
        <nav className="lg:hidden shrink-0 h-16 bg-white border-t border-gray-200 flex items-stretch">
          {MOBILE_ITEMS.map((page) => {
            const item = NAV_ITEMS.find(n => n.page === page);
            const active = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-colors ${
                  active ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <NavIcon name={item.icon} className="w-6 h-6" />
                <span>{item.label === 'Discover' ? 'Home' : item.label === 'My Wardrobe' ? 'Wardrobe' : item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
