import React from 'react';

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="w-full max-w-md mx-auto min-h-screen sm:min-h-[auto] flex flex-col pt-12 sm:pt-0 sm:justify-center relative bg-[#f0f0f0] sm:bg-transparent">
      
      {/* Notch Mock (visible only on mobile to match the design) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl sm:hidden">
        <div className="absolute top-2 right-6 w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
      </div>

      <div className="text-center mt-6 mb-6">
        <h2 className="text-xl font-black tracking-widest uppercase mb-4">DRIPCHECK</h2>
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
      </div>

      <div className="bg-white rounded-[2rem] p-6 mx-4 sm:mx-0 shadow-sm border border-gray-100 flex-grow sm:flex-grow-0 flex flex-col">
        {subtitle && (
          <p className="text-center text-gray-400 font-medium mb-6">
            {subtitle}
          </p>
        )}
        
        <div className="flex-grow">
          {children}
        </div>
      </div>

      {footer && (
        <div className="mt-4 mx-4 sm:mx-0 mb-8">
          {footer}
        </div>
      )}
    </div>
  );
}
