import React from 'react';

export default function Input({ label, type = 'text', placeholder, value, onChange, error }) {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="text-sm font-semibold text-gray-900 mb-1.5 ml-1">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-2xl border ${
          error ? 'border-red-500' : 'border-gray-200'
        } bg-white focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all text-sm placeholder:text-gray-400`}
      />
      {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
    </div>
  );
}
