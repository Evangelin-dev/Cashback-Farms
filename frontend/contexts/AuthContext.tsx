import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserRole } from '../types';

interface CurrentUser {
  mobile: string;
  role: UserRole;
  name?: string; // Optional: Could be fetched or set
}

interface AuthContextType {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  sendOtp: (mobile: string) => Promise<boolean>; // Returns true if OTP "sent" successfully
  verifyOtpAndLogin: (mobile: string, otp: string, role: UserRole) => Promise<boolean>; // Returns true on successful login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock OTP

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>({
    mobile: '1234567890',
    role: UserRole.USER,
    name: 'Demo User'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  // Simplified functions that always succeed
  const sendOtp = async (mobile: string): Promise<boolean> => {
    return true;
  };

  const verifyOtpAndLogin = async (mobile: string, otp: string, role: UserRole): Promise<boolean> => {
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, error, sendOtp, verifyOtpAndLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
