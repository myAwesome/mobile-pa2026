import { create } from 'zustand';
import { isLoggedIn, logout as apiLogout } from '../api/client';

interface AuthState {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  setAuthenticated: (value) => set({ authenticated: value }),
  checkAuth: async () => {
    const ok = await isLoggedIn();
    set({ authenticated: ok });
    return ok;
  },
  logout: async () => {
    await apiLogout();
    set({ authenticated: false });
  },
}));
