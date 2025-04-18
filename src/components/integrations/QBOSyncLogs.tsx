
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, FileDown, Search } from 'lucide-react';

interface SyncLog {
  id: string;
  timestamp: Date;
  operation: 'full_sync' | 'incremental_sync' | 'manual_sync' | 'webhook_sync';
  status: 'success' | 'partial' | 'error';
  duration: number; // in seconds
  entities: {
    type: string;
    created: number;
    updated: number;
    failed: number;
    details?: string[];
  }[];
}

export const QBOSyncLogs: React.FC = () => {
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  
  // Mock data for sync logs - in a real app this would come from the database
  const logs: SyncLog[] = [
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      operation: 'manual_sync',
      status: 'success',
      duration: 45,
      entities: [
        { type: 'customers', created: 5, updated: 12, failed: 0 },
        { type: 'items', created: 2, updated: 8, failed: 0 }
      ]
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      operation: 'full_sync',
      status: 'partial',
      duration: 134,
      entities: [
        { type: 'customers', created: 15, updated: 230, failed: 0 },
        { type: 'items', created: 22, updated: 458, failed: 0 },
        { type: 'invoices', created: 5, updated: 123, failed: 7, details: [
          'Invoice #INV-2023-0547 failed: Invalid customer reference',
          'Invoice #INV-2023-0552 failed: Missing required tax information',
          'Invoice #INV-2023-0561 failed: Item SKU-7744 not found in QBO',
          '4 more errors...'
        ] }
      ]
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      operation: 'webhook_sync',
      status: 'success',
      duration: 3,
      entities: [
        { type: 'customers', created: 0, updated: 1, failed: 0 }
      ]
    },
    {
      id: "log-4",
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      operation: 'incremental_sync',
      status: 'error',
      duration: 12,
      entities: [
        { type: 'payments', created: 0, updated: 0, failed: 3, details: [
          'API Error: QuickBooks authentication token expired',
          'Reconnection attempts failed'
        ] }
      ]
    },
    {
      id: "log-5",
      timestamp: new Date(Date.now() - 345600000), // 4 days ago
      operation: 'full_sync',
      status: 'success',
      duration: 165,
      entities: [
        { type: 'customers', created: 0, updated: 254, failed: 0 },
        { type: 'items', created: 10, updated: 880, failed: 0 },
        { type: 'invoices', created: 15, updated: 437, failed: 0 },
        { type: 'payments', created: 8, updated: 312, failed: 0 }
      ]
    }
  ];

  const toggleExpand = (logId: string) => {
    if (expandedLog === logId) {
      setExpandedLog(null);
    } else {
      setExpandedLog(logId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'success': 
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'partial':
        return <Badge className="bg-amber-100 text-amber-800">Partial Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getOperationLabel = (operation: string) => {
    switch(operation) {
      case 'full_sync': return 'Full Sync';
      case 'incremental_sync': return 'Incremental Sync';
      case 'manual_sync': return 'Manual Sync';
      case 'webhook_sync': return 'Webhook Sync';
      default: return operation;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Search logs..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[200px]">Date & Time</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Processed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => {
              const isExpanded = expandedLog === log.id;
              const totalProcessed = log.entities.reduce(
                (sum, entity) => sum + entity.created + entity.updated, 0
              );
              const totalFailed = log.entities.reduce(
                (sum, entity) => sum + entity.failed, 0
              );
              
              return (
                <React.Fragment key={log.id}>
                  <TableRow className={isExpanded ? 'bg-slate-50' : ''}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleExpand(log.id)}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {log.timestamp.toLocaleDateString()} 
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </TableCell>
                    <TableCell>{getOperationLabel(log.operation)}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>{log.duration}s</TableCell>
                    <TableCell className="text-right">
                      {totalProcessed} item{totalProcessed !== 1 ? 's' : ''}
                      {totalFailed > 0 && (
                        <span className="text-red-600 ml-1">
                          ({totalFailed} failed)
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                  
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-slate-50 px-6 py-4">
                        <div className="space-y-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="px-2 py-1 text-left">Entity Type</th>
                                <th className="px-2 py-1 text-right">Created</th>
                                <th className="px-2 py-1 text-right">Updated</th>
                                <th className="px-2 py-1 text-right">Failed</th>
                              </tr>
                            </thead>
                            <tbody>
                              {log.entities.map((entity, idx) => (
                                <tr key={idx} className="border-b border-dashed">
                                  <td className="px-2 py-1 capitalize">{entity.type}</td>
                                  <td className="px-2 py-1 text-right">{entity.created}</td>
                                  <td className="px-2 py-1 text-right">{entity.updated}</td>
                                  <td className="px-2 py-1 text-right">{entity.failed}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          
                          {log.entities.some(e => e.details && e.details.length > 0) && (
                            <div className="bg-red-50 border border-red-100 rounded p-3">
                              <h4 className="text-sm font-medium text-red-800 mb-2">Error Details:</h4>
                              <ul className="space-y-1 text-xs text-red-700">
                                {log.entities
                                  .filter(e => e.details && e.details.length > 0)
                                  .map(entity => entity.details?.map((detail, i) => (
                                    <li key={i}>{detail}</li>
                                  )))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
