import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createApi } from "./api";

const TOKEN_KEY = "armapply_token";

type Auth = {
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  api: ReturnType<typeof createApi>;
};

const Ctx = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem(TOKEN_KEY);
      setToken(t);
      setReady(true);
    })();
  }, []);

  const api = useMemo(() => createApi(() => token), [token]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await createApi(() => null).post("/auth/login", { email, password });
      await AsyncStorage.setItem(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
    },
    []
  );

  const register = useCallback(async (email: string, password: string) => {
    const { data } = await createApi(() => null).post("/auth/register", { email, password });
    await AsyncStorage.setItem(TOKEN_KEY, data.access_token);
    setToken(data.access_token);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ token, ready, login, register, logout, api }),
    [token, ready, login, register, logout, api]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const x = useContext(Ctx);
  if (!x) throw new Error("useAuth outside AuthProvider");
  return x;
}
