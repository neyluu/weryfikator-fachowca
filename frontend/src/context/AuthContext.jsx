import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    const payload = parseJwt(token);
    if (!payload) {
      localStorage.removeItem("token");
      setLoading(false);
      return;
    }
    setUser(payload);
    setLoading(false);
  }, []);
  const saveToken = (token) => {
    localStorage.setItem("token", token);
    const payload = parseJwt(token);
    if (!payload) {
      localStorage.removeItem("token");
      return false;
    }
    setUser(payload);
    return true;
  };
  const login = async (email, password) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    const success = saveToken(data.token);
    if (!success) throw new Error("Invalid token");
    navigate("/dashboard");
  };
  const register = async (fullName, email, password, role) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, role }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");
    const success = saveToken(data.token);
    if (!success) throw new Error("Invalid token");
    navigate("/dashboard");
  };
  const updateAccount = async (payload) => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/me/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Update failed");
    const success = saveToken(data.token);
    if (!success) throw new Error("Invalid token");
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth/login");
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateAccount,
        logout,
        saveToken,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
