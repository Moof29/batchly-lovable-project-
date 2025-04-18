
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDevMode } from "@/contexts/DevModeContext";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  Link2, 
  Unlink, 
  RefreshCw, 
  Settings, 
  Calendar, 
  ClockIcon, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  DatabaseBackup,
  FileText,
  Wallet,
  Package,
  Users
} from "lucide-react";

import { QBOConnectionStatus } from "@/components/integrations/QBOConnectionStatus";
import { QBOSyncStatus } from "@/components/integrations/QBOSyncStatus";
import { QBOSyncSettings } from "@/components/integrations/QBOSyncSettings";
import { QBOSyncLogs } from "@/components/integrations/QBOSyncLogs";
import { QBOMockConnectionModal } from "@/components/integrations/QBOMockConnectionModal";

import { useQBOIntegration } from "@/hooks/useQBOIntegration";

export const QBOIntegrationPage = () => {
  const { user, hasPermission } = useAuth();
  const { isDevMode, devRole } = useDevMode();
  const [showMockModal, setShowMockModal] = useState(false);
  
  const {
    isConnected,
    connectionDetails,
    lastSync,
    syncErrors,
    syncSettings,
    syncInProgress,
    beginOAuthFlow,
    disconnectQBO,
    updateSyncSettings,
    triggerSync,
  } = useQBOIntegration();
  
  // User can only view this page if they're an admin or in dev mode with admin role
  const hasAccess = hasPermission('admin') || (isDevMode && devRole === 'admin');
  
  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only administrators can access QuickBooks Online integration settings.
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link to="/settings">Return to Settings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">QuickBooks Online Integration</h2>
          <p className="text-sm text-muted-foreground">
            Connect and manage your QuickBooks Online account
          </p>
        </div>
        {isDevMode && (
          <Button 
            variant="outline" 
            onClick={() => setShowMockModal(true)}
          >
            Configure Mock QBO
          </Button>
        )}
      </div>
      
      <QBOConnectionStatus 
        isConnected={isConnected} 
        connectionDetails={connectionDetails}
        onConnect={beginOAuthFlow}
        onDisconnect={disconnectQBO}
      />
      
      {isConnected && (
        <Tabs defaultValue="status">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="status">Sync Status</TabsTrigger>
            <TabsTrigger value="settings">Sync Settings</TabsTrigger>
            <TabsTrigger value="logs">Sync Logs</TabsTrigger>
            <TabsTrigger value="troubleshoot">Troubleshooting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Sync Status</CardTitle>
                <CardDescription>Current status of your QuickBooks Online data synchronization</CardDescription>
              </CardHeader>
              <CardContent>
                <QBOSyncStatus 
                  lastSync={lastSync}
                  syncErrors={syncErrors}
                  syncInProgress={syncInProgress}
                  onTriggerSync={triggerSync}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
                <CardDescription>Configure what data is synchronized between systems</CardDescription>
              </CardHeader>
              <CardContent>
                <QBOSyncSettings 
                  settings={syncSettings} 
                  updateSettings={updateSyncSettings}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Sync Logs</CardTitle>
                <CardDescription>History of synchronization activities</CardDescription>
              </CardHeader>
              <CardContent>
                <QBOSyncLogs />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="troubleshoot">
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>Tools to diagnose and fix synchronization issues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Connection Test</h3>
                  <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Test QBO Connection
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Data Reconciliation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Verify Customers
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Verify Inventory
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Verify Invoices
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Verify Payments
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Advanced</h3>
                  <div className="flex flex-col gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <DatabaseBackup className="h-4 w-4" />
                      Reset Sync State
                    </Button>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Unlink className="h-4 w-4" />
                      Disconnect & Purge All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {isDevMode && showMockModal && (
        <QBOMockConnectionModal 
          open={showMockModal}
          onClose={() => setShowMockModal(false)}
        />
      )}
    </div>
  );
};
