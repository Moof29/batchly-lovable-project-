
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedMonitoringDashboard } from "@/components/monitoring/UnifiedMonitoringDashboard";
import { useAuth } from '@/contexts/AuthContext';
import { PermissionGate } from '@/components/PermissionGate';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      
      <PermissionGate
        resource="reports"
        action="read"
        fallback={<StandardDashboard />}
      >
        <UnifiedMonitoringDashboard />
      </PermissionGate>
    </div>
  );
};

// Fallback dashboard for users without monitoring permissions
const StandardDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your latest invoice activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View your recent invoices in the Sales section.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Your latest payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View your recent payments in the Payments section.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">⭐ Create new invoice</p>
              <p className="text-sm">⭐ Record payment</p>
              <p className="text-sm">⭐ Add new customer</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
