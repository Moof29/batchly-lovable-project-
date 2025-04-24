
import React, { useState, useEffect } from 'react';
import { QBOConnectionStatus } from '@/components/integrations/QBOConnectionStatus';
import { useQBOIntegration } from '@/hooks/useQBOIntegration';
import { useQBOSync } from '@/hooks/useQBOSync';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { QBOMockConnectionModal } from '@/components/integrations/QBOMockConnectionModal';
import { QBOHeader } from './components/QBOHeader';
import { QBOTabs } from './components/QBOTabs';
import { ServiceFactory } from '@/services/ServiceFactory';
import { MetricsCollector } from '@/utils/audit/MetricsCollector';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from '@/hooks/use-toast';

export const QBOIntegrationPage = () => {
  const { user } = useAuth();
  const { isDevMode } = useDevMode();
  const { 
    isConnected, 
    connectionDetails, 
    syncSettings, 
    beginOAuthFlow, 
    disconnectQBO, 
    updateSyncSettings, 
    refreshQBOToken, 
    tokenExpiresAt, 
    isRefreshingToken 
  } = useQBOIntegration();

  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { checkPermission } = usePermissions();

  const organizationId = user?.organization_id || (isDevMode ? "00000000-0000-0000-0000-000000000000" : undefined);

  // Initialize services when component mounts
  useEffect(() => {
    if (organizationId && !isInitialized) {
      const initServices = async () => {
        try {
          await ServiceFactory.initialize(organizationId);
          setIsInitialized(true);
          
          // Record metric for page view
          MetricsCollector.record({
            category: 'system',
            operation: 'read',
            entity_type: 'page',
            success: true,
            metadata: { page: 'qbo_integration' }
          });
        } catch (error) {
          console.error('Failed to initialize services:', error);
          toast({
            title: 'Initialization Error',
            description: 'Failed to initialize integration services.',
            variant: 'destructive'
          });
        }
      };
      
      initServices();
      
      // Clean up on unmount
      return () => {
        ServiceFactory.cleanup();
      };
    }
  }, [organizationId]);

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

  // Auto-process pending operations if user has permissions
  useEffect(() => {
    const autoProcess = async () => {
      if (
        pendingOperations.length > 0 && 
        !isProcessing && 
        isConnected && 
        isInitialized
      ) {
        const hasPermission = await checkPermission('integrations', 'update');
        if (hasPermission) {
          processOperations();
        }
      }
    };
    
    autoProcess();
  }, [pendingOperations, isProcessing, isConnected, isInitialized, checkPermission, processOperations]);

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
      <QBOHeader />
      <QBOConnectionStatus
        isConnected={isConnected}
        connectionDetails={connectionDetails}
        onConnect={handleConnect}
        onDisconnect={disconnectQBO}
        onRefreshToken={refreshQBOToken}
        tokenExpiresAt={tokenExpiresAt}
        isRefreshingToken={isRefreshingToken}
      />
      {isConnected && (
        <QBOTabs
          connection={connection}
          pendingOperations={pendingOperations}
          isProcessing={isProcessing}
          processOperations={processOperations}
          syncHistory={syncHistory}
          isLoadingSyncHistory={isLoadingSyncHistory}
          errors={errors}
          isLoadingErrors={isLoadingErrors}
          entityTypes={entityTypes}
          entityConfigs={entityConfigs}
          updateEntityConfig={updateEntityConfig}
          isLoadingEntityConfigs={isLoadingEntityConfigs}
          syncSettings={syncSettings}
          updateSyncSettings={updateSyncSettings}
          resolveError={resolveError}
          isProcessingOrSyncing={isProcessing || isSyncing}
          isSyncing={isSyncing}
        />
      )}
      <QBOMockConnectionModal
        open={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
      />
    </div>
  );
};
