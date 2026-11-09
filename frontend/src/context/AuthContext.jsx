import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("access")) {
      setLoading(false);
      return;
    }
    api.get("/auth/me/")
      .then((response) => setUser(response.data))
      .catch(() => localStorage.removeItem("access"))
      .finally(() => setLoading(false));
  }, []);


  async function login(username, password) {
    const response = await api.post("/auth/login/", { username, password });
    localStorage.setItem("access", response.data.access);
    const me = await api.get("/auth/me/");
    setUser(me.data);
  }

  function logout() {
    localStorage.removeItem("access");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
