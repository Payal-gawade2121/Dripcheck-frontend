import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import BundleScoreDebug from '../components/BundleScoreDebug';

const API_BASE = 'http://127.0.0.1:8000';

const OCCASION_FILTERS = [
  'All',
  'Formal',
  'Smart Casual',
  'Casual',
  'Party',
  'Wedding',
  'Streetwear',
  'Sports',
  'Travel',
  'Date',
];

export default function Home({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bundles, setBundles] = useState([]);
  const [defaultBundles, setDefaultBundles] = useState([]);
  const [occasionBundles, setOccasionBundles] = useState(null);
  const [occasionLoading, setOccasionLoading] = useState(false);
  const [bundleError, setBundleError] = useState('');
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemBundlesLoading, setItemBundlesLoading] = useState(false);
  const [wishlistedBundles, setWishlistedBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userUid } = useAuth();

  const mapBundle = (bundle, wardrobeMap) => {
    const items = (bundle.items || [])
      .map(item => typeof item === 'object' ? item : wardrobeMap[item])
      .filter(Boolean);
    const top = items.find(i => i.category === 'Top');
    const bottom = items.find(i => i.category === 'Bottom');
    const footwear = items.find(i => i.category === 'Footwear');

    return {
      id: bundle.bundle_id,
      title: (top ? top.name : 'Curated') + ' & More',
      price: 'Personal Wardrobe',
      description: bundle.style_tags ? bundle.style_tags.join(' • ') : 'A curated outfit based on items from your wardrobe.',
      top,
      bottom,
      footwear,
      tags: bundle.occasion_tags && bundle.occasion_tags.length > 0 ? bundle.occasion_tags.map(t => `#${t.replace(/\s+/g, '')}`) : ['#MyWardrobe'],
      match: bundle.compatibility_score ? Math.round(bundle.compatibility_score) : (90 + Math.floor(Math.random() * 10)),
      raw: bundle,
    };
  };

  const resolveImage = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const itemMatches = (item, q) => {
    const haystack = [
      item.name,
      item.category,
      item.subcategory,
      item.primary_color,
      item.color_family,
      item.color,
      item.brand,
      ...(Array.isArray(item.style_tags) ? item.style_tags : []),
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(q);
  };

  useEffect(() => {
    const loadWishlist = async () => {
      if (!userUid) return;
      try {
        const { fetchWishlist } = await import('../api');
        const data = await fetchWishlist();
        if (Array.isArray(data)) {
          setWishlistedBundles(
            data.filter(i => i.item_type === 'bundle')
                .map(i => i.bundle?.bundle_id)
                .filter(Boolean)
          );
        }
      } catch (e) {
        console.error('Failed to fetch wishlist:', e);
      }
    };
    loadWishlist();
  }, [userUid]);

  const toggleWishlist = async (bundle) => {
    const id = bundle.id;
    const wasWishlisted = wishlistedBundles.includes(id);
    setWishlistedBundles(prev =>
      wasWishlisted ? prev.filter(w => w !== id) : [...prev, id]
    );

    try {
      const { addWishlistItem, removeWishlistItem } = await import('../api');
      // Send the raw bundle so the backend can persist generated (homepage)
      // bundles that don't exist in the database yet.
      const payload = { item_type: 'bundle', bundle_id: id, bundle_data: bundle.raw };
      if (wasWishlisted) {
        await removeWishlistItem(payload);
      } else {
        await addWishlistItem(payload);
      }
    } catch (e) {
      console.error('Failed to update wishlist:', e);
      setWishlistedBundles(prev =>
        wasWishlisted ? [...prev, id] : prev.filter(w => w !== id)
      );
    }
  };

  useEffect(() => {
    const loadBundles = async () => {
      try {
        setLoading(true);
        setSelectedCategory('All');
        setOccasionBundles(null);
        setBundleError('');
        if (!userUid) return;
        const { fetchWardrobe, fetchBundles } = await import('../api');
        const [wardrobeData, bundleData] = await Promise.all([
          fetchWardrobe(),
          fetchBundles()
        ]);

        if (bundleData && bundleData.length > 0 && wardrobeData) {
          const wardrobeMap = {};
          wardrobeData.forEach(item => {
            wardrobeMap[item.item_id] = item;
          });

          const newBundles = bundleData.map(bundle => mapBundle(bundle, wardrobeMap));
          setWardrobeItems(wardrobeData);
          setDefaultBundles(newBundles);
          setBundles(newBundles);
        } else {
          setWardrobeItems(Array.isArray(wardrobeData) ? wardrobeData : []);
          setDefaultBundles([]);
          setBundles([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadBundles();
  }, [userUid]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchResults = wardrobeItems.filter(item =>
    itemMatches(item, debouncedQuery.toLowerCase())
  );
  const showSearchResults = debouncedQuery.length >= 2 && !selectedItem;

  const handleSelectItem = async (item) => {
    setSelectedItem(item);
    setSearchQuery('');
    setDebouncedQuery('');
    setItemBundlesLoading(true);
    try {
      const { fetchBundlesFromItem } = await import('../api');
      const data = await fetchBundlesFromItem(item.item_id);
      const wardrobeMap = {};
      wardrobeItems.forEach(w => { wardrobeMap[w.item_id] = w; });
      const newBundles = (Array.isArray(data) ? data : []).map(bundle => mapBundle(bundle, wardrobeMap));
      setBundles(newBundles);
    } catch (e) {
      console.error('Failed to load bundles for selected item:', e);
      setBundles(defaultBundles);
    } finally {
      setItemBundlesLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedItem(null);
    setBundles(selectedCategory === 'All' || !occasionBundles ? defaultBundles : occasionBundles);
  };

  const loadOccasionBundles = async (occasion) => {
    setOccasionLoading(true);
    setBundleError('');
    try {
      const { fetchBundles } = await import('../api');
      const data = await fetchBundles(occasion);
      const wardrobeMap = {};
      wardrobeItems.forEach(w => { wardrobeMap[w.item_id] = w; });
      const newBundles = (Array.isArray(data) ? data : []).map(bundle => mapBundle(bundle, wardrobeMap));
      setOccasionBundles(newBundles);
      setBundles(newBundles);
    } catch (e) {
      console.error('Failed to load occasion bundles:', e);
      setBundleError(occasion);
    } finally {
      setOccasionLoading(false);
    }
  };

  const handleCategorySelect = (cat) => {
    if (cat === selectedCategory) return;
    setSelectedCategory(cat);
    setSelectedItem(null);
    setBundleError('');
    if (cat === 'All') {
      setOccasionBundles(null);
      setBundles(defaultBundles);
    } else {
      loadOccasionBundles(cat);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white relative overflow-hidden">

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto app-scroll">

        <div className="px-5 sm:px-8 xl:px-12 py-8 xl:py-10 max-w-[1560px] mx-auto">

          {/* Header */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-[2rem] font-bold text-gray-900 leading-tight tracking-tight">
                Discover Your Perfect Drip
              </h1>
              <p className="text-sm lg:text-[15px] text-gray-500 mt-1.5">
                Curated outfits built from the pieces you already own.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('add-product')}
                className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add to wardrobe
              </button>
            </div>
          </div>

          {/* Search Bar + Occasion Filters */}
          <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6">
            <div className="relative lg:w-[360px] lg:shrink-0">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search styles, themes, or items..."
                className="w-full bg-white border border-gray-200 text-sm rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors shadow-sm"
              />
              {showSearchResults && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden z-20">
                  {searchResults.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                      No wardrobe items match "{debouncedQuery}"
                    </p>
                  ) : (
                    searchResults.map(item => (
                      <button
                        key={item.item_id}
                        onClick={() => handleSelectItem(item)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                          {resolveImage(item.image_url) ? (
                            <img src={resolveImage(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400">{item.category || 'Item'}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {[item.category, item.subcategory, item.primary_color, item.brand].filter(Boolean).join(' • ')}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="lg:flex-1 lg:min-w-0">
              <div className="flex gap-2 flex-wrap lg:flex-nowrap lg:overflow-x-auto scrollbar-hide">
                {OCCASION_FILTERS.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 lg:px-5 py-2.5 rounded-full text-sm font-semibold transition-all border whitespace-nowrap shrink-0 ${selectedCategory === cat
                      ? 'bg-[#0a0f1c] text-white border-[#0a0f1c]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mt-8" />

          {/* Personalized for You (Bundle UI) */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                  {selectedItem ? `Best Bundles from ${selectedItem.name}` : 'Best Bundles from Wardrobe'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {bundles.length} {bundles.length === 1 ? 'outfit' : 'outfits'} matched to your wardrobe
                </p>
              </div>
              {selectedItem && (
                <button
                  onClick={handleClearSelection}
                  className="shrink-0 text-xs font-semibold text-gray-500 bg-white border border-gray-200 hover:border-gray-300 hover:text-gray-800 rounded-full px-4 py-2 transition-colors shadow-sm"
                >
                  Clear
                </button>
              )}
            </div>

            {bundleError && (
              <div className="mb-5 flex items-center justify-between gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 max-w-2xl">
                <p className="text-xs font-semibold text-red-600">
                  Couldn't load {bundleError} bundles right now.
                </p>
                <button
                  onClick={() => loadOccasionBundles(bundleError)}
                  className="text-xs font-bold text-red-700 bg-white border border-red-200 rounded-full px-3 py-1.5 transition-colors shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {loading || itemBundlesLoading || occasionLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : bundles.length === 0 ? (
              selectedItem ? (
                <p className="text-sm text-gray-500">
                  No bundles could be created from this item yet. Try another wardrobe item.
                </p>
              ) : selectedCategory !== 'All' ? (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-500">
                    No {selectedCategory} bundles yet. Try another occasion or style.
                  </p>
                  <button
                    onClick={() => handleCategorySelect('All')}
                    className="mt-4 text-xs font-semibold text-white bg-[#0a0f1c] border border-[#0a0f1c] rounded-full px-5 py-2.5 transition-colors hover:bg-gray-900"
                  >
                    Show All
                  </button>
                </div>
              ) : (
                <div className="text-center py-10 max-w-md mx-auto">
                  <p className="text-sm text-gray-500">
                    Not enough items in your wardrobe to create a bundle. Add a Top, Bottom, and Footwear!
                  </p>
                  <button
                    onClick={() => onNavigate('add-product')}
                    className="mt-5 text-xs font-semibold text-white bg-[#0a0f1c] rounded-full px-5 py-2.5 hover:bg-gray-900 transition-colors"
                  >
                    Add your first item
                  </button>
                </div>
              )
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {bundles.map((bundle, index) => (
                  <div key={index} className="group bg-white rounded-3xl p-2 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_44px_rgb(0,0,0,0.1)] transition-shadow duration-300 flex flex-col">

                    {/* Image Split Section */}
                    <div className="w-full h-[210px] 2xl:h-[240px] rounded-[20px] overflow-hidden flex bg-gray-300">
                      {/* Left: Top */}
                      <a
                        href={bundle.top?.product_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-b from-gray-200 to-gray-500 relative flex flex-col justify-between p-3 border-r border-white/20 bg-cover bg-center block hover:opacity-95 transition-opacity"
                        style={resolveImage(bundle.top?.image_url) ? { backgroundImage: `url(${resolveImage(bundle.top.image_url)})` } : {}}
                      >
                        <div className="flex-1 flex items-center justify-center">
                          {!bundle.top?.image_url && <span className="font-bold text-black text-sm">Top</span>}
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 text-[10px] font-bold text-black w-max self-start shadow-sm">
                          Top
                        </div>
                      </a>
                      {/* Center: Bottom */}
                      <a
                        href={bundle.bottom?.product_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-b from-gray-200 to-gray-500 relative flex flex-col justify-between p-3 border-r border-white/20 bg-cover bg-center block hover:opacity-95 transition-opacity"
                        style={resolveImage(bundle.bottom?.image_url) ? { backgroundImage: `url(${resolveImage(bundle.bottom.image_url)})` } : {}}
                      >
                        <div className="flex-1 flex items-center justify-center">
                          {!bundle.bottom?.image_url && <span className="font-bold text-black text-sm">Bottom</span>}
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 text-[10px] font-bold text-black w-max self-start shadow-sm">
                          Bottom
                        </div>
                      </a>
                      {/* Right: Footwear */}
                      <a
                        href={bundle.footwear?.product_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-b from-gray-200 to-gray-500 relative flex flex-col justify-between p-3 bg-cover bg-center block hover:opacity-95 transition-opacity"
                        style={resolveImage(bundle.footwear?.image_url) ? { backgroundImage: `url(${resolveImage(bundle.footwear.image_url)})` } : {}}
                      >
                        <div className="flex-1 flex items-center justify-center">
                          {!bundle.footwear?.image_url && <span className="font-bold text-black text-sm">Footwear</span>}
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 text-[10px] font-bold text-black w-max self-start shadow-sm">
                          Footwear
                        </div>
                      </a>
                    </div>

                    {/* Bundle Details */}
                    <div className="p-4 pt-5 pb-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-3 mb-1.5">
                        <h3 className="font-bold text-gray-900 text-base lg:text-[17px] leading-snug">{bundle.title}</h3>
                        <span className="font-bold text-[#f59e0b] text-sm lg:text-[15px] whitespace-nowrap">Personal</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {bundle.description}
                      </p>

                      {/* Tags and Match */}
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {bundle.tags.slice(0, 2).map(tag => (
                          <div key={tag} className="bg-indigo-50/50 text-indigo-900 text-xs font-semibold px-2.5 py-1 rounded-md">
                            {tag}
                          </div>
                        ))}
                        <div className="ml-auto flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: `${bundle.match}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-gray-900">{bundle.match}%</span>
                        </div>
                      </div>

                      <hr className="border-gray-50 mb-4" />

                      {/* Scoring debug panel (DEV builds only, uses real backend values) */}
                      <BundleScoreDebug raw={bundle.raw} />

                      {/* Actions */}
                      <div className="flex gap-2.5 mt-auto">
                        <button
                          onClick={() => toggleWishlist(bundle)}
                          aria-label="Toggle wishlist"
                          className={`px-5 py-2.5 bg-white border border-gray-100 hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-500 transition-colors shadow-sm ${wishlistedBundles.includes(bundle.id) ? 'text-rose-500 border-rose-200' : ''}`}
                        >
                          <svg viewBox="0 0 24 24" fill={wishlistedBundles.includes(bundle.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button className="flex-1 bg-[#0a0f1c] hover:bg-gray-900 text-white font-semibold py-2.5 rounded-xl transition-colors text-[13px] shadow-sm">
                          Wear This
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-10" />
        </div>
      </div>
    </div>
  );
}
