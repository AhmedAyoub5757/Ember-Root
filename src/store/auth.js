import { create } from "zustand";
import { api } from "../lib/api";

export const useAuth = create((set) => ({
  user: null,
  status: "loading", // loading | ready

  load: async () => {
    try {
      const { user } = await api("/auth/me");
      set({ user, status: "ready" });
    } catch {
      set({ user: null, status: "ready" });
    }
  },
  setUser: (user) => set({ user, status: "ready" }),
  signOut: async () => {
    try {
      await api("/auth/logout", { method: "POST", body: {} });
    } finally {
      set({ user: null });
    }
  },
}));