"use client";

import { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6">
        <SlugBreadcrumb />
      </div>
      
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-64 lg:shrink-0">
          <AccountSidebar />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}