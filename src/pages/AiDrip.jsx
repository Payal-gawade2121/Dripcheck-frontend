import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';

const API_BASE_URL = 'https://6hkpxld2-8000.inc1.devtunnels.ms/';

const resolveImage = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE_URL}${url.replace(/^\//, '')}`;
};

const slotLabels = { topwear: 'Topwear', bottomwear: 'Bottomwear', footwear: 'Footwear' };
const slotOrder = ['TOP', 'BOTTOM', 'FOOTWEAR'];
const slotNames = { TOP: 'Topwear', BOTTOM: 'Bottomwear', FOOTWEAR: 'Footwear' };

export default function AiDrip({ onNavigate }) {
  const { userUid } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('topwear');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedInsight, setExpandedInsight] = useState(null);

  const loadSuggestions = useCallback(async (category) => {
    if (!userUid) {
      setError('Please log in to see AI suggestions.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    setExpandedInsight(null);
    try {
      const { fetchAiSuggestion } = await import('../api');
      const result = await fetchAiSuggestion(category, userUid);
      setData(result);
    } catch (e) {
      setError(e?.detail || 'Failed to load AI suggestions. Try again.');
    } finally {
      setLoading(false);
    }
  }, [userUid]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!userUid) return;
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const { fetchAiSuggestion } = await import('../api');
        const result = await fetchAiSuggestion('topwear', userUid);
        if (active) setData(result);
      } catch (e) {
        if (active) setError(e?.detail || 'Failed to load AI suggestions. Try again.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userUid]);

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setData(null);
      setError(null);
      return;
    }
    setSelectedCategory(category);
    loadSuggestions(category);
  };

  const recommended = data?.recommended_item;
  const bundles = data?.bundles || [];

  return (
    <div className="w-full h-full flex flex-col bg-white relative overflow-hidden">
      <style>{`
        @keyframes iridescentFlow {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 0%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 18px rgba(168,85,247,0.2), 0 0 40px rgba(99,102,241,0.1); }
          50% { box-shadow: 0 0 24px rgba(168,85,247,0.35), 0 0 60px rgba(6,182,212,0.15); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-iridescent {
          background: linear-gradient(135deg, #a855f7, #ec4899, #06b6d4, #6366f1, #f59e0b, #a855f7);
          background-size: 400% 400%;
          animation: iridescentFlow 4s ease infinite;
          padding: 2px;
          border-radius: 14px;
        }
        .animate-glow-pulse {
          animation: glowPulse 3s ease-in-out infinite;
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.55s ease forwards;
        }
        .bundle-card:nth-child(1) { animation-delay: 0.05s; }
        .bundle-card:nth-child(2) { animation-delay: 0.1s; }
        .bundle-card:nth-child(3) { animation-delay: 0.15s; }
        .bundle-card:nth-child(4) { animation-delay: 0.2s; }
        .bundle-card:nth-child(5) { animation-delay: 0.25s; }
        .bundle-card:nth-child(6) { animation-delay: 0.3s; }
        .bundle-card:nth-child(7) { animation-delay: 0.35s; }
      `}</style>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">

        {/* Header */}
        <div className="px-6 pt-10 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-indigo-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">AI Drip</h1>
              <p className="text-[13px] text-gray-500 mt-0.5">Complete your outfits with AI-recommended pieces</p>
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <div className="px-5 mt-4">
          <p className="text-[13px] font-semibold text-gray-700 mb-2">What do you want to buy?</p>
          <div className="flex gap-2">
            {Object.keys(slotLabels).map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                disabled={loading}
                className={`flex-1 text-[13px] font-bold py-2.5 rounded-full transition-all duration-200 active:scale-[0.98] ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {slotLabels[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-[3px] border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[13px] text-gray-500 font-medium">Finding your perfect match...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="px-5 mt-8 flex flex-col items-center gap-3">
            <p className="text-[13px] text-gray-600 text-center">{error}</p>
            <button
              onClick={() => selectedCategory && loadSuggestions(selectedCategory)}
              className="bg-black text-white text-[13px] font-bold px-6 py-2.5 rounded-full transition-all duration-200 active:scale-[0.98]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !data && (
          <div className="px-5 mt-10 text-center">
            <p className="text-[13px] text-gray-500">Select a category above to get AI suggestions.</p>
          </div>
        )}

        {/* AI Top Pick */}
        {!loading && !error && recommended && (
          <div className="px-5 mt-4">
            <div className="animate-iridescent animate-glow-pulse rounded-2xl">
              <div className="bg-white rounded-[14px] p-4 flex gap-3.5 items-center">
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={resolveImage(recommended.image_url)}
                    alt={recommended.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">AI Top Pick</p>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-snug mt-0.5 truncate">{recommended.name}</h3>
                  <p className="text-[12px] text-gray-500 mt-0.5 truncate">
                    {recommended.brand || slotNames[recommended.category] || selectedCategory}
                  </p>
                  {recommended.style_tags?.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {recommended.style_tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bundle Cards */}
        {!loading && !error && bundles.length > 0 && (
          <div className="px-5 mt-4 space-y-6">
            {bundles.map((bundle) => {
              const isExpanded = expandedInsight === bundle.bundle_id;
              const aiItem = bundle.items.find((i) => i.is_ai);
              const matchPct = Math.round((bundle.match_score || 0) * 100);

              return (
                <div
                  key={bundle.bundle_id}
                  className={`bundle-card bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-hidden opacity-0 animate-fade-slide-up`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">{matchPct}% Match</h2>
                    <button className="text-black hover:text-gray-600 transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Tiles Row */}
                  <div className="flex gap-2">
                    {slotOrder.map((slot) => {
                      const item = bundle.items.find((i) => (i.category || '').toUpperCase() === slot);
                      if (!item) {
                        return (
                          <div key={slot} className="flex-1">
                            <div className="w-full aspect-[3/4] rounded-xl bg-gray-100 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-gray-400">{slotNames[slot]}</span>
                            </div>
                          </div>
                        );
                      }
                      const isAi = item.is_ai;
                      const tile = (
                        <div className={`relative w-full aspect-[3/4] ${isAi ? 'animate-iridescent animate-glow-pulse' : 'rounded-xl overflow-hidden'}`}>
                          <div className={`w-full h-full overflow-hidden ${isAi ? 'rounded-[12px]' : 'rounded-xl'} bg-white`}>
                            {item.image_url ? (
                              <img
                                src={resolveImage(item.image_url)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-gray-400">{slotNames[slot]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                      return (
                        <div key={slot} className="flex-1">
                          {item.product_url ? (
                            <a href={item.product_url} target="_blank" rel="noopener noreferrer">{tile}</a>
                          ) : (
                            tile
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Bundle Footer */}
                  <div className="flex items-center gap-3 mt-4">
                    {aiItem?.product_url ? (
                      <a
                        href={aiItem.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-[3] bg-black text-white text-[14px] font-bold py-2.5 rounded-full transition-all duration-200 active:scale-[0.98] text-center"
                      >
                        Buy suggested product
                      </a>
                    ) : (
                      <button className="flex-[3] bg-black text-white text-[14px] font-bold py-2.5 rounded-full transition-all duration-200 active:scale-[0.98]">
                        Buy suggested product
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedInsight(isExpanded ? null : bundle.bundle_id)}
                      className="flex-1 text-[11px] text-gray-400 font-medium leading-[1.1] text-center transition-colors hover:text-gray-600"
                    >
                      Why this<br />product?
                    </button>
                  </div>

                  {/* Expanded Insight */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-50 animate-fade-slide-up">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5 text-indigo-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-600 leading-relaxed">
                            {bundle.explanation || 'AI matched this product to complete your outfit based on color harmony, style compatibility, and season relevance.'}
                          </p>
                          {aiItem?.style_tags?.length > 0 && (
                            <div className="flex gap-1.5 mt-2.5">
                              {aiItem.style_tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-[9px] font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/50">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Spacer */}
        <div className="h-6" />

      </div>

      {/* Bottom Navbar */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-5 py-3 pb-5 flex justify-between items-center rounded-t-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.03)] z-10">
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
             <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
             <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button onClick={() => onNavigate('wardrobe')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
             <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"></path>
          </svg>
          <span className="text-[10px] font-bold">Wardrobe</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-black">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6 text-indigo-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          <span className="text-[10px] font-bold text-indigo-500">AI Drip</span>
        </button>

        <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>

    </div>
  );
}
