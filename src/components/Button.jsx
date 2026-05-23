import React from 'react';

export default function Button({ children, onClick, type = 'button', variant = 'primary', className = '' }) {
  const baseStyle = "w-full py-3.5 rounded-full font-semibold transition-transform active:scale-[0.98] duration-200 text-sm";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 shadow-md",
    outline: "bg-transparent text-black border border-gray-300 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-500 hover:text-black"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
