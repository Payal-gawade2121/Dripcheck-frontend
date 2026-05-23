import React, { useState } from 'react';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';
import SocialLogins from '../components/SocialLogins';

export default function Signup({ onNavigate }) {
  const [mobile, setMobile] = useState('');

  const handleSignup = () => {
    if (mobile.trim().length >= 10) {
      onNavigate('otp');
    }
  };

  const footer = (
    <>
      <SocialLogins />
      <div className="text-center mt-6">
        <p className="text-gray-400 font-medium">Already have an account?</p>
        <button onClick={() => onNavigate('login')} className="text-black font-bold mt-1 hover:underline">
          Log In
        </button>
      </div>
    </>
  );

  return (
    <AuthCard title="Welcome!" subtitle="Create an account" footer={footer}>
      <div className="space-y-4">
        <Input 
          label="Mobile Number" 
          type="tel" 
          placeholder="Enter your mobile number" 
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        
        <div className="flex items-center space-x-2 pt-2 pb-4 ml-1">
          <input 
            type="checkbox" 
            id="terms" 
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black" 
          />
          <label htmlFor="terms" className="text-sm text-gray-500">
            I agree to follow the <span className="text-black font-bold">terms of use</span>
          </label>
        </div>

        <Button onClick={handleSignup}>Sign Up</Button>
      </div>
    </AuthCard>
  );
}
