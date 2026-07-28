import { ReactNode } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata = {
  title: "Admin Dashboard | Atlascub",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="md:pl-64">
          {/* <AdminHeader /> */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}