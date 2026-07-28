"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Receipt,
  MapPin,
  Settings,
  Heart,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  {
    name: "Profile",
    href: "/account",
    icon: User,
  },
  {
    name: "Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    name: "Transactions",
    href: "/account/transactions",
    icon: Receipt,
  },
  {
    name: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: ShoppingBag,
  },
  {
    name: "Addresses",
    href: "/account/address",
    icon: MapPin,
  },
  {
    name: "Settings",
    href: "/account/settings",
    icon: Settings,
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const getInitials = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="sticky top-24 space-y-6">
      {/* User Info Card */}
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <Avatar className="mx-auto h-16 w-16">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-3 font-medium">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-sm text-muted-foreground">
          {user?.emailAddresses[0]?.emailAddress}
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
              {isActive && (
                <motion.div
                  layoutId="active-account-nav"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground"
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="my-2 border-t border-border" />
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}