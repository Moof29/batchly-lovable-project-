
// QBO Integration Types

export interface SyncError {
  id: string;
  entityType: string;
  message: string;
  timestamp: Date;
  resolved?: boolean;
}

export interface SyncStatus {
  entityType: string;
  totalItems: number;
  syncedItems: number;
  lastSynced: Date | null;
  status: 'success' | 'error' | 'in_progress' | 'pending';
}

export interface SyncSettings {
  entities: {
    customers: boolean;
    items: boolean;
    invoices: boolean;
    payments: boolean;
    bills: boolean;
  };
  frequency: 'hourly' | 'daily' | 'weekly';
  scheduleTime: string;
  autoSyncNewRecords: boolean;
  conflictResolutionStrategy: 'newest_wins' | 'qbo_wins' | 'batchly_wins' | 'manual';
}
