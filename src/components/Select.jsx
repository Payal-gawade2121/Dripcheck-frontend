import React from 'react';

export default function Select({ label, options, value, onChange, placeholder = "Select an option", error }) {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="text-sm font-semibold text-gray-900 mb-1.5 ml-1">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-2xl border appearance-none bg-white ${
            error ? 'border-red-500' : 'border-gray-200'
          } focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all text-sm ${
            !value ? 'text-gray-400' : 'text-gray-900'
          }`}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
    </div>
  );
}
