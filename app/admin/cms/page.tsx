"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

export default function AdminCMSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-md font-primary">Content Management</h1>
        <p className="text-muted-foreground">Manage banners, hero sections, and homepage content</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hero Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No banners"
              description="Add banners to showcase on your homepage"
              action={{
                label: "Add Banner",
                href: "/admin/cms/banners/new",
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No collections"
              description="Manage featured collections"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}