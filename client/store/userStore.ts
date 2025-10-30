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

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  initializeAuth: () => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      set({
        token: storedToken,
        user: JSON.parse(storedUser),
        isAuthenticated: true,
      });
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  login: (user, token) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
