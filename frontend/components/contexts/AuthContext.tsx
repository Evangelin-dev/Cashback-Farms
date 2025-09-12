import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { UserRole } from '../../types';

interface CurrentUser {
  mobile: string;
  role: UserRole;
  name?: string;
  user_type?: string;
  mobileVerified?: boolean;
  // Add any other user properties you need
  [key: string]: any;
}

interface AuthContextType {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  sendOtp: (mobile: string) => Promise<boolean>;
  verifyOtpAndLogin: (mobile: string, otp: string, role: UserRole) => Promise<boolean>;
  setCurrentUser: (user: CurrentUser | null) => void; // New function to set current user
  logout: () => void;
  isAuthenticated: boolean; // Helper to check if user is logged in
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // Function to set current user and update localStorage
  const setCurrentUser = (user: CurrentUser | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        setIsLoading(true);
        
        // Check for currentUser in localStorage
        const storedUser = localStorage.getItem('currentUser');
        const accessToken = localStorage.getItem('access_token');
        
        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);
          
          // Map user_type to role if needed
          let role = UserRole.USER; // default
          if (parsedUser.user_type === 'real_estate_agent') {
            role = UserRole.ADMIN; // or whatever role you use for agents
          }
          
          const userWithRole: CurrentUser = {
            ...parsedUser,
            role,
            mobile: parsedUser.mobile || parsedUser.phone || parsedUser.email || '',
            mobileVerified: parsedUser.mobileVerified || true
          };
          
          setCurrentUserState(userWithRole);
        } else {
          setCurrentUserState(null);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        setCurrentUserState(null);
        // Clear corrupted data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Simplified functions that always succeed (keeping your existing logic)
  const sendOtp = async (mobile: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Your existing OTP logic here
      return true;
    } catch (err) {
      setError('Failed to send OTP');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndLogin = async (mobile: string, otp: string, role: UserRole): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Your existing verification logic here
      return true;
    } catch (err) {
      setError('Failed to verify OTP');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUserState(null);
    // Clear all auth-related data from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    setError(null);
  };

  const isAuthenticated = !!(currentUser && localStorage.getItem('access_token'));

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isLoading, 
        error, 
        sendOtp, 
        verifyOtpAndLogin, 
        setCurrentUser, // Expose setCurrentUser
        logout,
        isAuthenticated
      }}
    >
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