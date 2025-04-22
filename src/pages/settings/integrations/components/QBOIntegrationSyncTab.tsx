
import React from "react";
import QBOIntegrationSyncOverview from "./QBOIntegrationSyncOverview";
import QBOIntegrationSyncHistory from "./QBOIntegrationSyncHistory";
import { QBOSyncStatus } from "@/components/integrations/QBOSyncStatus";
import { toast } from "@/hooks/use-toast";

export const QBOIntegrationSyncTab = ({
  pendingOperations,
  isProcessing,
  processOperations,
  syncHistory,
  isLoadingSyncHistory,
  connection,
  errors,
  isProcessingOrSyncing,
  isSyncing
}: any) => (
  <div className="space-y-4">
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
      syncErrors={errors.map((err: any) => ({
        id: err.id,
        entityType: err.error_category === 'data' ? 'items' : 'customers',
        message: err.error_message,
        timestamp: new Date(err.last_occurred_at),
        resolved: err.is_resolved
      }))}
      syncInProgress={isProcessingOrSyncing}
      onTriggerSync={async (entityTypes) => {
        if (!entityTypes || entityTypes.length === 0) {
          toast({
            title: "Full sync initiated",
            description: "Starting sync for all entities"
          });
        } else {
          toast({
            title: "Entity sync initiated",
            description: `Starting sync for ${entityTypes.join(', ')}`
          });
        }
      }}
    />
  </div>
);
