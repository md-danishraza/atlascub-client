"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function AuthStatus() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();
  const [token, setToken] = useState<string>("");
  const [tokenError, setTokenError] = useState<string>("");

  useEffect(() => {
    async function getTokenValue() {
      if (isLoaded && isSignedIn) {
        try {
          const t = await getToken();
          setToken(t || "No token received");
        } catch (err) {
          setTokenError(String(err));
        }
      }
    }
    getTokenValue();
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) return null;
  if (!isSignedIn) return null;

  // console.log(token)

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md rounded-lg bg-black/90 p-3 text-xs text-white">
      <div className="font-bold mb-2">🔐 Auth Debug</div>
      <div>✅ Signed In: {String(isSignedIn)}</div>
      <div>👤 User ID: {userId?.substring(0, 20)}...</div>
      <div>👑 Admin Role: {String(isAdmin)}</div>
      <div>🔑 Token: {token ? `${token.substring(0, 40)}...` : "No token"}</div>
      {tokenError && <div className="text-red-400">❌ Error: {tokenError}</div>}
      <div className="text-xs text-gray-400 mt-1 break-all">
        Raw role: {JSON.stringify(user?.publicMetadata)}
      </div>
    </div>
  );
}