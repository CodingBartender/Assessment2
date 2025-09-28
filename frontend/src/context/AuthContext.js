import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    // Save user info to sessionStorage
    if (userData) {
      sessionStorage.setItem('user_id', userData.id || userData._id || '');
      sessionStorage.setItem('user_role', userData.role || '');
      sessionStorage.setItem('user_name', userData.name || '');
      sessionStorage.setItem('user_email', userData.email || '');
      sessionStorage.setItem('user_token', userData.token || '');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
