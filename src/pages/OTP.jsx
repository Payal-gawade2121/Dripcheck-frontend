import { useState } from 'react';
import { verifyOtp } from '../api';
import { useAuth } from '../AuthContext';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';

export default function OTP({ onNavigate }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // ✅ Hook called at top level — NOT inside an async function
  const { mobileNo, setIsLoggedIn } = useAuth();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async () => {
    if (otp.join('').length !== 4) return;
    setLoading(true);
    setError('');
    try {
      const data = await verifyOtp(mobileNo, otp.join(''));
      const { redirect_url } = data;
      setIsLoggedIn(true);
      onNavigate(redirect_url === '/onboarding' ? 'onboarding' : 'home');
    } catch (e) {
      setError(e.message || 'OTP verification failed');
    } finally {
      setLoading(false);
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
        {otp.map((data, index) => (
          <input
            key={index}
            className="w-14 h-14 text-center text-2xl font-bold rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
            type="text"
            name="otp"
            maxLength="1"
            value={data}
            onChange={e => handleChange(e.target, index)}
            onFocus={e => e.target.select()}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      <Button onClick={handleVerify} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify'}
      </Button>
    </AuthCard>
  );
}
