import React, { useState } from 'react';
import { AuthProvider } from './AuthContext';
import Signup from './pages/Signup';
import OTP from './pages/OTP';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';

function App() {
  const [currentPage, setCurrentPage] = useState('signup');

  const renderPage = () => {
    switch (currentPage) {
      case 'signup':
        return <Signup onNavigate={setCurrentPage} />;
      case 'otp':
        return <OTP onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'onboarding':
        return <Onboarding onComplete={() => setCurrentPage('home')} />;
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'add-product':
        return <AddProduct onNavigate={setCurrentPage} />;
      default:
        return <Signup onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center font-sans">
        <div className="w-full max-w-[480px] bg-[#f0f0f0] sm:rounded-[3rem] sm:shadow-2xl sm:overflow-hidden relative sm:border-[8px] sm:border-white">
          {renderPage()}
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
