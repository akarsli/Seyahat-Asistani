import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('holidaytrip_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('holidaytrip_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('holidaytrip_user');
  };

  const decrementQuota = () => {
    if (user) {
      const currentQuota = user.remainingQuota !== undefined ? user.remainingQuota : 3;
      if (currentQuota > 0) {
        const updatedUser = { ...user, remainingQuota: currentQuota - 1 };
        setUser(updatedUser);
        localStorage.setItem('holidaytrip_user', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, decrementQuota }}>
      {children}
    </AuthContext.Provider>
  );
};
