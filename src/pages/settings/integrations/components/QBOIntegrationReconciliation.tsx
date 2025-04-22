
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DownloadIcon, FilterIcon, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface ReconciliationRow {
  entityId: string;
  entityType: string;
  batchlyStatus: 'synced' | 'pending' | 'error';
  qboStatus: 'synced' | 'pending' | 'error';
  lastUpdatedBatchly: Date | null;
  lastUpdatedQBO: Date | null;
  remarks?: string;
}

type EntityTableName = 'customer_profile' | 'vendor_profile' | 'item_record' | 'invoice_record' | 'bill_record' | 'payment_receipt';

const entityTypes: EntityTableName[] = ['customer_profile', 'vendor_profile', 'item_record', 'invoice_record', 'bill_record', 'payment_receipt'];

const displayNames: Record<EntityTableName, string> = {
  'customer_profile': 'Customers',
  'vendor_profile': 'Vendors',
  'item_record': 'Items',
  'invoice_record': 'Invoices',
  'bill_record': 'Bills',
  'payment_receipt': 'Payments'
};

const QBOIntegrationReconciliation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReconciliationRow[]>([]);
  const [filteredData, setFilteredData] = useState<ReconciliationRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    synced: 0,
    pending: 0,
    error: 0,
    syncPercentage: 0
  });
  const { toast } = useToast();

  const fetchReconciliationData = async () => {
    try {
      setLoading(true);

      const results: ReconciliationRow[] = [];

      for (const entity of entityTypes) {
        const { data: batchlyData, error: batchlyError } = await supabase
          .from(entity)
          .select('id, qbo_sync_status, last_sync_at, updated_at')
          .limit(5);

        if (batchlyError) {
          console.error(`Error fetching ${entity} data:`, batchlyError);
          continue;
        }

        if (!batchlyData || batchlyData.length === 0) continue;

        for (const item of batchlyData) {
          const { data: qboMapping, error: mappingError } = await supabase
            .from('qbo_entity_mapping')
            .select('last_qbo_update')
            .eq('batchly_id', item.id)
            .eq('entity_type', entity)
            .single();

          if (mappingError && mappingError.code !== 'PGRST116') {
            console.error(`Error fetching QBO mapping for ${entity} ${item.id}:`, mappingError);
          }

          const batchlyStatus: 'synced' | 'pending' | 'error' = 
            (item.qbo_sync_status === 'error' ? 'error' : 
            (item.qbo_sync_status === 'synced' ? 'synced' : 'pending'));

          let qboStatus: 'synced' | 'pending' | 'error' = 'pending';
          
          if (qboMapping?.last_qbo_update) {
            const lastQbo = new Date(qboMapping.last_qbo_update);
            const lastBatchly = item.last_sync_at ? new Date(item.last_sync_at) : new Date(item.updated_at);
            
            if (Math.abs(lastQbo.getTime() - lastBatchly.getTime()) > 3600000) {
              qboStatus = mappingError ? 'error' : 'pending';
            } else {
              qboStatus = 'synced';
            }
          }

          results.push({
            entityId: item.id,
            entityType: entity,
            batchlyStatus,
            qboStatus,
            lastUpdatedBatchly: item.last_sync_at ? new Date(item.last_sync_at) : new Date(item.updated_at),
            lastUpdatedQBO: qboMapping?.last_qbo_update ? new Date(qboMapping.last_qbo_update) : null,
            remarks: (batchlyStatus === 'error' || qboStatus === 'error') ? 'Check errors' : ''
          });
        }
      }

      setData(results);
      updateFilters(results, searchTerm, statusFilter, entityFilter);
      updateSummaryStats(results);
    } catch (error) {
      toast({
        title: 'Failed to load reconciliation data',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSummaryStats = (rows: ReconciliationRow[]) => {
    const total = rows.length;
    const synced = rows.filter(row => row.batchlyStatus === 'synced' && row.qboStatus === 'synced').length;
    const pending = rows.filter(row => row.batchlyStatus === 'pending' || row.qboStatus === 'pending').length;
    const error = rows.filter(row => row.batchlyStatus === 'error' || row.qboStatus === 'error').length;
    
    setSummaryStats({
      total,
      synced,
      pending,
      error,
      syncPercentage: total > 0 ? Math.round((synced / total) * 100) : 0
    });
  };

  const updateFilters = (
    dataToFilter: ReconciliationRow[],
    search: string, 
    status: string,
    entity: string
  ) => {
    let result = [...dataToFilter];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(row => 
        row.entityId.toLowerCase().includes(searchLower) || 
        displayNames[row.entityType as EntityTableName].toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      if (status === 'synced') {
        result = result.filter(row => row.batchlyStatus === 'synced' && row.qboStatus === 'synced');
      } else if (status === 'pending') {
        result = result.filter(row => row.batchlyStatus === 'pending' || row.qboStatus === 'pending');
      } else if (status === 'error') {
        result = result.filter(row => row.batchlyStatus === 'error' || row.qboStatus === 'error');
      } else if (status === 'mismatch') {
        result = result.filter(row => row.batchlyStatus !== row.qboStatus);
      }
    }
    
    // Apply entity filter
    if (entity !== 'all') {
      result = result.filter(row => row.entityType === entity);
    }
    
    setFilteredData(result);
  };

  // Export data to CSV
  const exportToCSV = () => {
    if (!filteredData.length) return;

    const headers = ['Entity Type', 'ID', 'Batchly Status', 'QBO Status', 'Last Updated (Batchly)', 'Last Updated (QBO)', 'Remarks'];
    const csvRows = [
      headers.join(','),
      ...filteredData.map(row => [
        displayNames[row.entityType as EntityTableName],
        row.entityId,
        row.batchlyStatus,
        row.qboStatus,
        row.lastUpdatedBatchly?.toLocaleString() || 'N/A',
        row.lastUpdatedQBO?.toLocaleString() || 'N/A',
        `"${row.remarks || ''}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `qbo-reconciliation-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: 'synced' | 'pending' | 'error') => {
    switch (status) {
      case 'synced':
        return (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-700" />
            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
              Synced
            </span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-yellow-700" />
            <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
              Pending
            </span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4 text-red-700" />
            <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
              Error
            </span>
          </div>
        );
    }
  };

  useEffect(() => {
    fetchReconciliationData();
  }, []);

  useEffect(() => {
    updateFilters(data, searchTerm, statusFilter, entityFilter);
  }, [searchTerm, statusFilter, entityFilter, data]);

  return (
    <Tabs defaultValue="data" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="data">Reconciliation Data</TabsTrigger>
        <TabsTrigger value="summary">Sync Summary</TabsTrigger>
      </TabsList>

      <TabsContent value="data" className="space-y-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center">
            <div className="flex-1">
              <CardTitle>Data Reconciliation Tools</CardTitle>
              <CardDescription>Compare and manage data between Batchly and QuickBooks Online</CardDescription>
            </div>
            <Button onClick={fetchReconciliationData} disabled={loading} variant="outline" className="mr-2">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button onClick={exportToCSV} disabled={filteredData.length === 0} variant="outline">
              <DownloadIcon className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-1 gap-2">
                <div className="w-1/2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="synced">Synced</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="mismatch">Mismatched</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/2">
                  <Select value={entityFilter} onValueChange={setEntityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities</SelectItem>
                      {entityTypes.map((type) => (
                        <SelectItem key={type} value={type}>{displayNames[type]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {filteredData.length === 0 && !loading ? (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-muted-foreground">No data matches your criteria</p>
                <Button variant="ghost" onClick={fetchReconciliationData} className="mt-2">
                  Refresh Data
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Batchly Status</TableHead>
                      <TableHead>QBO Status</TableHead>
                      <TableHead>Last Updated (Batchly)</TableHead>
                      <TableHead>Last Updated (QBO)</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center p-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                          <p>Loading reconciliation data...</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row) => (
                        <TableRow key={row.entityId} className={
                          row.batchlyStatus === 'error' || row.qboStatus === 'error' 
                            ? 'bg-red-50 hover:bg-red-100' 
                            : row.batchlyStatus !== row.qboStatus 
                              ? 'bg-amber-50 hover:bg-amber-100'
                              : ''
                        }>
                          <TableCell className="font-medium">{displayNames[row.entityType as EntityTableName]}</TableCell>
                          <TableCell className="font-mono text-sm">{row.entityId.substring(0, 8)}...</TableCell>
                          <TableCell>{getStatusBadge(row.batchlyStatus)}</TableCell>
                          <TableCell>{getStatusBadge(row.qboStatus)}</TableCell>
                          <TableCell>{row.lastUpdatedBatchly?.toLocaleString() || 'N/A'}</TableCell>
                          <TableCell>{row.lastUpdatedQBO?.toLocaleString() || 'N/A'}</TableCell>
                          <TableCell>
                            {row.remarks && (
                              <span className="text-red-600 font-medium">{row.remarks}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="summary">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Synchronization Summary</CardTitle>
            <CardDescription>Overview of data reconciliation status between Batchly and QBO</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Sync Progress</span>
                  <span className="text-sm font-medium">{summaryStats.syncPercentage}%</span>
                </div>
                <Progress value={summaryStats.syncPercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Total Records</p>
                  <p className="text-2xl font-bold">{summaryStats.total}</p>
                </div>
                
                <div className="bg-green-50 rounded-xl shadow p-4 text-center">
                  <p className="text-sm text-green-700 mb-1">Synced</p>
                  <p className="text-2xl font-bold text-green-700">{summaryStats.synced}</p>
                </div>
                
                <div className="bg-yellow-50 rounded-xl shadow p-4 text-center">
                  <p className="text-sm text-yellow-700 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-700">{summaryStats.pending}</p>
                </div>
                
                <div className="bg-red-50 rounded-xl shadow p-4 text-center">
                  <p className="text-sm text-red-700 mb-1">Errors</p>
                  <p className="text-2xl font-bold text-red-700">{summaryStats.error}</p>
                </div>
              </div>

              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Entity Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entityTypes.map(type => {
                    const entityData = data.filter(row => row.entityType === type);
                    if (entityData.length === 0) return null;
                    
                    const synced = entityData.filter(row => row.batchlyStatus === 'synced' && row.qboStatus === 'synced').length;
                    const percent = Math.round((synced / entityData.length) * 100);
                    
                    return (
                      <div key={type} className="bg-white rounded-xl shadow p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{displayNames[type]}</h4>
                          <Badge variant={percent === 100 ? "secondary" : "outline"} className={percent === 100 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                            {percent}%
                          </Badge>
                        </div>
                        <Progress value={percent} className="h-1 mb-2" />
                        <div className="text-xs text-gray-500 flex justify-between">
                          <span>Total: {entityData.length}</span>
                          <span>Synced: {synced}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default QBOIntegrationReconciliation;
