import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, LoginFormData, SignupFormData } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<User>;
  logout: () => Promise<void>;
  signup: (data: SignupFormData) => Promise<User>;
  refreshUser: () => Promise<void>;
  getFullName: (u?: User | null) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getFullName(user?: User | null): string {
  if (!user) return 'User';
  const first = user.firstName?.trim() ?? '';
  const last = user.lastName?.trim() ?? '';
  const full = `${first} ${last}`.trim();
  return full || user.email || 'User';
}

function isAdminUser(user: User | null): boolean {
  if (!user) return false;
  const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'];
  return user.roles?.some((r) => adminRoles.includes(r)) ?? false;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const fresh = await authService.getMe();
    if (fresh) setUser(fresh);
  }, []);

  useEffect(() => {
    const stored = authService.getCurrentUser();
    if (stored && authService.isAuthenticated()) {
      setUser(stored);
      // Refresh from server; keep loading until resolved so components
      // never render with a null/partial user on page reload.
      authService.getMe().then((fresh) => {
        if (fresh) setUser(fresh);
        else {
          // Token expired / invalid — clear stale session
          authService.logout().catch(() => {});
          setUser(null);
        }
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginFormData): Promise<User> => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authService.login(data);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const signup = async (data: SignupFormData): Promise<User> => {
    setIsLoading(true);
    try {
      const { user: newUser } = await authService.signup(data);
      setUser(newUser);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: isAdminUser(user),
        isLoading,
        login,
        logout,
        signup,
        refreshUser,
        getFullName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};