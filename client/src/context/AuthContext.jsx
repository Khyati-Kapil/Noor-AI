import { createContext, useContext, useState } from "react";
import safeStorage from "../utils/safeStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(() => {
    const storedUser = safeStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [loading] = useState(false);

  const login = (userData, token) => {
    safeStorage.setItem("authToken", token);
    safeStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    safeStorage.removeItem("authToken");
    safeStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

