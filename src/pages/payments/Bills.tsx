
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillsTable } from "@/components/bills/BillsTable";
import { useBills } from "@/hooks/useBills";
import { Button } from '@/components/ui/button';
import { useEnhancedQBOSync } from '@/hooks/useEnhancedQBOSync';
import { useQBOHealthMonitor } from '@/hooks/useQBOHealthMonitor';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export const Bills = () => {
  const { user } = useAuth();
  const organizationId = user?.organization_id;
  const [sorting, setSorting] = useState({ column: "due_date", direction: "asc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: bills, isLoading } = useBills(sorting, filters);
  const { 
    processOperations, 
    isProcessing,
    pendingOperations,
    errors
  } = useEnhancedQBOSync(organizationId);
  
  const { health, isDegraded, isUnavailable } = useQBOHealthMonitor(organizationId);

  // Calculate pending bill operations
  const pendingBills = pendingOperations?.filter(op => op.entity_type === 'bill_record') || [];

  const handleSort = (column: string) => {
    setSorting(prev => ({
      column,
      direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleFilter = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value,
    }));
  };

  const handleSyncBills = () => {
    processOperations({ entityType: 'bill_record', batchSize: 20 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bills</h1>
          <p className="text-muted-foreground">Manage and track your bills</p>
        </div>
        
        {(isUnavailable || isDegraded) && (
          <Alert variant={isUnavailable ? "destructive" : "default"} className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {isUnavailable ? "QBO Service Unavailable" : "QBO Service Degraded"}
            </AlertTitle>
            <AlertDescription>
              {isUnavailable 
                ? "The connection to QuickBooks is currently unavailable. Data sync is paused."
                : "The connection to QuickBooks is experiencing issues. Some operations may fail."
              }
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-3">
          {pendingBills.length > 0 && (
            <Badge variant="secondary" className="font-medium">
              {pendingBills.length} pending sync
            </Badge>
          )}
          
          <Button 
            onClick={handleSyncBills}
            disabled={isProcessing || isUnavailable} 
            variant="outline"
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sync with QBO
          </Button>
          
          <Button>New Bill</Button>
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Outstanding Bills</CardTitle>
        </CardHeader>
        <CardContent>
          {health.status !== 'healthy' && (
            <div className="mb-4">
              <Alert variant={health.status === 'degraded' ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {health.status === 'degraded' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    QBO Integration Status: {health.status.toUpperCase()}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-1">
                  Success rate: {health.successRate24h.toFixed(1)}% in the last 24 hours.
                  {health.failedOperations24h > 0 && 
                    ` ${health.failedOperations24h} operations failed.`
                  }
                </AlertDescription>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(health.serviceComponents).map(([key, status]) => (
                    <div key={key} className="text-xs flex items-center gap-1">
                      {status === 'healthy' ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : status === 'degraded' ? (
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span className="capitalize">{key}:</span>
                      <span className="capitalize">{status}</span>
                    </div>
                  ))}
                </div>
              </Alert>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading bills...</div>
            </div>
          ) : (
            <BillsTable
              bills={bills || []}
              sorting={sorting}
              filters={filters}
              onSort={handleSort}
              onFilter={handleFilter}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
