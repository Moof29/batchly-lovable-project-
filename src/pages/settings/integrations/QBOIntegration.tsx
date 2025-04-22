import React, { useState, useEffect } from 'react';
import { QBOConnectionStatus } from '@/components/integrations/QBOConnectionStatus';
import { QBOSyncStatus } from '@/components/integrations/QBOSyncStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQBOIntegration } from '@/hooks/useQBOIntegration';
import { useQBOSync } from '@/hooks/useQBOSync';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Settings, List, Activity, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QBOSyncLogs } from '@/components/integrations/QBOSyncLogs';
import { QBOSyncSettings } from '@/components/integrations/QBOSyncSettings';
import { QBOMockConnectionModal } from '@/components/integrations/QBOMockConnectionModal';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useDevMode } from '@/contexts/DevModeContext';
import QBOIntegrationEntitiesAccordion from './components/QBOIntegrationEntitiesAccordion';
import QBOIntegrationErrorsList from './components/QBOIntegrationErrorsList';
import QBOIntegrationSyncOverview from './components/QBOIntegrationSyncOverview';
import QBOIntegrationSyncHistory from './components/QBOIntegrationSyncHistory';

export const QBOIntegrationPage = () => {
  const { user } = useAuth();
  const { isDevMode } = useDevMode();
  const { isConnected, connectionDetails, syncSettings, beginOAuthFlow, disconnectQBO, updateSyncSettings } = useQBOIntegration();
  
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  
  const organizationId = user?.organization_id || (isDevMode ? "00000000-0000-0000-0000-000000000000" : undefined);
  
  const {
    connection,
    isLoadingConnection,
    entityConfigs,
    isLoadingEntityConfigs,
    pendingOperations,
    isLoadingPendingOperations,
    syncHistory,
    isLoadingSyncHistory,
    errors,
    isLoadingErrors,
    syncEntities,
    isSyncing,
    processOperations,
    isProcessing,
    resolveError,
    updateEntityConfig
  } = useQBOSync(organizationId);

  useEffect(() => {
    if (pendingOperations.length > 0 && !isProcessing) {
      processOperations();
    }
  }, [pendingOperations, isProcessing, processOperations]);
  
  const handleConnect = () => {
    if (isDevMode) {
      setIsMockModalOpen(true);
    } else {
      beginOAuthFlow();
    }
  };

  const entityTypes = [
    { type: 'customer_profile', label: 'Customers', priority: 1 },
    { type: 'vendor_profile', label: 'Vendors', priority: 1 },
    { type: 'item_record', label: 'Items/Products', priority: 2 },
    { type: 'invoice_record', label: 'Invoices', priority: 3 },
    { type: 'bill_record', label: 'Bills', priority: 3 },
    { type: 'payment_receipt', label: 'Payments', priority: 4 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">QuickBooks Online Integration</h1>
          <p className="text-muted-foreground">Connect and sync data with your QuickBooks Online account</p>
        </div>
      </div>
      
      <QBOConnectionStatus 
        isConnected={isConnected} 
        connectionDetails={connectionDetails} 
        onConnect={handleConnect}
        onDisconnect={disconnectQBO}
      />
      
      {isConnected && (
        <Tabs defaultValue="sync" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sync" className="flex gap-2 items-center">
              <Activity className="h-4 w-4" />
              Sync Status
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex gap-2 items-center">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="entities" className="flex gap-2 items-center">
              <List className="h-4 w-4" />
              Entities
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex gap-2 items-center">
              <AlertCircle className="h-4 w-4" />
              Errors {errors.length > 0 && (
                <Badge variant="destructive" className="ml-1">{errors.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sync" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QBOIntegrationSyncOverview
                pendingOperations={pendingOperations}
                isProcessing={isProcessing}
                processOperations={processOperations}
              />
              <QBOIntegrationSyncHistory
                syncHistory={syncHistory}
                isLoading={isLoadingSyncHistory}
              />
            </div>
            <QBOSyncStatus
              lastSync={connection?.last_sync_at ? new Date(connection.last_sync_at) : null}
              syncErrors={errors.map(err => ({
                id: err.id,
                entityType: err.error_category === 'data' ? 'items' : 'customers',
                message: err.error_message,
                timestamp: new Date(err.last_occurred_at),
                resolved: err.is_resolved
              }))}
              syncInProgress={isProcessing || isSyncing}
              onTriggerSync={async (entityTypes) => {
                if (!entityTypes || entityTypes.length === 0) {
                  toast({
                    title: "Full sync initiated",
                    description: "Starting sync for all entities",
                  });
                } else {
                  toast({
                    title: "Entity sync initiated",
                    description: `Starting sync for ${entityTypes.join(', ')}`,
                  });
                }
              }}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
                <CardDescription>Configure how data is synchronized with QuickBooks Online</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <QBOSyncSettings
                  settings={syncSettings}
                  updateSettings={updateSyncSettings}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="entities">
            <QBOIntegrationEntitiesAccordion
              entityTypes={entityTypes}
              entityConfigs={entityConfigs}
              updateEntityConfig={updateEntityConfig}
              isLoading={isLoadingEntityConfigs}
            />
          </TabsContent>
          
          <TabsContent value="errors">
            <QBOIntegrationErrorsList
              errors={errors}
              resolveError={resolveError}
              isLoading={isLoadingErrors}
            />
          </TabsContent>
        </Tabs>
      )}
      
      <QBOMockConnectionModal
        open={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
      />
    </div>
  );
};
