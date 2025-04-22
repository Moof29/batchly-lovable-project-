import React, { useState, useEffect } from 'react';
import { QBOConnectionStatus } from '@/components/integrations/QBOConnectionStatus';
import { QBOSyncStatus } from '@/components/integrations/QBOSyncStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQBOIntegration } from '@/hooks/useQBOIntegration';
import { useQBOSync } from '@/hooks/useQBOSync';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Settings, List, Activity, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QBOSyncLogs } from '@/components/integrations/QBOSyncLogs';
import { QBOSyncSettings } from '@/components/integrations/QBOSyncSettings';
import { QBOMockConnectionModal } from '@/components/integrations/QBOMockConnectionModal';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useDevMode } from '@/contexts/DevModeContext';

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">QuickBooks Online Integration</h1>
          <p className="text-muted-foreground">Connect and sync data with your QuickBooks Online account</p>
        </div>
      </div>
      
      <QBOConnectionStatus 
        isConnected={isConnected} 
        connectionDetails={connectionDetails} 
        onConnect={handleConnect}
        onDisconnect={disconnectQBO}
      />
      
      {isConnected && (
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
              Errors {errors.length > 0 && (
                <Badge variant="destructive" className="ml-1">{errors.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sync" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sync Overview</CardTitle>
                  <CardDescription>Current sync status and operations</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingPendingOperations ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Pending Operations</span>
                        <Badge variant="outline">{pendingOperations.length}</Badge>
                      </div>
                      
                      {entityTypes.map((entity) => {
                        const entityOps = pendingOperations.filter(op => op.entity_type === entity.type);
                        if (entityOps.length === 0) return null;
                        
                        return (
                          <div key={entity.type} className="border rounded-md p-3 space-y-2">
                            <div className="flex justify-between items-center">
                              <span>{entity.label}</span>
                              <Badge>{entityOps.length}</Badge>
                            </div>
                            <Progress value={(entityOps.filter(op => op.status === 'success').length / entityOps.length) * 100} />
                          </div>
                        );
                      })}
                      
                      {pendingOperations.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          No pending operations
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => processOperations()}
                    disabled={isProcessing || pendingOperations.length === 0}
                  >
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Process Pending
                  </Button>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Full sync initiated",
                        description: "Starting full synchronization with QuickBooks Online",
                      });
                    }}
                  >
                    Full Sync
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sync History</CardTitle>
                  <CardDescription>Recent synchronization activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSyncHistory ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {syncHistory.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead className="text-right">Results</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {syncHistory.slice(0, 5).map((history) => (
                              <TableRow key={history.id}>
                                <TableCell>
                                  {new Date(history.started_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="capitalize">
                                    {history.sync_type}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  {history.status === 'completed' ? (
                                    <span className="text-green-600 font-medium">
                                      {history.success_count}/{history.entity_count}
                                    </span>
                                  ) : history.status === 'failed' ? (
                                    <span className="text-red-600 font-medium">
                                      Failed
                                    </span>
                                  ) : (
                                    <span className="text-amber-600 font-medium">
                                      In Progress
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No sync history available
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <QBOSyncStatus
              lastSync={connection?.last_sync_at ? new Date(connection.last_sync_at) : null}
              syncErrors={errors.map(err => ({
                id: err.id,
                entityType: err.error_category === 'data' ? 'items' : 'customers',
                message: err.error_message,
                timestamp: new Date(err.last_occurred_at),
                resolved: err.is_resolved
              }))}
              syncInProgress={isProcessing || isSyncing}
              onTriggerSync={async (entityTypes) => {
                if (!entityTypes || entityTypes.length === 0) {
                  toast({
                    title: "Full sync initiated",
                    description: "Starting sync for all entities",
                  });
                } else {
                  toast({
                    title: "Entity sync initiated",
                    description: `Starting sync for ${entityTypes.join(', ')}`,
                  });
                }
              }}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
                <CardDescription>Configure how data is synchronized with QuickBooks Online</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <QBOSyncSettings
                  settings={syncSettings}
                  updateSettings={updateSyncSettings}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="entities">
            <Card>
              <CardHeader>
                <CardTitle>Entity Configuration</CardTitle>
                <CardDescription>Configure how each entity type synchronizes with QuickBooks</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingEntityConfigs ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="space-y-4">
                    {entityTypes.map((entity) => {
                      const config = entityConfigs.find(ec => ec.entity_type === entity.type);
                      if (!config) return null;
                      
                      return (
                        <AccordionItem key={entity.type} value={entity.type} className="border rounded-md px-4">
                          <AccordionTrigger className="py-4">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{entity.label}</span>
                                {config.is_enabled ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Enabled</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-100">Disabled</Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Priority: {config.priority_level}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 py-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Sync Direction</h4>
                                  <select 
                                    className="w-full p-2 border rounded-md"
                                    value={config.sync_direction}
                                    onChange={(e) => updateEntityConfig({
                                      configId: config.id,
                                      updates: { sync_direction: e.target.value as any }
                                    })}
                                  >
                                    <option value="bidirectional">Bidirectional</option>
                                    <option value="to_qbo">To QuickBooks Only</option>
                                    <option value="from_qbo">From QuickBooks Only</option>
                                  </select>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Batch Size</h4>
                                  <select 
                                    className="w-full p-2 border rounded-md"
                                    value={config.batch_size}
                                    onChange={(e) => updateEntityConfig({
                                      configId: config.id,
                                      updates: { batch_size: Number(e.target.value) }
                                    })}
                                  >
                                    <option value="10">10 (Small)</option>
                                    <option value="50">50 (Medium)</option>
                                    <option value="100">100 (Large)</option>
                                    <option value="250">250 (Very Large)</option>
                                  </select>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Priority Level</h4>
                                  <select 
                                    className="w-full p-2 border rounded-md"
                                    value={config.priority_level}
                                    onChange={(e) => updateEntityConfig({
                                      configId: config.id,
                                      updates: { priority_level: Number(e.target.value) }
                                    })}
                                  >
                                    <option value="1">1 - Highest</option>
                                    <option value="2">2 - High</option>
                                    <option value="3">3 - Medium</option>
                                    <option value="4">4 - Low</option>
                                    <option value="5">5 - Lowest</option>
                                  </select>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Sync Frequency (minutes)</h4>
                                  <select 
                                    className="w-full p-2 border rounded-md"
                                    value={config.sync_frequency_minutes}
                                    onChange={(e) => updateEntityConfig({
                                      configId: config.id,
                                      updates: { sync_frequency_minutes: Number(e.target.value) }
                                    })}
                                  >
                                    <option value="15">Every 15 minutes</option>
                                    <option value="30">Every 30 minutes</option>
                                    <option value="60">Every hour</option>
                                    <option value="360">Every 6 hours</option>
                                    <option value="720">Every 12 hours</option>
                                    <option value="1440">Daily</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="flex items-center pt-2">
                                <label className="flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="sr-only"
                                    checked={config.is_enabled}
                                    onChange={() => updateEntityConfig({
                                      configId: config.id,
                                      updates: { is_enabled: !config.is_enabled }
                                    })}
                                  />
                                  <div className={`relative w-10 h-5 transition-colors rounded-full ${config.is_enabled ? 'bg-brand-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 transition-transform bg-white rounded-full ${config.is_enabled ? 'transform translate-x-5' : ''}`}></div>
                                  </div>
                                  <span className="ml-2 text-sm font-medium">
                                    {config.is_enabled ? 'Enabled' : 'Disabled'}
                                  </span>
                                </label>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-auto"
                                  onClick={() => {
                                    toast({
                                      title: `Syncing ${entity.label}`,
                                      description: "Starting synchronization for this entity type",
                                    });
                                  }}
                                >
                                  Sync Now
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <CardTitle>Sync Errors</CardTitle>
                <CardDescription>Review and resolve synchronization errors</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingErrors ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : errors.length > 0 ? (
                  <div className="space-y-4">
                    {errors.map((error) => (
                      <div key={error.id} className="border border-red-200 bg-red-50 rounded-md p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={
                                error.error_category === 'auth' ? 'bg-blue-100 text-blue-800' :
                                error.error_category === 'validation' ? 'bg-amber-100 text-amber-800' :
                                error.error_category === 'rate_limit' ? 'bg-purple-100 text-purple-800' :
                                error.error_category === 'connection' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {error.error_category}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(error.last_occurred_at).toLocaleString()}
                              </span>
                              {error.occurrence_count > 1 && (
                                <Badge variant="outline">
                                  {error.occurrence_count} occurrences
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium">{error.error_message}</p>
                            {error.suggested_resolution && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {error.suggested_resolution}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 self-end md:self-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => resolveError(error.id)}
                            >
                              Resolve
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Retrying operation",
                                  description: "Attempting to retry the failed operation",
                                });
                              }}
                            >
                              Retry
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No errors found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      <QBOMockConnectionModal
        open={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
      />
    </div>
  );
};
