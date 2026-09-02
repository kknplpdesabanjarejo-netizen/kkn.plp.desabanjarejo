import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = checking, false = anon, object = user
  const [ready, setReady] = useState(false);

  const check = useCallback(async () => {
    const token = localStorage.getItem("kkn_token");
    if (!token) {
      setUser(false);
      setReady(true);
      return;
    }
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
    } catch {
      localStorage.removeItem("kkn_token");
      setUser(false);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("kkn_token", res.data.data.token);
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("kkn_token");
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
