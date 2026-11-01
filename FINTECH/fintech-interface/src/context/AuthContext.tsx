import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  is_verified?: boolean;
  two_fa_enabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authAPI.getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // If token exists, verify and get fresh profile
    if (authAPI.isAuthenticated()) {
      authAPI
        .me()
        .then((freshUser) => {
          setUser(freshUser);
          localStorage.setItem("gp_user", JSON.stringify(freshUser));
        })
        .catch(() => {
          // Token expired or invalid
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    // Handle token refresh failure / global logout
    const handleLogout = () => {
      setUser(null);
    };
    window.addEventListener("gp:logout", handleLogout);
    return () => window.removeEventListener("gp:logout", handleLogout);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    setUser(res.user);
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await authAPI.register(data);
    setUser(res.user);
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      localStorage.setItem("gp_user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

