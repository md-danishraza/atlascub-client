"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Receipt,
  MapPin,
  Settings,
  LogOut,
  LayoutDashboard,
  Heart,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const isAdmin = user?.publicMetadata?.role === "admin";

  const getInitials = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!isSignedIn) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none">
          <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-transparent transition-all hover:ring-primary/20">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account" className="flex cursor-pointer items-center gap-2">
              <User className="h-4 w-4" />
              <span>My Account</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/account/orders" className="flex cursor-pointer items-center gap-2">
              <Package className="h-4 w-4" />
              <span>My Orders</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/account/transactions" className="flex cursor-pointer items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span>Transactions</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/wishlist" className="flex cursor-pointer items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/cart" className="flex cursor-pointer items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Cart</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/account/address" className="flex cursor-pointer items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Saved Addresses</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>
          
          {/* <DropdownMenuItem asChild>
            <Link href="/account/settings" className="flex cursor-pointer items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex cursor-pointer items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin Dashboard</span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}