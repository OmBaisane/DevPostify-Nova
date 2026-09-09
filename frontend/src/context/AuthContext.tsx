"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponseData,
} from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const response = await api.get<AuthResponseData>("/auth/me");
      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponseData>(
      "/auth/login",
      credentials,
    );
    if (response.data?.user) {
      setUser(response.data.user);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await api.post<AuthResponseData>(
      "/auth/register",
      credentials,
    );
    if (response.data?.user) {
      setUser(response.data.user);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
