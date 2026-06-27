import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext({
  authToken: '',
  setAuthToken: () => {},
  mobileNo: '',
  setMobileNo: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
  const [mobileNo, setMobileNo] = useState(localStorage.getItem('mobileNo') || '');

  useEffect(() => {
    if (authToken) localStorage.setItem('authToken', authToken);
    else localStorage.removeItem('authToken');
    if (mobileNo) localStorage.setItem('mobileNo', mobileNo);
    else localStorage.removeItem('mobileNo');
  }, [authToken, mobileNo]);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, mobileNo, setMobileNo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
