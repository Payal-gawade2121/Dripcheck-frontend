import React from 'react';
import { useAuth } from '../AuthContext';

export default function Profile({ onNavigate }) {
  const { setAuthToken, setMobileNo, setUserUid, setIsLoggedIn, mobileNo } = useAuth();

  const handleLogout = () => {
    setAuthToken('');
    setMobileNo('');
    setUserUid('');
    setIsLoggedIn(false);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentPage');
    onNavigate('login');
  };

  const menuItems = [
    { icon: 'user', label: 'Edit Profile' },
    { icon: 'sliders', label: 'Edit Preferences', action: 'edit-preferences' },
    { icon: 'heart', label: 'Wishlist', action: 'wishlist' },
    { icon: 'help', label: 'Help & Support' },
  ];

  const renderIcon = (name) => {
    switch (name) {
      case 'user':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        );
      case 'sliders':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        );
      case 'heart':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'settings':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'help':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f9fafb] relative overflow-hidden">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        
        {/* Header */}
        <div className="px-6 pt-12 pb-6 bg-white border-b border-gray-100 shadow-sm rounded-b-3xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 shadow-inner">
              {mobileNo ? mobileNo.toString().substring(0, 2) : 'ME'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">My Profile</h1>
              <p className="text-sm text-gray-500 mt-0.5">{mobileNo || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-6 mt-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
            {menuItems.map((item, index) => (
              <button 
                key={index}
                onClick={() => item.action && onNavigate(item.action)}
                className={`w-full flex items-center justify-between p-4 px-5 hover:bg-gray-50 transition-colors active:bg-gray-100 ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                    {renderIcon(item.icon)}
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Log Out Button */}
        <div className="px-6 mt-6">
          <button 
            onClick={handleLogout}
            className="w-full bg-white border border-rose-100 text-rose-600 font-bold py-4 rounded-2xl shadow-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
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

        <button className="flex flex-col items-center gap-1 text-black">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>

    </div>
  );
}
