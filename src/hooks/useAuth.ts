'use client';
import { useState, useEffect } from 'react';

interface SimpleUser {
  email: string;
  name: string;
}

// Hard-coded users for MVP
const DEMO_USERS = [
  { email: 'admin@dico.co.id', password: 'admin123', name: 'Admin DICO' },
  { email: 'marketing@dico.co.id', password: 'marketing123', name: 'Marketing Team' },
  { email: 'demo@dico.co.id', password: 'demo123', name: 'Demo User' }
];

export function useAuth() {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check stored auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('cmm-user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
        localStorage.removeItem('cmm-user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const authUser = { email: foundUser.email, name: foundUser.name };
        setUser(authUser);
        localStorage.setItem('cmm-user', JSON.stringify(authUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('cmm-user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    loading,
    login,
    logout
  };
}