"use client";

import { useUser, UserProfile } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Mail, Calendar, Shield, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AccountProfilePage() {
  const { user } = useUser();

  const getInitials = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Recently";

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-6"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings, security, and personal preferences.
        </p>
      </motion.div>

      {/* User Info Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">@{user?.username || "user"}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="text-sm font-medium">{memberSince}</p>
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Account Type</p>
                  <p className="text-sm font-medium text-primary">Administrator</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clerk UserProfile Wrapper */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Account Settings</h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <UserProfile 
            appearance={{
              variables: {
                borderRadius: '0.5rem',
                colorPrimary: 'hsl(var(--primary))',
              },
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-none rounded-none w-full",
                navbar: "hidden md:flex", // Hide sidebar on mobile for better flow
                pageScrollBox: "p-0",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}