import React, { useState } from 'react';

const bundles = [
  {
    id: 1,
    score: 98,
    explanation: 'Recommended to complement your existing wardrobe',
    aiSlot: 'topwear',
    items: {
      topwear: { name: 'Italian Linen Shirt', brand: 'Zegna', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80' },
      bottomwear: { name: 'Japanese Selvedge Denim', brand: 'APC', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&q=80' },
      footwear: { name: 'Minimalist White Sneakers', brand: 'Common Projects', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80' },
    },
  },
  {
    id: 2,
    score: 96,
    explanation: 'Completes your smart-casual rotation perfectly',
    aiSlot: 'bottomwear',
    items: {
      topwear: { name: 'Merino Silk Blend Tee', brand: 'Theory', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
      bottomwear: { name: 'Tailored Dress Pants', brand: 'Suitsupply', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80' },
      footwear: { name: 'Italian Leather Loafers', brand: 'Tod\'s', image: 'https://images.unsplash.com/photo-1614252235316-8c857f38b7f4?w=400&q=80' },
    },
  },
  {
    id: 3,
    score: 94,
    explanation: 'Elevates your weekend aesthetic instantly',
    aiSlot: 'footwear',
    items: {
      topwear: { name: 'Cashmere Crew Neck', brand: 'Loro Piana', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80' },
      bottomwear: { name: 'Cotton Chino Pants', brand: 'Bonobos', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80' },
      footwear: { name: 'Chelsea Boots', brand: 'Blundstone', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&q=80' },
    },
  },
  {
    id: 4,
    score: 92,
    explanation: 'Adds a refined edge to your daily rotation',
    aiSlot: 'topwear',
    items: {
      topwear: { name: 'Oxford Button-Down', brand: 'Ralph Lauren', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80' },
      bottomwear: { name: 'Wool Trousers', brand: 'Hugo Boss', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80' },
      footwear: { name: 'Oxford Cap Toe', brand: 'Allen Edmonds', image: 'https://images.unsplash.com/photo-1614252364410-9113d542d0e6?w=400&q=80' },
    },
  },
  {
    id: 5,
    score: 90,
    explanation: 'The missing piece for your office wardrobe',
    aiSlot: 'bottomwear',
    items: {
      topwear: { name: 'Italian Linen Shirt', brand: 'Zegna', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80' },
      bottomwear: { name: 'Japanese Selvedge Denim', brand: 'APC', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&q=80' },
      footwear: { name: 'Chelsea Boots', brand: 'Blundstone', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&q=80' },
    },
  },
  {
    id: 6,
    score: 87,
    explanation: 'Sneakers that tie your whole look together',
    aiSlot: 'footwear',
    items: {
      topwear: { name: 'Cashmere Crew Neck', brand: 'Loro Piana', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80' },
      bottomwear: { name: 'Cotton Chino Pants', brand: 'Bonobos', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80' },
      footwear: { name: 'Minimalist White Sneakers', brand: 'Common Projects', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80' },
    },
  },
  {
    id: 7,
    score: 85,
    explanation: 'Brings balance to your neutral-toned wardrobe',
    aiSlot: 'topwear',
    items: {
      topwear: { name: 'Merino Silk Blend Tee', brand: 'Theory', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
      bottomwear: { name: 'Wool Trousers', brand: 'Hugo Boss', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80' },
      footwear: { name: 'Italian Leather Loafers', brand: 'Tod\'s', image: 'https://images.unsplash.com/photo-1614252235316-8c857f38b7f4?w=400&q=80' },
    },
  },
];

const slotLabels = { topwear: 'Topwear', bottomwear: 'Bottomwear', footwear: 'Footwear' };

export default function AiDrip({ onNavigate }) {
  const [expandedInsight, setExpandedInsight] = useState(null);

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
        .muted-image {
          filter: grayscale(0.6) saturate(0.5) brightness(1.05);
          transition: filter 0.4s ease;
        }
        .muted-image:hover {
          filter: grayscale(0.2) saturate(0.8) brightness(1.02);
        }
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

        {/* Bundle Cards */}
        <div className="px-5 mt-4 space-y-6">
          {bundles.map((bundle) => {
            const isExpanded = expandedInsight === bundle.id;
            const slots = ['topwear', 'bottomwear', 'footwear'];

            return (
              <div
                key={bundle.id}
                className={`bundle-card bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-hidden opacity-0 animate-fade-slide-up`}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">Unlock 5 bundles</h2>
                  <button className="text-black hover:text-gray-600 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>

                {/* Product Tiles Row */}
                <div className="flex gap-2">
                  {slots.map((slot) => {
                    const item = bundle.items[slot];
                    const isAi = bundle.aiSlot === slot;

                    return (
                      <div key={slot} className="flex-1">
                        <div className={`relative w-full aspect-[3/4] ${isAi ? 'animate-iridescent animate-glow-pulse' : 'rounded-xl overflow-hidden'}`}>
                          <div className={`w-full h-full overflow-hidden ${isAi ? 'rounded-[12px]' : 'rounded-xl'} bg-white`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bundle Footer */}
                <div className="flex items-center gap-3 mt-4">
                  <button className="flex-[3] bg-black text-white text-[14px] font-bold py-2.5 rounded-full transition-all duration-200 active:scale-[0.98]">
                    Buy suggested product
                  </button>
                  <button
                    onClick={() => setExpandedInsight(isExpanded ? null : bundle.id)}
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
                          AI matched the <strong className="text-gray-900">{slotLabels[bundle.aiSlot].toLowerCase()}</strong> from our catalog to complete your outfit. It was selected based on color harmony, style compatibility, and season relevance with your existing <strong className="text-gray-900">{slots.filter(s => s !== bundle.aiSlot).map(s => slotLabels[s].toLowerCase()).join(' and ')}</strong>.
                        </p>
                        <div className="flex gap-1.5 mt-2.5">
                          <span className="text-[9px] font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/50">Color harmony</span>
                          <span className="text-[9px] font-medium text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100/50">Style match</span>
                          <span className="text-[9px] font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100/50">Season fit</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

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
