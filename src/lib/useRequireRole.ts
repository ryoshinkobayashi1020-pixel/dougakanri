"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "./store";
import { Role } from "./types";

export function useRequireRole(role: Role) {
  const { currentUser, ready } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!currentUser) {
      router.replace("/");
      return;
    }
    if (currentUser.role !== role) {
      router.replace(currentUser.role === "shooter" ? "/shooter" : "/editor");
    }
  }, [ready, currentUser, role, router]);

  return { currentUser, ready };
}
