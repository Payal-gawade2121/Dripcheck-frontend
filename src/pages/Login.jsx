import React, { useState } from 'react';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';
import SocialLogins from '../components/SocialLogins';
import Select from '../components/Select';
import { login, saveAuthSession } from '../api';
import { useAuth } from '../AuthContext';

export default function Login({ onNavigate }) {
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuthToken, setMobileNo, setUserUid, setIsLoggedIn } = useAuth();

  const countryOptions = [
    { label: '+1 (US)', value: '+1' },
    { label: '+44 (UK)', value: '+44' },
    { label: '+91 (IN)', value: '+91' },
    { label: '+61 (AU)', value: '+61' },
  ];

  const handleLogin = async () => {
    const fullNumber = `${countryCode}${mobile}`;
    if (mobile.trim().length < 10) {
      setError('Enter a valid mobile number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await login(fullNumber);
      saveAuthSession(data);
      setAuthToken(data.access_token || '');
      setUserUid(data.user_id || '');
      setIsLoggedIn(true);

      // Backend redirects to onboarding based on show_onboarding (or legacy redirect_url)
      let target = 'home';
      if (typeof data.show_onboarding === 'boolean') {
        target = data.show_onboarding ? 'onboarding' : 'home';
      } else if (data.redirect_url === '/onboarding') {
        target = 'onboarding';
      }
      onNavigate(target);
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
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
        <Select
          label="Country Code"
          options={countryOptions}
          value={countryCode}
          onChange={e => setCountryCode(e.target.value)}
        />
        <Input
          label="Mobile Number"
          type="tel"
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </Button>
      </div>
    </AuthCard>
  );
}

