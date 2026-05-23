import React, { useState } from 'react';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';

export default function OTP({ onNavigate }) {
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    
    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join('').length === 4) {
      onNavigate('login');
    }
  };

  const footer = (
    <div className="text-center mt-6">
      <p className="text-gray-400 font-medium">Didn't receive code?</p>
      <button className="text-black font-bold mt-1 hover:underline">
        Resend OTP
      </button>
      <div className="mt-8">
        <button onClick={() => onNavigate('signup')} className="text-sm text-gray-500 hover:text-black">
          &larr; Back to Sign Up
        </button>
      </div>
    </div>
  );

  return (
    <AuthCard title="Verify Mobile" subtitle="Enter the 4-digit code sent to your number" footer={footer}>
      <div className="flex justify-center space-x-4 mb-8 mt-4">
        {otp.map((data, index) => {
          return (
            <input
              className="w-14 h-14 text-center text-2xl font-bold rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              onChange={e => handleChange(e.target, index)}
              onFocus={e => e.target.select()}
            />
          );
        })}
      </div>
      
      <Button onClick={handleVerify}>Verify</Button>
    </AuthCard>
  );
}
