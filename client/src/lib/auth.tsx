import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SafeUser } from "@shared/schema";

interface AuthContextType {
  user: SafeUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOtp: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);

  const { data, isLoading } = useQuery<{ user: SafeUser }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  }, [data]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, username, password }: { email: string; username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", { email, username, password });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      if (!response.ok) throw new Error("Logout failed");
      return response.json();
    },
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/purchases"] });
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/send-otp");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP");
      return data;
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: string) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", { otp });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to verify OTP");
      return data;
    },
    onSuccess: () => {
      if (user) {
        setUser({ ...user, emailVerified: true });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, username: string, password: string) => {
    await registerMutation.mutateAsync({ email, username, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const sendOtp = async () => {
    await sendOtpMutation.mutateAsync();
  };

  const verifyOtp = async (otp: string) => {
    await verifyOtpMutation.mutateAsync(otp);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, sendOtp, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}