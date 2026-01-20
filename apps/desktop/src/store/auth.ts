import { create } from "zustand";
import type { User } from "../models";

interface AuthState {
  token: string | null;
  user: User | null;
  device: any | null;
  login: (token: string, user: User, device?: any) => void;
  logout: () => void;
  switchServer: (url: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  device: null,
  login: (token, user, device) => set({ token, user, device }),
  logout: () => {
    const url = localStorage.getItem("serverAddress") || "http://localhost:3000";
    localStorage.removeItem(`token_${url}`);
    localStorage.removeItem(`user_${url}`);
    localStorage.removeItem(`device_${url}`);
    set({ token: null, user: null, device: null });
  },
  switchServer: (url: string) => {
    localStorage.setItem("serverAddress", url);
    const token = localStorage.getItem(`token_${url}`);
    const user = localStorage.getItem(`user_${url}`);
    const device = localStorage.getItem(`device_${url}`);
    
    set({ 
      token: token || null, 
      user: user ? JSON.parse(user) : null,
      device: device ? JSON.parse(device) : null
    });
  },
}));
