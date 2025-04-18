
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  Package, 
  Calendar, 
  ClockIcon, 
  RefreshCw, 
  Users,
  FileText, 
  AlertCircle,
  Wallet
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export interface SyncError {
  id: string;
  entityType: 'customers' | 'items' | 'invoices' | 'payments' | 'bills';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface SyncStatus {
  entityType: string;
  totalItems: number;
  syncedItems: number;
  lastSynced: Date | null;
  status: 'success' | 'error' | 'in_progress' | 'pending';
}

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
  // Mock data for sync statuses - in a real app this would come from props
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Last Full Sync: {lastSync ? new Date(lastSync).toLocaleDateString() : 'Never'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Last Sync Time: {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never'}
            </span>
          </div>
        </div>
        
        <Button 
          onClick={() => onTriggerSync()} 
          disabled={syncInProgress}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${syncInProgress ? 'animate-spin' : ''}`} />
          {syncInProgress ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Data Entities</h3>
        
        <div className="space-y-4">
          {syncStatuses.map((status) => (
            <div key={status.entityType} className="flex items-center gap-4">
              <div className="w-8 flex justify-center">
                {getEntityIcon(status.entityType)}
              </div>
              
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
                onClick={() => onTriggerSync([status.entityType])}
                disabled={syncInProgress || status.status === 'in_progress'}
              >
                Sync {status.status === 'in_progress' && <RefreshCw className="ml-1 h-3 w-3 animate-spin" />}
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {syncErrors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            Sync Errors ({syncErrors.length})
          </h3>
          
          <div className="space-y-2">
            {syncErrors.slice(0, 3).map((error) => (
              <div key={error.id} className="border border-red-200 bg-red-50 rounded-md p-3">
                <div className="flex items-start">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{error.entityType}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(error.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{error.message}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {syncErrors.length > 3 && (
              <Button variant="link" className="text-sm">
                View all {syncErrors.length} errors
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
