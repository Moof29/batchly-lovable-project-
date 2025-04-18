
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { toast } from '@/hooks/use-toast';
import { SyncError, SyncStatus } from '@/components/integrations/QBOSyncStatus';
import { SyncSettings } from '@/components/integrations/QBOSyncSettings';

interface ConnectionDetails {
  companyName: string;
  companyId: string;
  connectedAt: Date;
  expiresAt: Date;
}

export const useQBOIntegration = () => {
  const { user } = useAuth();
  const { isDevMode } = useDevMode();
  
  // State for QBO integration
  const [isConnected, setIsConnected] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncErrors, setSyncErrors] = useState<SyncError[]>([]);
  const [syncInProgress, setSyncInProgress] = useState(false);
  
  // Default sync settings
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    entities: {
      customers: true,
      items: true,
      invoices: true,
      payments: true,
      bills: true
    },
    frequency: 'daily',
    scheduleTime: '02:00',
    autoSyncNewRecords: true,
    conflictResolutionStrategy: 'newest_wins'
  });

  // Load QBO integration state from local storage or API in a real app
  useEffect(() => {
    if (isDevMode) {
      // In dev mode, check for mock configuration
      const mockConfig = localStorage.getItem('batchly-mock-qbo');
      if (mockConfig) {
        try {
          const config = JSON.parse(mockConfig);
          setIsConnected(config.enabled || false);
          if (config.enabled) {
            setConnectionDetails({
              companyName: config.companyName || 'Mock Company',
              companyId: config.companyId || '123456789',
              connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            });
            
            // Set mock last sync
            setLastSync(new Date(Date.now() - 24 * 60 * 60 * 1000)); // 1 day ago
            
            // Set mock errors
            setSyncErrors([
              {
                id: 'err-1',
                entityType: 'invoices',
                message: 'Invoice #INV-2023-0547 failed: Invalid customer reference',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                resolved: false
              },
              {
                id: 'err-2',
                entityType: 'items',
                message: 'Item SKU-7744 failed to sync: Duplicate SKU in QuickBooks',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                resolved: false
              }
            ]);
          } else {
            setConnectionDetails(null);
            setLastSync(null);
            setSyncErrors([]);
          }
        } catch (e) {
          console.error('Error parsing mock QBO config', e);
        }
      }
    } else {
      // In production, this would fetch the real connection state from your API/database
      // For now, we just show disconnected state
      setIsConnected(false);
      setConnectionDetails(null);
      setLastSync(null);
      setSyncErrors([]);
    }
  }, [isDevMode]);

  // Function to begin OAuth flow
  const beginOAuthFlow = () => {
    if (isDevMode) {
      // In dev mode, simulate connection
      setIsConnected(true);
      setConnectionDetails({
        companyName: 'Acme Test Company',
        companyId: '1234567890',
        connectedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });
      
      toast({
        title: 'Mock QBO Connected',
        description: 'Successfully connected to mock QuickBooks Online account',
      });
    } else {
      // In production, this would redirect to QuickBooks OAuth
      toast({
        title: 'QBO OAuth Flow',
        description: 'This would redirect to QuickBooks OAuth in production',
      });
    }
  };

  // Function to disconnect QBO
  const disconnectQBO = () => {
    if (window.confirm('Are you sure you want to disconnect from QuickBooks Online? This will stop all data synchronization.')) {
      setIsConnected(false);
      setConnectionDetails(null);
      
      toast({
        title: 'QBO Disconnected',
        description: 'Successfully disconnected from QuickBooks Online',
        variant: 'destructive'
      });
    }
  };

  // Function to update sync settings
  const updateSyncSettings = (newSettings: SyncSettings) => {
    setSyncSettings(newSettings);
  };

  // Function to trigger sync
  const triggerSync = (entityTypes?: string[]) => {
    if (syncInProgress) {
      toast({
        title: 'Sync in progress',
        description: 'Please wait for the current sync to complete',
        variant: 'default'
      });
      return;
    }
    
    const entitiesMessage = entityTypes && entityTypes.length > 0 
      ? `Syncing ${entityTypes.join(', ')}` 
      : 'Syncing all entities';
    
    toast({
      title: 'Sync Started',
      description: entitiesMessage,
    });
    
    setSyncInProgress(true);
    
    // Simulate sync process
    setTimeout(() => {
      setSyncInProgress(false);
      setLastSync(new Date());
      
      toast({
        title: 'Sync Completed',
        description: 'Data synchronization completed successfully',
      });
    }, 3000);
  };

  return {
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
  };
};
