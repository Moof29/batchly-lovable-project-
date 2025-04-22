
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReconciliationRow {
  entityId: string;
  entityType: string;
  batchlyStatus: 'synced' | 'pending' | 'error';
  qboStatus: 'synced' | 'pending' | 'error';
  lastUpdatedBatchly: Date | null;
  lastUpdatedQBO: Date | null;
  remarks?: string;
}

const entityTypes = ['customer_profile', 'vendor_profile', 'item_record', 'invoice_record', 'bill_record', 'payment_receipt'];

const QBOIntegrationReconciliation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReconciliationRow[]>([]);
  const { toast } = useToast();

  const fetchReconciliationData = async () => {
    try {
      setLoading(true);

      // For demonstration, we will load a simple aggregated reconciliation data comparing last sync status timestamps
      // We'll query Batchly tables and QBO mappings to compare sync status and last update times for entities

      // Generate reconciliation data for each entity type
      const results: ReconciliationRow[] = [];

      for (const entity of entityTypes) {
        // Batchly side query (simplified)
        const batchlyData = await supabase
          .from(entity)
          .select('id, qbo_sync_status, last_sync_at, updated_at')
          .limit(5);

        if (!batchlyData.data) continue;

        for (const item of batchlyData.data) {
          // For QBO, check qbo_entity_mapping for matching qbo_id and entity_type
          const qboMapping = await supabase
            .from('qbo_entity_mapping')
            .select('last_qbo_update')
            .eq('batchly_id', item.id)
            .eq('entity_type', entity)
            .single();

          const batchlyStatus = item.qbo_sync_status || 'pending';
          // Determine QBO Status from last_qbo_update (if recent enough consider synced)
          let qboStatus: 'synced' | 'pending' | 'error' = 'pending';
          if (qboMapping.data?.last_qbo_update) {
            const lastQbo = new Date(qboMapping.data.last_qbo_update);
            const lastBatchly = item.last_sync_at ? new Date(item.last_sync_at) : new Date(item.updated_at);
            // Within 1 hour difference synced, else pending
            if (Math.abs(lastQbo.getTime() - lastBatchly.getTime()) < 3600000) {
              qboStatus = 'synced';
            } else {
              qboStatus = 'pending';
            }
          } else {
            qboStatus = 'pending';
          }

          results.push({
            entityId: item.id,
            entityType: entity,
            batchlyStatus,
            qboStatus,
            lastUpdatedBatchly: item.last_sync_at ? new Date(item.last_sync_at) : new Date(item.updated_at),
            lastUpdatedQBO: qboMapping.data?.last_qbo_update ? new Date(qboMapping.data.last_qbo_update) : null,
            remarks: batchlyStatus === 'error' || qboStatus === 'error' ? 'Check errors' : ''
          });
        }
      }

      setData(results);
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

  useEffect(() => {
    fetchReconciliationData();
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Data Reconciliation Tools</CardTitle>
        <Button onClick={fetchReconciliationData} disabled={loading} className="ml-auto">
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent>
        {data.length === 0 && !loading ? (
          <p className="text-muted-foreground text-center">No data to reconcile</p>
        ) : (
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
              {data.map((row) => (
                <TableRow key={row.entityId}>
                  <TableCell className="capitalize">{row.entityType.replace('_', ' ')}</TableCell>
                  <TableCell>{row.entityId}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        row.batchlyStatus === 'synced' ? 'bg-green-100 text-green-700' :
                        row.batchlyStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {row.batchlyStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        row.qboStatus === 'synced' ? 'bg-green-100 text-green-700' :
                        row.qboStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {row.qboStatus}
                    </span>
                  </TableCell>
                  <TableCell>{row.lastUpdatedBatchly?.toLocaleString() || 'N/A'}</TableCell>
                  <TableCell>{row.lastUpdatedQBO?.toLocaleString() || 'N/A'}</TableCell>
                  <TableCell>{row.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default QBOIntegrationReconciliation;
