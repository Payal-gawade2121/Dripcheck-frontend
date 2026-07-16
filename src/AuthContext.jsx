import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext({
  authToken: '',
  setAuthToken: () => {},
  mobileNo: '',
  setMobileNo: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
  const [mobileNo, setMobileNo] = useState(localStorage.getItem('mobileNo') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    if (authToken) localStorage.setItem('authToken', authToken);
    else localStorage.removeItem('authToken');
    if (mobileNo) localStorage.setItem('mobileNo', mobileNo);
    else localStorage.removeItem('mobileNo');
    if (isLoggedIn) localStorage.setItem('isLoggedIn', 'true');
    else localStorage.removeItem('isLoggedIn');
  }, [authToken, mobileNo, isLoggedIn]);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, mobileNo, setMobileNo, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
