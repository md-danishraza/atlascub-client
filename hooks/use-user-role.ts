"use client";

import { useUser } from "@clerk/nextjs";

export function useUserRole() {
  const { user, isLoaded, isSignedIn } = useUser();

  const role = (user?.publicMetadata?.role as string) || "customer";
  const isAdmin = role === "admin" || role === "super_admin";

  return {
    role,
    isAdmin,
    isLoaded,
    isSignedIn,
    user,
  };
}
