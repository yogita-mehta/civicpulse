import api from "./axios";

// 🔐 LOGIN
export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", payload);
  return res.data; // { token }
};

// 📝 REGISTER
export const registerUser = async (payload: {
  fullName: string;
  email:string;
  password: string;
  phone: string;
  address?: string;
  role: "CITIZEN" | "DEPARTMENT" | "ADMIN";
}) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};
