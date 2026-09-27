import { useState, useEffect } from 'react';
import { fetchTopwearSuggestions, fetchBottomwearSuggestions, fetchFootwearSuggestions, fetchWishlist, addWishlistItem, removeWishlistItem } from '../api';

const API_BASE = 'http://127.0.0.1:8000';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80';

const slotLabels = { topwear: 'Topwear', bottomwear: 'Bottomwear', footwear: 'Footwear' };

const SUGGESTION_FETCHERS = {
  topwear: fetchTopwearSuggestions,
  bottomwear: fetchBottomwearSuggestions,
  footwear: fetchFootwearSuggestions,
};

const imageOf = (item) => {
  if (!item?.image_url) return FALLBACK_IMAGE;
  if (item.image_url.startsWith('http')) return item.image_url;
  return `${API_BASE}${item.image_url}`;
};

export default function AiDrip({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('topwear');
  const [bundles, setBundles] = useState([]);
  const [recommendedItem, setRecommendedItem] = useState(null);
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [wishlisted, setWishlisted] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await SUGGESTION_FETCHERS[selectedCategory]();
        if (cancelled) return;
        setRecommendedItem(data.recommended_item || null);
        setBundles(data.bundles || []);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || 'Failed to load AI suggestions.');
        setBundles([]);
        setRecommendedItem(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedCategory]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await fetchWishlist();
        if (Array.isArray(data)) {
          const ids = {};
          data.filter(i => i.item_type === 'ai_bundle').forEach(i => {
            ids[i.ai_bundle_id] = true;
          });
          setWishlisted(ids);
        }
      } catch (e) {
        console.error('Failed to fetch wishlist:', e);
      }
    };
    loadWishlist();
  }, []);

  const toggleWishlist = async (bundle) => {
    const id = bundle.bundle_id;
    const wasWishlisted = !!wishlisted[id];
    setWishlisted(prev => ({ ...prev, [id]: !wasWishlisted }));

    try {
      const payload = {
        item_type: 'ai_bundle',
        bundle_id: id,
        bundle_data: bundle,
      };
      if (wasWishlisted) {
        await removeWishlistItem(payload);
      } else {
        await addWishlistItem(payload);
      }
    } catch (e) {
      console.error('Failed to update wishlist:', e);
      setWishlisted(prev => ({ ...prev, [id]: wasWishlisted }));
    }
  };

  const aiItemOf = (bundle, fallback = recommendedItem) =>
    (bundle.items || []).find(i => i.is_ai || i.item_id === bundle.ai_item_id) || fallback;

  const renderTiles = (bundle) => {
    const items = bundle.items || [];
    const aiItem = aiItemOf(bundle);
    return (
      <div className="flex gap-2">
        {items.map((item, idx) => {
          const isAi = item && item.item_id === aiItem?.item_id;
          return (
            <div key={item?.item_id || idx} className="flex-1 min-w-0">
              <div className={`relative w-full aspect-[3/4] ${isAi ? 'animate-iridescent animate-glow-pulse' : 'rounded-xl overflow-hidden'}`}>
                <div className={`w-full h-full overflow-hidden ${isAi ? 'rounded-[12px]' : 'rounded-xl'} bg-white`}>
                  <img
                    src={imageOf(item)}
                    alt={item?.name || 'Item'}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isAi && (
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    AI Pick
                  </div>
                )}
              </div>
              <p className="mt-1.5 text-[10px] font-semibold text-gray-800 truncate text-center">{item?.name || 'Item'}</p>
              <p className="text-[9px] text-gray-400 truncate text-center">{item?.brand || ' '}</p>
            </div>
          );
        })}
      </div>
    );
  };

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

      <div className="flex-1 overflow-y-auto app-scroll">

        <div className="px-5 sm:px-8 xl:px-12 py-8 xl:py-10 max-w-[1560px] mx-auto">

        {/* Header + category selector */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-indigo-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl lg:text-[2rem] font-bold text-gray-900 tracking-tight">AI Drip</h1>
              <p className="text-sm lg:text-[15px] text-gray-500 mt-1">Complete your outfits with AI-recommended pieces</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-[13px] font-semibold text-gray-500">What do you want to buy?</span>
            <div className="flex gap-2">
              {Object.keys(slotLabels).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-1 lg:flex-none text-[13px] font-bold px-5 py-2.5 rounded-full transition-all duration-200 ${selectedCategory === category
                    ? 'bg-[#0a0f1c] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {slotLabels[category]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="mt-8 bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center max-w-lg mx-auto">
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <button
              onClick={() => setSelectedCategory(c => c)}
              className="mt-4 text-xs font-bold text-white bg-[#0a0f1c] px-5 py-2.5 rounded-full"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && bundles.length === 0 && (
          <div className="mt-8 bg-gray-50 rounded-3xl p-12 text-center border border-gray-200/80 max-w-lg mx-auto">
            <p className="text-base font-semibold text-gray-700">No AI suggestions available</p>
            <p className="text-sm text-gray-500 mt-1.5">Add matching pieces to your wardrobe to get outfit bundles.</p>
          </div>
        )}

        {/* AI Top Pick hero */}
        {!loading && recommendedItem && (
          <div className="mt-8 max-w-3xl">
            <div className="bundle-card bg-white rounded-3xl p-6 border border-indigo-100/70 shadow-[0_4px_15px_rgba(0,0,0,0.05)] opacity-0 animate-fade-slide-up">
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-32 rounded-2xl shrink-0 animate-iridescent animate-glow-pulse">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-white">
                    <img src={imageOf(recommendedItem)} alt={recommendedItem.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">AI Top Pick</p>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 truncate">{recommendedItem.name}</h3>
                  <p className="text-sm text-gray-500 truncate mt-0.5">{recommendedItem.brand || 'AI Recommended'}</p>
                  <p className="text-xs text-gray-400 mt-2">Best match for your wardrobe</p>
                  {recommendedItem.product_url && (
                    <a
                      href={recommendedItem.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-xs font-bold text-white bg-[#0a0f1c] px-5 py-2.5 rounded-full hover:bg-gray-900 transition-colors"
                    >
                      View product
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bundle Variation Cards */}
        {!loading && !error && bundles.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {bundles.map((bundle, index) => {
              const rank = index + 1;
              const count = bundles.length;
              const isExpanded = expandedInsight === bundle.bundle_id;
              const aiItem = aiItemOf(bundle, recommendedItem);

              return (
                <div
                  key={bundle.bundle_id}
                  className={`bundle-card bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)] transition-shadow overflow-hidden opacity-0 animate-fade-slide-up flex flex-col`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        #{rank}
                      </span>
                      <h2 className="text-[15px] lg:text-base font-bold text-gray-900 tracking-tight truncate">
                        {recommendedItem?.name || aiItem?.name || 'AI Bundle'}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {bundle.match_score}% match
                      </span>
                      <button onClick={() => toggleWishlist(bundle)} className="text-gray-900 hover:text-gray-500 transition-colors" aria-label="Toggle wishlist">
                        <svg
                          viewBox="0 0 24 24"
                          fill={wishlisted[bundle.bundle_id] ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-5 h-5"
                          style={{ color: wishlisted[bundle.bundle_id] ? '#ef4444' : '#111111' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Variation label */}
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-3">
                    Variation {rank} of {count}
                  </p>

                  {/* Product Tiles Row */}
                  {renderTiles(bundle)}

                  {/* Unlocks strip */}
                  <div className="mt-4 flex items-center justify-center gap-1.5 bg-indigo-50/70 border border-indigo-100/60 rounded-xl py-2.5 px-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5 text-indigo-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    <span className="text-[11px] font-semibold text-indigo-700">
                      Unlocks <span className="text-[14px] font-extrabold">{count}</span> {count === 1 ? 'bundle' : 'bundles'}
                    </span>
                    <span className="text-[11px] text-indigo-400 font-medium">with your wardrobe</span>
                  </div>

                  {/* Bundle Footer */}
                  <div className="mt-auto pt-4 flex items-center gap-3">
                    <button
                      onClick={() => { if (aiItem?.product_url) window.open(aiItem.product_url, '_blank', 'noopener,noreferrer'); }}
                      className="flex-[3] bg-[#0a0f1c] text-white text-[13px] font-bold py-3 rounded-full hover:bg-gray-900 transition-colors"
                    >
                      Buy suggested product
                    </button>
                    <button
                      onClick={() => setExpandedInsight(isExpanded ? null : bundle.bundle_id)}
                      className="flex-1 text-[11px] text-gray-400 font-medium leading-[1.2] transition-colors hover:text-gray-700"
                    >
                      Why this<br />product?
                    </button>
                  </div>

                  {/* Expanded Insight */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-slide-up">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5 text-indigo-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846" />
                          </svg>
                        </div>
                        <p className="text-[12px] text-gray-600 leading-relaxed">
                          {bundle.explanation || 'AI matched this piece to complete your outfit based on color harmony, style compatibility, and season relevance.'}
                        </p>
                      </div>
                      {aiItem?.style_tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {aiItem.style_tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/50">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
