import { getUser } from '@/services/user';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  user: any;
  //   setUser: (user: any) => void;
  //   logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false
  });

  if (!user) {
    return null;
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
