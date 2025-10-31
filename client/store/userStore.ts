import { create } from "zustand";

interface User {
  name: string;
  email: string;
  // add more fields as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  initializeAuth: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken && !!storedUser,

    initializeAuth: () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");

      set({
        token: token || null,
        user: user ? JSON.parse(user) : null,
        isAuthenticated: !!token && !!user,
      });
    },

    login: (user, token) => {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});


export default useAuthStore;