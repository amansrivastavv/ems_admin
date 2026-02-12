import { User } from "@/types/user";

const TOKEN_KEY = "ems_token";
const USER_KEY = "ems_user";

export const setAuthData = (token: string, user: User) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAuthData = () => {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);
  return {
    token,
    user: user ? (JSON.parse(user) as User) : null,
  };
};

export const clearAuthData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  const { token } = getAuthData();
  return !!token;
};
