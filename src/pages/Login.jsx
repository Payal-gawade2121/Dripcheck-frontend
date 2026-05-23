import React, { useState } from 'react';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';
import SocialLogins from '../components/SocialLogins';

export default function Login({ onNavigate }) {
  const [mobile, setMobile] = useState('');

  const handleLogin = () => {
    // Basic validation
    if (mobile.trim().length >= 10) {
      onNavigate('onboarding');
    }
  };

  const footer = (
    <>
      <SocialLogins />
      <div className="text-center mt-6">
        <p className="text-gray-400 font-medium">Don't have an account?</p>
        <button onClick={() => onNavigate('signup')} className="text-black font-bold mt-1 hover:underline">
          Sign Up
        </button>
      </div>
    </>
  );

  return (
    <AuthCard title="Welcome Back!" subtitle="Log in to your account" footer={footer}>
      <div className="space-y-6">
        <Input 
          label="Mobile Number" 
          type="tel" 
          placeholder="Enter your mobile number" 
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        
        <Button onClick={handleLogin}>Log In</Button>
      </div>
    </AuthCard>
  );
}
