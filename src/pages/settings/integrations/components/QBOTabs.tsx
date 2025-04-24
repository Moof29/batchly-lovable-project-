
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QBOIntegrationSyncTab } from './QBOIntegrationSyncTab';
import { QBOIntegrationSettingsTab } from './QBOIntegrationSettingsTab';
import { QBOIntegrationEntitiesTab } from './QBOIntegrationEntitiesTab';
import { QBOIntegrationErrorsTab } from './QBOIntegrationErrorsTab';
import { QBOIntegrationReconciliationTab } from './QBOIntegrationReconciliationTab';
import { UnifiedMonitoringDashboard } from '@/components/monitoring/UnifiedMonitoringDashboard';
import { PermissionGate } from '@/components/PermissionGate';

export const QBOTabs = ({
  connection,
  pendingOperations,
  isProcessing,
  processOperations,
  syncHistory,
  isLoadingSyncHistory,
  errors,
  isLoadingErrors,
  entityTypes,
  entityConfigs,
  updateEntityConfig,
  isLoadingEntityConfigs,
  syncSettings,
  updateSyncSettings,
  resolveError,
  isProcessingOrSyncing,
  isSyncing,
}) => {
  const [activeTab, setActiveTab] = React.useState("sync");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <TabsTrigger value="sync">Sync</TabsTrigger>
        <TabsTrigger value="entities">Entities</TabsTrigger>
        <TabsTrigger value="errors">Errors</TabsTrigger>
        <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="sync">
        <QBOIntegrationSyncTab
          pendingOperations={pendingOperations}
          isProcessing={isProcessing}
          processOperations={processOperations}
          syncHistory={syncHistory}
          isLoadingSyncHistory={isLoadingSyncHistory}
          connection={connection}
          errors={errors}
          isProcessingOrSyncing={isProcessingOrSyncing}
          isSyncing={isSyncing}
        />
      </TabsContent>
      <TabsContent value="entities">
        <QBOIntegrationEntitiesTab
          entityTypes={entityTypes}
          entityConfigs={entityConfigs}
          updateEntityConfig={updateEntityConfig}
          isLoadingEntityConfigs={isLoadingEntityConfigs}
          isProcessingOrSyncing={isProcessingOrSyncing}
        />
      </TabsContent>
      <TabsContent value="errors">
        <QBOIntegrationErrorsTab
          errors={errors}
          isLoadingErrors={isLoadingErrors}
          resolveError={resolveError}
        />
      </TabsContent>
      <TabsContent value="reconciliation">
        <QBOIntegrationReconciliationTab />
      </TabsContent>
      <TabsContent value="settings">
        <QBOIntegrationSettingsTab
          syncSettings={syncSettings}
          updateSyncSettings={updateSyncSettings}
        />
      </TabsContent>
      
      {/* Unified Monitoring Section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Unified System Monitoring</h3>
        </div>
        
        <PermissionGate resource="reports" action="read">
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="mb-4 text-sm text-muted-foreground">
              View unified monitoring of both QBO integration and Customer Portal activity on the main Dashboard page.
            </p>
            {/* Include the latest monitoring data here */}
          </div>
        </PermissionGate>
      </div>
    </Tabs>
  );
};
