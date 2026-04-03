'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  organizationId: string | null;
  token: string | null;
  setOrganizationId: (id: string | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const savedOrgId = localStorage.getItem('organizationId') || 'demo-org-id';
    const savedToken = localStorage.getItem('token');
    setOrganizationId(savedOrgId);
    setToken(savedToken);
  }, []);

  const handleSetOrgId = (id: string | null) => {
    setOrganizationId(id);
    if (id) localStorage.setItem('organizationId', id);
    else localStorage.removeItem('organizationId');
  };

  const handleSetToken = (t: string | null) => {
    setToken(t);
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      organizationId, 
      token, 
      setOrganizationId: handleSetOrgId, 
      setToken: handleSetToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
