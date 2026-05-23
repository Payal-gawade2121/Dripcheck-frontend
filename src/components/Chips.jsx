import React from 'react';

export default function Chips({ options, selectedOptions, onChange, multiSelect = true, colorMode = false }) {
  const toggleOption = (option) => {
    if (multiSelect) {
      if (selectedOptions.includes(option)) {
        onChange(selectedOptions.filter(o => o !== option));
      } else {
        onChange([...selectedOptions, option]);
      }
    } else {
      onChange([option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt, i) => {
        const isSelected = selectedOptions.includes(opt.value || opt);
        const value = opt.value || opt;
        const label = opt.label || opt;
        const color = opt.color; // Used if colorMode is true

        if (colorMode && color) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggleOption(value)}
              className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                isSelected ? 'border-black scale-110 shadow-md' : 'border-transparent hover:scale-105 shadow-sm'
              }`}
              style={{ backgroundColor: color }}
              title={label}
            >
              {isSelected && (
                <svg className="w-5 h-5 text-white mix-blend-difference" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        }

        return (
          <button
            key={i}
            type="button"
            onClick={() => toggleOption(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              isSelected 
                ? 'bg-black text-white border-black shadow-md' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
