import React from 'react';
import { SyncError } from "@/components/integrations/QBOSyncStatus";
import { SyncStatusOverview } from "./SyncStatusOverview";
import { EntitySyncProgress, SyncStatus } from "./EntitySyncProgress";
import { SyncErrorsList } from "./SyncErrorsList";

interface QBOSyncStatusProps {
  lastSync: Date | null;
  syncErrors: SyncError[];
  syncInProgress: boolean;
  onTriggerSync: (entityTypes?: string[]) => void;
}

export const QBOSyncStatus: React.FC<QBOSyncStatusProps> = ({
  lastSync,
  syncErrors,
  syncInProgress,
  onTriggerSync,
}) => {
  const syncStatuses: SyncStatus[] = [
    {
      entityType: 'customers',
      totalItems: 255,
      syncedItems: 255,
      lastSynced: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'success'
    },
    {
      entityType: 'items',
      totalItems: 890,
      syncedItems: 890,
      lastSynced: new Date(Date.now() - 7200000), // 2 hours ago
      status: 'success'
    },
    {
      entityType: 'invoices',
      totalItems: 452,
      syncedItems: 445,
      lastSynced: new Date(Date.now() - 86400000), // 1 day ago
      status: 'error'
    },
    {
      entityType: 'payments',
      totalItems: 320,
      syncedItems: 320,
      lastSynced: new Date(Date.now() - 43200000), // 12 hours ago
      status: 'success'
    },
    {
      entityType: 'bills',
      totalItems: 110,
      syncedItems: 88,
      lastSynced: null,
      status: 'in_progress'
    }
  ];

  return (
    <div className="space-y-6">
      <SyncStatusOverview
        lastSync={lastSync}
        syncInProgress={syncInProgress}
        onTriggerSync={() => onTriggerSync()}
      />
      <EntitySyncProgress
        syncStatuses={syncStatuses}
        syncInProgress={syncInProgress}
        onTriggerEntitySync={entityType => onTriggerSync([entityType])}
      />
      <SyncErrorsList syncErrors={syncErrors} />
    </div>
  );
};

export type { SyncError };
