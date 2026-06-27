import React, { useState, useEffect } from 'react';
import { fetchWardrobe as fetchWardrobeApi } from '../api';
import { useAuth } from '../AuthContext';

const categories = ['Top Wear', 'Bottom Wear', 'Foot Wear'];

const categoryIcons = {
  'Top Wear': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
    </svg>
  ),
  'Bottom Wear': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M6 2h12l2 7H4L6 2zM4 9l2 13h4l2-6 2 6h4l2-13"/>
    </svg>
  ),
  'Foot Wear': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 13l2-8h9l4 8"/>
      <path d="M3 13h18v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z"/>
      <path d="M14 5l1 8"/>
    </svg>
  ),
};

const mockProducts = [
  { id: 1,  name: 'Classic White Tee',   category: 'Top Wear',    price: '₹1,999',  badge: 'New',   image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
  { id: 2,  name: 'Denim Jacket',        category: 'Top Wear',    price: '₹4,299',  badge: 'Hot',   image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80' },
  { id: 7,  name: 'Black Hoodie',        category: 'Top Wear',    price: '₹3,499',  badge: null,    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80' },
  { id: 10, name: 'Striped Polo Shirt',  category: 'Top Wear',    price: '₹2,199',  badge: 'Sale',  image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80' },
  { id: 3,  name: 'Slim Fit Jeans',      category: 'Bottom Wear', price: '₹3,199',  badge: 'New',   image: 'https://images.unsplash.com/photo-1542272604-780c823d79fc?w=500&q=80' },
  { id: 4,  name: 'Cargo Pants',         category: 'Bottom Wear', price: '₹3,599',  badge: 'Hot',   image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80' },
  { id: 8,  name: 'Jogger Sweatpants',   category: 'Bottom Wear', price: '₹2,399',  badge: null,    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80' },
  { id: 11, name: 'Chino Shorts',        category: 'Bottom Wear', price: '₹1,899',  badge: 'Sale',  image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=500&q=80' },
  { id: 5,  name: 'Running Sneakers',    category: 'Foot Wear',   price: '₹6,499',  badge: 'Hot',   image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 6,  name: 'Casual Loafers',      category: 'Foot Wear',   price: '₹4,799',  badge: null,    image: 'https://images.unsplash.com/photo-1614252339460-a433a0026eaf?w=500&q=80' },
  { id: 9,  name: 'Leather Boots',       category: 'Foot Wear',   price: '₹9,999',  badge: 'New',   image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80' },
  { id: 12, name: 'White Chunky Kicks',  category: 'Foot Wear',   price: '₹7,299',  badge: 'Sale',  image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80' },
];

const badgeColors = {
  'New':      'bg-emerald-500',
  'Hot':      'bg-orange-500',
  'Sale':     'bg-rose-500',
  'AI':       'bg-emerald-600',
  'Fallback': 'bg-amber-600',
};

export default function Home({ onNavigate }) {
  const [productsList, setProductsList] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('Top Wear');
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  // ✅ Hook at top level of component
  const { mobileNo } = useAuth();

  const fetchWardrobe = async () => {
    try {
      setLoading(true);
      const data = await fetchWardrobeApi(mobileNo);
      if (data && data.length > 0) {
        const mapped = data.map(item => ({
          id: item.item_id,
          name: item.name,
          category:
            item.category === 'Top'      ? 'Top Wear'    :
            item.category === 'Bottom'   ? 'Bottom Wear' :
            item.category === 'Footwear' ? 'Foot Wear'   : 'Top Wear',
          price: item.brand || 'Personal Wardrobe',
          badge: item.ai_generated ? 'AI' : (item.fallback_used ? 'Fallback' : null),
          image: item.image_url
            ? `http://localhost:8000${item.image_url}`
            : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
        }));
        setProductsList([...mapped, ...mockProducts]);
      }
    } catch (e) {
      console.error('Failed to fetch wardrobe:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const filteredProducts = productsList.filter(p => p.category === selectedCategory);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen sm:min-h-[auto] flex flex-col bg-[#f0f0f0] sm:bg-transparent relative">

      {/* Notch Mock */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl sm:hidden z-10">
        <div className="absolute top-2 right-6 w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
      </div>

      {/* ───── Header ───── */}
      <div className="pt-12 px-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase">DRIPCHECK</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Discover</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Add Item Button */}
          <button
            onClick={() => onNavigate('add-product')}
            className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 hover:shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
            title="Add Product"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.8} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Wishlist count */}
          <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
            <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>

          {/* Avatar */}
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
            DC
          </div>
        </div>
      </div>

      {/* ───── Category Tabs ───── */}
      <div className="px-6 mb-5">
        <div className="bg-white rounded-2xl p-1.5 flex gap-1 shadow-sm border border-gray-100">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
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

      {/* ───── Section label ───── */}
      <div className="px-6 mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">
          {filteredProducts.length} items in <span className="text-black">{selectedCategory}</span>
        </p>
        <button className="text-xs font-semibold text-gray-400 flex items-center gap-1 hover:text-black transition-colors">
          Filter
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
          </svg>
        </button>
      </div>

      {/* ───── Loading indicator ───── */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ───── Product Grid ───── */}
      <div className="flex-1 px-4 pb-8 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                {product.badge && (
                  <div className={`absolute top-2 left-2 ${badgeColors[product.badge]} text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide`}>
                    {product.badge}
                  </div>
                )}

                {/* Wishlist button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90"
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
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-xs truncate mb-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-black text-sm">{product.price}</p>
                  <button className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
