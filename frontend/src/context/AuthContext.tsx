import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; // fixed import
import { loginUser, registerUser } from "../api/authApi";

interface JwtPayload {
  sub: string;
  exp: number;
}
interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'CITIZEN' | 'DEPARTMENT' | 'ADMIN';
} 

interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address?: string;
  role: "CITIZEN" | "DEPARTMENT" | "ADMIN";
}

interface LoginPayload {
  email: string;
  password: string;
  role: "CITIZEN" | "DEPARTMENT" | "ADMIN";
}

interface AuthContextType {
  user:User|null;
  email: string | null;
  token: string | null;
  loading: boolean;
  signIn: (data: LoginPayload) => Promise<{ error: any | null }>;
  signUp: (data: RegisterPayload) => Promise<{ error: any | null }>;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      const decoded: JwtPayload = jwtDecode(savedToken);
      if (decoded.exp * 1000 > Date.now()) {
        setToken(savedToken);
        setEmail(decoded.sub);
        console.log("Decoded JWT on reload:", decoded); // ✅ add this
      } else {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (jwtToken: string) => {
  const decoded: any = jwtDecode(jwtToken); // adjust if your JWT has role/full_name
  localStorage.setItem("token", jwtToken);
  setToken(jwtToken);
  setUser({
  id: decoded.id,          // add this
  email: decoded.sub,
  full_name: decoded.full_name || decoded.sub,
  role: decoded.role,
});
};


  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setEmail(null);
  };

  // ---------------- SIGN IN ----------------
  const signIn = async (data: LoginPayload) => {
    try {
      // Pass role to backend
      const res = await loginUser(data); 
      login(res.token); // reuse existing logic
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data || error.message };
    }
  };

  // ---------------- SIGN UP ----------------
  const signUp = async (data: RegisterPayload) => {
    try {
      await registerUser(data);
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data || error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        email,
        loading,
        signIn,
        signUp,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
