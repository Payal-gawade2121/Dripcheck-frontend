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
    { icon: 'settings', label: 'Munder testing', action: 'munder-testing' },
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
      <div className="flex-1 overflow-y-auto app-scroll">

        <div className="px-5 sm:px-8 xl:px-12 py-8 xl:py-10 max-w-[1400px] mx-auto">

          {/* Header */}
          <div>
            <h1 className="text-2xl lg:text-[2rem] font-bold text-gray-900 leading-tight tracking-tight">My Profile</h1>
            <p className="text-sm lg:text-[15px] text-gray-500 mt-1.5">
              Manage your account and style preferences.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-start">

            {/* Identity card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-7">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600 shrink-0">
                  {mobileNo ? mobileNo.toString().substring(0, 2) : 'ME'}
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-gray-900 truncate">DripCheck Member</p>
                  <p className="text-sm text-gray-500 mt-1 truncate">{mobileNo || 'Not signed in'}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
              </div>

              <div className="mt-7 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Plan</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">Wardrobe AI</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Member since</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">Your first drip</p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => item.action && onNavigate(item.action)}
                  className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${
                    index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                      {renderIcon(item.icon)}
                    </div>
                    <span className="font-semibold text-gray-800 text-[15px]">{item.label}</span>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}

              <div className="p-6">
                <button
                  onClick={handleLogout}
                  className="w-full bg-white border border-rose-100 text-rose-600 font-bold py-3.5 rounded-2xl hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
