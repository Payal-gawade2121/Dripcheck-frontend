import React, { useState } from 'react';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import { signup } from '../api';
import { useAuth } from '../AuthContext';

export default function Signup({ onNavigate }) {
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setMobileNo } = useAuth();

  const countryOptions = [
    { label: '+1 (US)', value: '+1' },
    { label: '+44 (UK)', value: '+44' },
    { label: '+91 (IN)', value: '+91' },
    { label: '+61 (AU)', value: '+61' },
  ];

  const handleSignup = async () => {
    const fullNumber = `${countryCode}${mobile}`;
    if (mobile.trim().length < 10) {
      setError('Enter a valid mobile number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signup(fullNumber);
      setMobileNo(fullNumber);
      onNavigate('otp');
    } catch (e) {
      setError(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="text-center mt-6">
      <p className="text-gray-400 font-medium">Already have an account?</p>
      <button onClick={() => onNavigate('login')} className="text-black font-bold mt-1 hover:underline">
        Log In
      </button>
    </div>
  );

  return (
    <AuthCard title="Welcome!" subtitle="Create your DripCheck account" footer={footer}>
      <div className="space-y-4">
        <Select
          label="Country Code"
          options={countryOptions}
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        />
        <Input
          label="Mobile Number"
          type="tel"
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={handleSignup} disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </div>
    </AuthCard>
  );
}
