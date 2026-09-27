import React from 'react';

export default function MunderTesting({ onNavigate }) {
  return (
    <div className="w-full h-full flex flex-col bg-[#f9fafb] relative overflow-hidden">
      <div className="flex-1 overflow-y-auto app-scroll">
        <div className="px-5 sm:px-8 xl:px-12 py-8 xl:py-10 max-w-[1400px] mx-auto">

          {/* Header */}
          <div className="flex items-start gap-4">
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 shrink-0 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Back to profile"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl lg:text-[2rem] font-bold text-gray-900 leading-tight tracking-tight">Munder testing</h1>
              <p className="text-sm lg:text-[15px] text-gray-500 mt-1.5">Internal tools for experimenting with matching.</p>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 min-h-[320px] flex flex-col items-center justify-center text-center px-6 py-16 bg-white rounded-3xl border border-gray-200/80">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Coming soon</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-[360px]">
              This page is under construction. Check back later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}