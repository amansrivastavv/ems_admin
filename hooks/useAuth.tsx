"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Role } from "@/types/user";
import { getAuthData, setAuthData, clearAuthData, isAuthenticated } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check initial auth state
    const { user: storedUser, token } = getAuthData();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token: string, userData: User) => {
    setAuthData(token, userData);
    setUser(userData);
    router.push("/dashboard");
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    router.push("/login");
  };

  const hasRole = (requiredRole: Role) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has access to everything
    return user.role === requiredRole;
  };

  // Route protection
  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === "/login" || pathname === "/signup";
      const isDashboardPage = pathname.startsWith("/dashboard");
      const isLoggedIn = !!user;

      if (!isLoggedIn && isDashboardPage) {
        router.push("/login"); 
      } else if (isLoggedIn && isAuthPage) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, pathname, router]);


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;

};
