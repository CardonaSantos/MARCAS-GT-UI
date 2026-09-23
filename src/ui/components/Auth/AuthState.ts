import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface AuthState {
  userRol: string | null;
  isLoading: boolean;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userRol: null,
  isLoading: true,
  checkAuth: () => {
    const token = localStorage.getItem("authTokenPos");
    if (token) {
      try {
        const decodedToken = jwtDecode<{ rol: string }>(token);
        set({ userRol: decodedToken.rol, isLoading: false });
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("authTokenPos");
        set({ userRol: null, isLoading: false });
      }
    } else {
      set({ userRol: null, isLoading: false });
    }
  },
  logout: () => {
    localStorage.removeItem("authTokenPos");
    set({ userRol: null, isLoading: false });
    window.location.reload();
  },
}));
