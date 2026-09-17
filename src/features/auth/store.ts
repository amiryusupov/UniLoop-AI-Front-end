"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { UserRole } from "@/features/auth/types";

type AuthState = {
  role: UserRole | null;
  hydrated: boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      hydrated: false,
      loginAsRole: (role) => set({ role }),
      logout: () => set({ role: null }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "uniloop-demo-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ role: state.role }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
