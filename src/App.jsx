import React, { useState } from 'react';
import { AuthProvider } from './AuthContext';
import Signup from './pages/Signup';
import OTP from './pages/OTP';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';

const loggedInPages = new Set(['home', 'onboarding', 'add-product']);

function getInitialPage() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) return 'signup';

  const storedPage = localStorage.getItem('currentPage');
  return loggedInPages.has(storedPage) ? storedPage : 'home';
}

function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage);

  const navigate = (page) => {
    setCurrentPage(page);
    if (loggedInPages.has(page)) {
      localStorage.setItem('currentPage', page);
    } else {
      localStorage.removeItem('currentPage');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'signup':
        return <Signup onNavigate={navigate} />;
      case 'otp':
        return <OTP onNavigate={navigate} />;
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'onboarding':
        return <Onboarding onComplete={() => navigate('home')} />;
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'add-product':
        return <AddProduct onNavigate={navigate} />;
      default:
        return <Signup onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#e0e0e0] flex items-center justify-center font-sans sm:py-8">
        <div className="w-full h-[100dvh] sm:w-[400px] sm:h-[800px] bg-[#f0f0f0] sm:rounded-[3rem] sm:shadow-2xl overflow-hidden relative sm:border-[8px] sm:border-white flex flex-col">
          {renderPage()}
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
