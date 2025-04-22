
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RefreshCw, CheckCircle, Clock, AlertCircle } from "lucide-react";

const getStatusBadge = (status: 'synced' | 'pending' | 'error') => {
  switch (status) {
    case 'synced':
      return (
        <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-green-700" />
          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">Synced</span>
        </div>
      );
    case 'pending':
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-yellow-700" />
          <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>
        </div>
      );
    case 'error':
      return (
        <div className="flex items-center gap-1">
          <AlertCircle className="h-4 w-4 text-red-700" />
          <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">Error</span>
        </div>
      );
  }
};

export const QBOReconciliationTable = ({
  filteredData,
  loading,
  displayNames,
  fetchReconciliationData
}: {
  filteredData: any[];
  loading: boolean;
  displayNames: Record<string, string>;
  fetchReconciliationData: () => void;
}) => (
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
          filteredData.map(row => (
            <TableRow key={row.entityId} className={
              row.batchlyStatus === 'error' || row.qboStatus === 'error'
                ? 'bg-red-50 hover:bg-red-100'
                : row.batchlyStatus !== row.qboStatus
                  ? 'bg-amber-50 hover:bg-amber-100'
                  : ''
            }>
              <TableCell className="font-medium">{displayNames[row.entityType]}</TableCell>
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
);
