import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function Home({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bundles, setBundles] = useState([]);
  const [wishlistedBundles, setWishlistedBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userUid } = useAuth();

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

          const newBundles = bundleData.map(bundle => {
            const items = (bundle.items || []).map(id => wardrobeMap[id]).filter(Boolean);
            const top = items.find(i => i.category === 'Top');
            const bottom = items.find(i => i.category === 'Bottom');
            const footwear = items.find(i => i.category === 'Footwear');

            return {
              id: bundle.bundle_id,
              // title: (top ? top.name : 'Curated') + ' & More',
              // price: 'Personal Wardrobe',
              description: bundle.style_tags ? bundle.style_tags.join(' • ') : 'A curated outfit based on items from your wardrobe.',
              top,
              bottom,
              footwear,
              tags: bundle.occasion_tags && bundle.occasion_tags.length > 0 ? bundle.occasion_tags.map(t => `#${t.replace(/\s+/g, '')}`) : ['#MyWardrobe'],
              match: bundle.compatibility_score ? Math.round(bundle.compatibility_score) : (90 + Math.floor(Math.random() * 10)),
              raw: bundle,
            };
          });
          setBundles(newBundles);
        } else {
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

  return (
    <div className="w-full h-full flex flex-col bg-white relative overflow-hidden">

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">

        {/* Header */}
        <div className="px-6 pt-12 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Discover Your Perfect Drip
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Curated outfits from our community.
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-6 mb-5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search styles, themes, or items..."
              className="w-full bg-white border border-gray-200 text-sm rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-gray-300 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Quick Search Categories */}
        <div className="pl-6 mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max pr-6">
            {['All', 'Minimalist', 'Streetwear', 'Sporty/Athleisure'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${selectedCategory === cat
                  ? 'bg-[#0a0f1c] text-white border-[#0a0f1c]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Personalized for You (Bundle UI) */}
        <div className="px-6 mt-8 mb-8">
          <h2 className="text-[19px] font-bold text-gray-900 mb-5">Best Bundles from Wardrobe</h2>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bundles.length === 0 ? (
            <p className="text-sm text-gray-500">Not enough items in your wardrobe to create a bundle. Add a Top, Bottom, and Footwear!</p>
          ) : (
            <div className="flex flex-col gap-6">
              {bundles.map((bundle, index) => (
                <div key={index} className="bg-white rounded-3xl p-2 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">

                  {/* Image Split Section */}
                  <div className="w-full h-[220px] rounded-[20px] overflow-hidden flex bg-gray-300">
                    {/* Left: Top */}
                    <a
                      href={bundle.top?.product_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-b from-gray-200 to-gray-500 relative flex flex-col justify-between p-3 border-r border-white/20 bg-cover bg-center block hover:opacity-95 transition-opacity"
                      style={bundle.top?.image_url ? { backgroundImage: `url(http://localhost:8000${bundle.top.image_url})` } : {}}
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
                      style={bundle.bottom?.image_url ? { backgroundImage: `url(http://localhost:8000${bundle.bottom.image_url})` } : {}}
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
                      style={bundle.footwear?.image_url ? { backgroundImage: `url(http://localhost:8000${bundle.footwear.image_url})` } : {}}
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
                  <div className="p-4 pt-5 pb-3">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="font-bold text-gray-900 text-lg">{bundle.title}</h3>
                      <span className="font-bold text-[#f59e0b] text-[17px]">{bundle.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-5">
                      {bundle.description}
                    </p>

                    {/* Tags and Match */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="bg-indigo-50/50 text-indigo-900 text-xs font-semibold px-2.5 py-1 rounded-md">
                        {bundle.tags[0]}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: `${bundle.match}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-900">{bundle.match}%</span>
                      </div>
                    </div>

                    <hr className="border-gray-50 mb-5" />

                    {/* Actions */}
                    <div className="flex gap-2.5">
                      {/* <button className="flex-1 bg-black hover:bg-gray-900 text-white font-semibold py-3.5 rounded-xl transition-colors text-[14px] shadow-sm">
                        Wear This
                      </button>*/}
                      <button
                        onClick={() => toggleWishlist(bundle)}
                        className={`px-6 py-2 bg-white border border-gray-100 hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-500 transition-colors shadow-sm ${wishlistedBundles.includes(bundle.id) ? 'text-rose-500 border-rose-200' : ''}`}
                      >
                        <svg viewBox="0 0 24 24" fill={wishlistedBundles.includes(bundle.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-5 py-3 pb-5 flex justify-between items-center rounded-t-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.03)] z-10">
        <button className="flex flex-col items-center gap-1 text-black">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button onClick={() => onNavigate('wardrobe')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"></path>
          </svg>
          <span className="text-[10px] font-bold">Wardrobe</span>
        </button>

        <button onClick={() => onNavigate('ai-drip')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          <span className="text-[10px] font-bold">AI Drip</span>
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
