
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Package, FileText, Wallet, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface SyncStatus {
  entityType: string;
  totalItems: number;
  syncedItems: number;
  lastSynced: Date | null;
  status: 'success' | 'error' | 'in_progress' | 'pending';
}

interface EntitySyncProgressProps {
  syncStatuses: SyncStatus[];
  syncInProgress: boolean;
  onTriggerEntitySync: (entityType: string) => void;
}

const getEntityIcon = (entityType: string) => {
  switch(entityType) {
    case 'customers': return <Users className="h-4 w-4" />;
    case 'items': return <Package className="h-4 w-4" />;
    case 'invoices': return <FileText className="h-4 w-4" />;
    case 'payments': return <Wallet className="h-4 w-4" />;
    case 'bills': return <FileText className="h-4 w-4" />;
    default: return <Package className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'success':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Synced</Badge>;
    case 'error':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Error</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Syncing</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
};

export const EntitySyncProgress: React.FC<EntitySyncProgressProps> = ({
  syncStatuses,
  syncInProgress,
  onTriggerEntitySync,
}) => (
  <div className="space-y-4">
    <h3 className="text-sm font-medium">Data Entities</h3>
    <div className="space-y-4">
      {syncStatuses.map((status) => (
        <div key={status.entityType} className="flex items-center gap-4">
          <div className="w-8 flex justify-center">{getEntityIcon(status.entityType)}</div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="capitalize font-medium">{status.entityType}</span>
              {getStatusBadge(status.status)}
            </div>
            <div className="flex items-center gap-2">
              <Progress
                value={(status.syncedItems / status.totalItems) * 100}
                className="h-2"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {status.syncedItems}/{status.totalItems}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
            onClick={() => onTriggerEntitySync(status.entityType)}
            disabled={syncInProgress || status.status === 'in_progress'}
            aria-label={`Sync ${status.entityType}`}
          >
            Sync {status.status === 'in_progress' && <RefreshCw className="ml-1 h-3 w-3 animate-spin" />}
          </Button>
        </div>
      ))}
    </div>
  </div>
);
