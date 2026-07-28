"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAdminAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    } else if (isLoaded && isSignedIn && !isAdmin) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, isAdmin, router]);

  return { isAdmin, isLoaded, isSignedIn };
}
