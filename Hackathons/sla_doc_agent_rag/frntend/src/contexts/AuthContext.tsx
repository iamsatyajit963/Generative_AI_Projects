import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("user")
  );
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("user") || null
  );

  useEffect(() => {
    // Keep localStorage and state in sync
    if (isAuthenticated && user) {
      localStorage.setItem("user", user);
    } else {
      localStorage.removeItem("user");
    }
  }, [isAuthenticated, user]);

  const login = (email: string, password: string) => {
    if (email === "test@admin.com" && password === "test@123") {
      setIsAuthenticated(true);
      setUser(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
