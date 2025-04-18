
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle2, RefreshCw, Clock } from 'lucide-react';
import { QBORoleVisibility } from './QBORoleVisibility';
import { UserRole } from '@/types/auth';

interface QBOSyncStatusBadgeProps {
  entityType: 'customer' | 'inventory' | 'invoice' | 'payment' | 'bill';
  status: 'synced' | 'pending' | 'error' | 'syncing';
  lastSyncTime?: Date;
  visibleToRole?: UserRole;
}

export const QBOSyncStatusBadge: React.FC<QBOSyncStatusBadgeProps> = ({
  entityType,
  status,
  lastSyncTime,
  visibleToRole = 'admin'
}) => {
  let icon, badgeStyle, tooltipText;
  
  switch(status) {
    case 'synced':
      icon = <CheckCircle2 className="h-3 w-3" />;
      badgeStyle = "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      tooltipText = `Synced to QBO${lastSyncTime ? ` on ${lastSyncTime.toLocaleDateString()}` : ''}`;
      break;
    case 'pending':
      icon = <Clock className="h-3 w-3" />;
      badgeStyle = "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
      tooltipText = "Waiting to sync to QBO";
      break;
    case 'error':
      icon = <AlertCircle className="h-3 w-3" />;
      badgeStyle = "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      tooltipText = "Failed to sync to QBO";
      break;
    case 'syncing':
      icon = <RefreshCw className="h-3 w-3 animate-spin" />;
      badgeStyle = "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      tooltipText = "Currently syncing to QBO";
      break;
  }

  // Only show the badge if the user has the required role permission
  return (
    <QBORoleVisibility requiredRole={visibleToRole}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={`inline-flex items-center gap-1 ${badgeStyle}`}>
              {icon}
              <span className="text-xs">QBO</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </QBORoleVisibility>
  );
};
