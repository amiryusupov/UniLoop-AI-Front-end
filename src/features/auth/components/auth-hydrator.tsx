"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/store";

export function AuthHydrator() {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
