
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, AlertCircle, AlertTriangle, ArrowDown } from 'lucide-react';

interface QBOIntegrationSyncHistoryProps {
  syncHistory: any[];
  isLoading: boolean;
}

const QBOIntegrationSyncHistory: React.FC<QBOIntegrationSyncHistoryProps> = ({
  syncHistory,
  isLoading
}) => {
  const [syncTypeFilter, setSyncTypeFilter] = useState('all');

  // Filter history by sync type
  const filteredHistory = syncTypeFilter === 'all' 
    ? syncHistory 
    : syncHistory.filter(item => item.sync_type === syncTypeFilter);

  // Get the status badge based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Failed</Badge>;
      case 'partial':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">Partial</Badge>;
      case 'started':
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get the icon based on status
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  // Format the sync type for display
  const formatSyncType = (type: string) => {
    switch(type) {
      case 'manual':
        return 'Manual Sync';
      case 'scheduled':
        return 'Scheduled Sync';
      case 'webhook':
        return 'Webhook Trigger';
      case 'full':
        return 'Full Sync';
      case 'incremental':
        return 'Incremental Sync';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Format the entity list
  const formatEntityList = (entities: string[]) => {
    if (!entities || entities.length === 0) return 'All';
    
    const formattedEntities = entities.map(entity => {
      const parts = entity.split('_');
      return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    });
    
    if (formattedEntities.length <= 2) {
      return formattedEntities.join(', ');
    }
    
    return `${formattedEntities[0]}, ${formattedEntities[1]} +${formattedEntities.length - 2} more`;
  };
  
  // Calculate duration
  const calculateDuration = (startDate: string, endDate: string | null) => {
    if (!endDate) return 'In progress';
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const durationMs = end - start;
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    } else if (durationMs < 60000) {
      return `${Math.floor(durationMs / 1000)}s`;
    } else if (durationMs < 3600000) {
      return `${Math.floor(durationMs / 60000)}m ${Math.floor((durationMs % 60000) / 1000)}s`;
    } else {
      return `${Math.floor(durationMs / 3600000)}h ${Math.floor((durationMs % 3600000) / 60000)}m`;
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full shadow-md">
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading sync history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sync History</CardTitle>
        <Select value={syncTypeFilter} onValueChange={setSyncTypeFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="full">Full</SelectItem>
            <SelectItem value="incremental">Incremental</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {filteredHistory.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entities</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Records</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((sync) => (
                  <TableRow key={sync.id} className="group">
                    <TableCell className="text-xs">
                      <div className="flex flex-col">
                        <span>{new Date(sync.started_at).toLocaleDateString()}</span>
                        <span className="text-muted-foreground">{new Date(sync.started_at).toLocaleTimeString()}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {calculateDuration(sync.started_at, sync.completed_at)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatSyncType(sync.sync_type)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatEntityList(sync.entity_types || [])}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center">
                        {getStatusBadge(sync.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium">
                          {sync.success_count || 0}/{sync.entity_count || 0}
                        </span>
                        {sync.failure_count > 0 && (
                          <span className="text-xs text-red-600">
                            {sync.failure_count} failed
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-md flex items-center justify-center p-8">
            <div className="text-center">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium">No sync history found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {syncTypeFilter !== 'all' 
                  ? `No ${syncTypeFilter} syncs have been performed yet.` 
                  : 'No sync operations have been performed yet.'}
              </p>
            </div>
          </div>
        )}
        
        {filteredHistory.length > 0 && (
          <div className="mt-3 flex justify-end">
            <Button variant="link" size="sm" className="text-xs">
              View all history <ArrowDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QBOIntegrationSyncHistory;
