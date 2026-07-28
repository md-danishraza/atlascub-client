"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-md font-primary">Customers</h1>
        <p className="text-muted-foreground">Manage customer accounts and information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No customers yet"
            description="Customer list will appear here"
          />
        </CardContent>
      </Card>
    </div>
  );
}