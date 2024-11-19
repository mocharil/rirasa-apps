"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: {
    username: string;
    role: string;
  } | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string; role: string; } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount
    const authCookie = Cookies.get('isAuthenticated');
    const userDataStr = localStorage.getItem('userData');
    
    if (authCookie === 'true' && userDataStr) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userDataStr));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Dummy authentication
    if (username === 'demo' && password === 'demomenyala24') {
      setIsAuthenticated(true);
      // Set user data
      const userData = {
        username: 'demo',
        role: 'admin'
      };
      setUser(userData);
      
      // Store authentication state
      Cookies.set('isAuthenticated', 'true', { expires: 7 }); // 7 days
      localStorage.setItem('userData', JSON.stringify(userData));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    Cookies.remove('isAuthenticated');
    localStorage.removeItem('userData');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};