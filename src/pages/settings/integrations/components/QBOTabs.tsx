
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Activity, Settings, List, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { QBOMockConnectionModal } from "@/components/integrations/QBOMockConnectionModal";
import { QBOIntegrationSyncTab } from "./QBOIntegrationSyncTab";
import { QBOIntegrationSettingsTab } from "./QBOIntegrationSettingsTab";
import { QBOIntegrationEntitiesTab } from "./QBOIntegrationEntitiesTab";
import { QBOIntegrationErrorsTab } from "./QBOIntegrationErrorsTab";
import QBOIntegrationReconciliationTab from "./QBOIntegrationReconciliationTab";

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
  isSyncing
}: any) => {

  return (
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
          Errors {errors.length > 0 &&
            <Badge variant="destructive" className="ml-1">{errors.length}</Badge>
          }
        </TabsTrigger>
        <TabsTrigger value="reconciliation" className="flex gap-2 items-center">
          <Settings className="h-4 w-4" />
          Reconciliation
        </TabsTrigger>
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
      <TabsContent value="settings">
        <QBOIntegrationSettingsTab
          syncSettings={syncSettings}
          updateSyncSettings={updateSyncSettings}
        />
      </TabsContent>
      <TabsContent value="entities">
        <QBOIntegrationEntitiesTab
          entityTypes={entityTypes}
          entityConfigs={entityConfigs}
          updateEntityConfig={updateEntityConfig}
          isLoading={isLoadingEntityConfigs}
        />
      </TabsContent>
      <TabsContent value="errors">
        <QBOIntegrationErrorsTab
          errors={errors}
          resolveError={resolveError}
          isLoading={isLoadingErrors}
        />
      </TabsContent>
      <TabsContent value="reconciliation">
        <QBOIntegrationReconciliationTab />
      </TabsContent>
    </Tabs>
  );
};
