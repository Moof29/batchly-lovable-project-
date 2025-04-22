
import React, { useState, useEffect } from 'react';
import { QBOConnectionStatus } from '@/components/integrations/QBOConnectionStatus';
import { useQBOIntegration } from '@/hooks/useQBOIntegration';
import { useQBOSync } from '@/hooks/useQBOSync';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { QBOMockConnectionModal } from '@/components/integrations/QBOMockConnectionModal';
import { QBOHeader } from './components/QBOHeader';
import { QBOTabs } from './components/QBOTabs';

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
      <QBOHeader />
      <QBOConnectionStatus
        isConnected={isConnected}
        connectionDetails={connectionDetails}
        onConnect={handleConnect}
        onDisconnect={disconnectQBO}
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
