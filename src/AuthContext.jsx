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
  const [authToken, setAuthToken] = useState(localStorage.getItem('access_token') || '');
  const [mobileNo, setMobileNo] = useState(localStorage.getItem('mobileNo') || '');
  const [userUid, setUserUid] = useState(localStorage.getItem('user_id') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    if (authToken) localStorage.setItem('access_token', authToken);
    else localStorage.removeItem('access_token');
    if (mobileNo) localStorage.setItem('mobileNo', mobileNo);
    else localStorage.removeItem('mobileNo');
    if (userUid) localStorage.setItem('user_id', userUid);
    else localStorage.removeItem('user_id');
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
