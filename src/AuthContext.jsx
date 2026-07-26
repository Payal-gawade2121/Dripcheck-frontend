import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext({
  authToken: '',
  setAuthToken: () => {},
  mobileNo: '',
  setMobileNo: () => {},
  userUid: '',
  setUserUid: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
  const [mobileNo, setMobileNo] = useState(localStorage.getItem('mobileNo') || '');
  const [userUid, setUserUid] = useState(localStorage.getItem('userUid') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    if (authToken) localStorage.setItem('authToken', authToken);
    else localStorage.removeItem('authToken');
    if (mobileNo) localStorage.setItem('mobileNo', mobileNo);
    else localStorage.removeItem('mobileNo');
    if (userUid) localStorage.setItem('userUid', userUid);
    else localStorage.removeItem('userUid');
    if (isLoggedIn) localStorage.setItem('isLoggedIn', 'true');
    else localStorage.removeItem('isLoggedIn');
  }, [authToken, mobileNo, userUid, isLoggedIn]);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, mobileNo, setMobileNo, userUid, setUserUid, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
