"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  clearAuth,
  getAccessToken,
  getUser,
  setTokens,
  setUser,
  type StoredUser,
} from "@/lib/auth-storage";

type AuthContextValue = {
  user: StoredUser | null;
  isAuthenticated: boolean;
  /** True while the initial localStorage hydration is in progress. */
  isLoading: boolean;
  signIn: (user: StoredUser, access: string, refresh: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getUser();
    if (token && storedUser) {
      setUserState(storedUser);
    }
    setIsLoading(false);
  }, []);

  const signIn = useCallback(
    (userData: StoredUser, access: string, refresh: string) => {
      setTokens(access, refresh);
      setUser(userData);
      setUserState(userData);
    },
    [],
  );

  const signOut = useCallback(() => {
    clearAuth();
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
