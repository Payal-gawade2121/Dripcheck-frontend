import { useState, useEffect } from 'react';
import { fetchWishlist, removeWishlistItem } from '../api';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80';
const API_BASE = 'http://127.0.0.1:8000';

const resolveImage = (url) => {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
};

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'product', label: 'Products' },
  { key: 'bundle', label: 'Bundles' },
];

const isProductType = (item_type) => ['product', 'wardrobe_item'].includes(item_type);
const isBundleType = (item_type) => ['bundle', 'marketplace_bundle', 'ai_bundle'].includes(item_type);

const mapIdOf = (item) => {
  if (item.item_type === 'product') return item.product?.product_id;
  if (item.item_type === 'wardrobe_item') return item.wardrobe_item?.item_id;
  if (item.item_type === 'ai_bundle') return item.ai_bundle_id;
  return item.bundle?.bundle_id || item.marketplace_bundle?.bundle_id;
};

const removePayloadOf = (item) => {
  if (item.item_type === 'product') return { item_type: 'product', product_id: mapIdOf(item) };
  if (item.item_type === 'wardrobe_item') return { item_type: 'wardrobe_item', wardrobe_item_id: mapIdOf(item) };
  if (item.item_type === 'ai_bundle') return { item_type: 'ai_bundle', bundle_id: mapIdOf(item) };
  return { item_type: item.item_type, bundle_id: mapIdOf(item) };
};

export default function Wishlist({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchWishlist();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to fetch wishlist:', e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRemove = async (item) => {
    const targetId = mapIdOf(item);
    if (!targetId) return;
    setRemovingId(targetId);
    try {
      await removeWishlistItem(removePayloadOf(item));
      if (item.item_type === 'ai_bundle') {
        setItems(prev => prev.filter(i => i.ai_bundle_id !== targetId));
      } else {
        setItems(prev => prev.filter(i => mapIdOf(i) !== targetId));
      }
    } catch (e) {
      console.error('Failed to remove from wishlist:', e);
      alert(e.message || 'Failed to remove item.');
    } finally {
      setRemovingId(null);
    }
  };

  const filtered = items.filter(item =>
    activeTab === 'all'
      ? true
      : activeTab === 'product'
        ? isProductType(item.item_type)
        : isBundleType(item.item_type)
  );

  const renderCard = (entry) => {
    if (isProductType(entry.item_type)) {
      const p = entry.product || entry.wardrobe_item || {};
      return (
        <>
          <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden">
            <img
              src={resolveImage(p.image_url)}
              alt={p.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
              Product
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); handleRemove(entry); }}
              disabled={removingId === mapIdOf(entry)}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90 disabled:opacity-60"
              title="Remove from wishlist"
            >
              {removingId === mapIdOf(entry) ? (
                <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 text-[13px] truncate mb-1">{p.name}</h3>
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-black text-sm truncate">
                {p.price != null ? `$${Number(p.price).toFixed(2)}` : p.brand || ''}
              </p>
              {p.brand && p.price != null && (
                <p className="text-[10px] text-gray-400 font-medium">{p.brand}</p>
              )}
            </div>
          </div>
        </>
      );
    }

    // Bundle card (outfit bundle, marketplace bundle or AI bundle)
    const mb = entry.marketplace_bundle;
    const ob = entry.bundle;
    const ai = entry.item_type === 'ai_bundle' ? entry.bundle_data || {} : null;

    // Gather every item across the bundle so we can render the full outfit.
    const obItems = ob?.items_data || [];
    const mbItems = mb?.items || [];
    const aiItems = ai?.items || [];
    const allItems = [...obItems, ...mbItems, ...aiItems];
    const top = allItems.find(i => i.category === 'Top');
    const bottom = allItems.find(i => i.category === 'Bottom');
    const footwear = allItems.find(i => i.category === 'Footwear');

    const title = ai
      ? 'AI Bundle'
      : mb?.title || (ob?.occasion_tags?.[0] ? `${ob.occasion_tags[0]} Look` : 'Outfit Bundle');
    const subtitle = ai
      ? `${ai.match_score != null ? `${Math.round(ai.match_score)}% match` : 'AI curated'} · ${aiItems.length} items`
      : mb
        ? mb.description || 'Marketplace bundle'
        : ob
          ? `${allItems.length} items · ${Math.round(ob.compatibility_score || 0)}% match`
          : 'Bundle';
    const price = ai ? null : mb?.total_price;
    const tags = ai
      ? []
      : (entry.item_type === 'marketplace_bundle' ? mb?.style_tags : ob?.style_tags) || [];

    const renderBundlePanel = (label, item) => (
      <div
        key={label}
        className="flex-1 bg-gradient-to-b from-gray-200 to-gray-500 relative flex flex-col justify-between p-2 border-r last:border-r-0 border-white/20 bg-cover bg-center"
        style={item?.image_url ? { backgroundImage: `url(${resolveImage(item.image_url)})` } : {}}
      >
        <div className="flex-1 flex items-center justify-center">
          {!item?.image_url && <span className="font-bold text-black text-[11px]">{label}</span>}
        </div>
        <span className="bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[9px] font-bold text-black w-max self-start shadow-sm">
          {label}
        </span>
      </div>
    );

    return (
      <>
        <div className="relative w-full h-[180px] bg-gray-50 overflow-hidden">
          <div className="w-full h-full flex bg-gray-300">
            {renderBundlePanel('Top', top)}
            {renderBundlePanel('Bottom', bottom)}
            {renderBundlePanel('Footwear', footwear)}
          </div>
          <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
            Bundle
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); handleRemove(entry); }}
            disabled={removingId === mapIdOf(entry)}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90 disabled:opacity-60"
            title="Remove from wishlist"
          >
            {removingId === mapIdOf(entry) ? (
              <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 text-[13px] truncate mb-1">{title}</h3>
          <p className="text-[12px] text-gray-500 truncate mb-2">{subtitle}</p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-black text-sm">
              {price != null ? `$${Number(price).toFixed(2)}` : ''}
            </p>
            <div className="flex gap-1 overflow-hidden">
              {tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-[9px] font-bold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 whitespace-nowrap">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f9fafb] relative overflow-hidden">
      <div className="flex-1 overflow-y-auto app-scroll">

        <div className="px-5 sm:px-8 xl:px-12 py-8 xl:py-10 max-w-[1560px] mx-auto">

          {/* Header + Tabs */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-[2rem] font-bold text-gray-900 leading-tight tracking-tight">Wishlist</h1>
              <p className="text-sm lg:text-[15px] text-gray-500 mt-1.5">
                {items.length} saved {items.length === 1 ? 'item' : 'items'} — products and outfits you saved for later.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-1.5 flex gap-1 border border-gray-200/80 lg:w-[360px]">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                    activeTab === tab.key ? 'bg-[#0a0f1c] text-white shadow-md' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mt-7">
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="min-h-[320px] flex flex-col items-center justify-center text-center px-6 bg-white rounded-3xl border border-gray-200/80">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Nothing here yet</h3>
                <p className="text-sm text-gray-500 mt-1.5 max-w-[320px]">
                  {activeTab === 'all'
                    ? 'Products and bundles you wishlist will show up here.'
                    : `You haven't added any ${activeTab === 'product' ? 'products' : 'bundles'} to your wishlist yet.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-5">
                {filtered.map(entry => (
                  <div
                    key={entry.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                  >
                    {renderCard(entry)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}