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
    console.log('AuthProvider: Checking authentication status...');
    const authCookie = Cookies.get('isAuthenticated');
    const userDataStr = localStorage.getItem('userData');
    
    console.log('AuthProvider: Cookie status:', authCookie);
    console.log('AuthProvider: User data exists:', !!userDataStr);

    if (authCookie === 'true' && userDataStr) {
      console.log('AuthProvider: Valid authentication found');
      setIsAuthenticated(true);
      setUser(JSON.parse(userDataStr));
    } else {
      console.log('AuthProvider: No valid authentication found');
    }
  }, []);

  const login = async (username: string, password: string) => {
    if (username === 'demo' && password === 'aiforimpact2024') {
      try {
        // Set cookie terlebih dahulu
        Cookies.set('isAuthenticated', 'true', {
          expires: 7,
          path: '/',
          sameSite: 'lax', // Ubah ke 'lax' untuk kompatibilitas
        });
        
        // Set user data
        const userData = {
          username: 'demo',
          role: 'admin'
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Set state setelah cookie dan localStorage
        setIsAuthenticated(true);
        setUser(userData);
        
        return true;
      } catch (error) {
        console.error('AuthProvider: Error storing authentication data:', error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    try {
      // Hapus cookie dan localStorage terlebih dahulu
      Cookies.remove('isAuthenticated', { path: '/' });
      localStorage.removeItem('userData');
      
      // Set state
      setIsAuthenticated(false);
      setUser(null);
      
      // Gunakan window.location.href untuk redirect
      window.location.href = '/';
    } catch (error) {
      console.error('AuthProvider: Error during logout:', error);
    }
  };
  

  console.log('AuthProvider: Current auth state:', { isAuthenticated, user });

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth: Hook used outside of AuthProvider!');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};