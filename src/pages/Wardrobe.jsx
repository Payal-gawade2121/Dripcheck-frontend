import React, { useState, useEffect } from 'react';
import { deleteWardrobeItem, fetchWardrobe as fetchWardrobeApi } from '../api';
import { useAuth } from '../AuthContext';

const categories = ['Top Wear', 'Bottom Wear', 'Foot Wear'];

const categoryIcons = {
  'Top Wear': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
    </svg>
  ),
  'Bottom Wear': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M6 2h12l2 7H4L6 2zM4 9l2 13h4l2-6 2 6h4l2-13" />
    </svg>
  ),
  'Foot Wear': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 13l2-8h9l4 8" />
      <path d="M3 13h18v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z" />
      <path d="M14 5l1 8" />
    </svg>
  ),
};

const badgeColors = {
  'New': 'bg-emerald-500',
  'Hot': 'bg-orange-500',
  'Sale': 'bg-rose-500',
  'AI': 'bg-emerald-600',
  'Fallback': 'bg-amber-600',
};

export default function Wardrobe({ onNavigate }) {
  const [productsList, setProductsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const saved = localStorage.getItem('wardrobeCategory');
    if (saved) {
      localStorage.removeItem('wardrobeCategory');
      return saved;
    }
    return 'Top Wear';
  });
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { userUid } = useAuth();

  const fetchWardrobe = async () => {
    if (!userUid) {
      setProductsList([]);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchWardrobeApi(userUid);
      if (data && data.length > 0) {
        const mapped = data.map(item => ({
          id: item.item_id,
          name: item.name,
          category:
            item.category === 'Top' ? 'Top Wear' :
              item.category === 'Bottom' ? 'Bottom Wear' :
                item.category === 'Footwear' ? 'Foot Wear' : 'Top Wear',
          price: item.brand || 'Personal Wardrobe',
          badge: item.ai_generated ? 'AI' : (item.fallback_used ? 'Fallback' : null),
          image: item.image_url
            ? `http://localhost:8000${item.image_url}`
            : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
          product_url: item.product_url,
        }));
        setProductsList(mapped);
      } else {
        setProductsList([]);
      }
    } catch (e) {
      console.error('Failed to fetch wardrobe:', e);
      setProductsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardrobe();
  }, [userUid]);

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const handleDeleteItem = async (product) => {
    if (!userUid || !product?.id) return;
    const confirmed = window.confirm(`Delete "${product.name}" from your wardrobe?`);
    if (!confirmed) return;

    try {
      setDeletingId(product.id);
      await deleteWardrobeItem(userUid, product.id);
      setProductsList(prev => prev.filter(item => item.id !== product.id));
      setWishlist(prev => prev.filter(id => id !== product.id));
    } catch (e) {
      console.error('Failed to delete wardrobe item:', e);
      alert(e.error || e.detail || 'Failed to delete item.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = productsList.filter(p => p.category === selectedCategory);

  return (
    <div className="w-full h-full flex flex-col bg-[#f9fafb] relative overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        
        {/* Header */}
        <div className="pt-12 px-6 pb-6 bg-white shadow-sm border-b border-gray-100 rounded-b-3xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mt-0.5">My Wardrobe</h1>
              <p className="text-sm text-gray-500 mt-1">
                Your personal collection.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('add-product')}
                className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 hover:shadow-lg transition-all cursor-pointer"
                title="Add Product"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.8} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 mb-5">
          <div className="bg-white rounded-2xl p-1.5 flex gap-1 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-semibold transition-all duration-200 ${selectedCategory === cat
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                <span className={selectedCategory === cat ? 'text-white' : 'text-gray-400'}>
                  {categoryIcons[cat]}
                </span>
                <span className="leading-tight text-center" style={{ fontSize: '10px' }}>
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section label */}
        <div className="px-6 mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">
            {filteredProducts.length} items in <span className="text-black">{selectedCategory}</span>
          </p>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Product Grid */}
        <div className="px-4">
          {filteredProducts.length === 0 && !loading ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900">No items found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[220px]">
                You haven't added any {selectedCategory.toLowerCase()} to your wardrobe yet.
              </p>
              <button
                onClick={() => onNavigate('add-product')}
                className="mt-5 px-5 py-3 bg-black text-white rounded-full text-sm font-bold shadow-sm active:scale-95 transition"
              >
                Add Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-8">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => {
                    if (product.product_url) {
                      window.open(product.product_url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {product.badge && (
                      <div className={`absolute top-2 left-2 ${badgeColors[product.badge]} text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide`}>
                        {product.badge}
                      </div>
                    )}

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90"
                      title="Wishlist"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        style={{ color: wishlist.includes(product.id) ? '#ef4444' : '#374151' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem(product); }}
                      disabled={deletingId === product.id}
                      className="absolute top-2 right-11 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90 disabled:opacity-60"
                      title="Delete item"
                    >
                      {deletingId === product.id ? (
                        <span className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M10 11v6M14 11v6M9 7l1-3h4l1 3M8 7l1 13h6l1-13" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-xs truncate mb-1">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-black text-sm">{product.price}</p>
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
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
             <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
             <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-black">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
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
