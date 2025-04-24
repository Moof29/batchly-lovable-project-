
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  Ban,
  Loader2
} from 'lucide-react';

export type StatusType = 
  | 'success'
  | 'error'
  | 'warning'
  | 'pending'
  | 'processing'
  | 'inactive'
  | 'active';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showIcon = true,
  size = 'md',
  className,
  animate = true
}) => {
  // Normalize status to one of our standard types
  const normalizedStatus = normalizeStatus(status);
  const displayLabel = label || getDefaultLabel(normalizedStatus);
  
  // Get icon and styles based on status
  const { icon: Icon, badgeClassName } = getStatusConfig(normalizedStatus, animate);
  
  // Determine size classes
  const sizeClasses = {
    sm: 'text-xs py-0 px-1.5 gap-1',
    md: 'text-xs py-1 px-2 gap-1.5',
    lg: 'text-sm py-1 px-3 gap-2'
  };
  
  return (
    <Badge 
      className={cn(
        badgeClassName,
        sizeClasses[size],
        className
      )}
      variant="outline"
    >
      {showIcon && Icon && <Icon className={cn(
        'w-3 h-3',
        size === 'lg' && 'w-4 h-4',
        size === 'sm' && 'w-2.5 h-2.5',
        animate && normalizedStatus === 'processing' && 'animate-spin'
      )} />}
      <span>{displayLabel}</span>
    </Badge>
  );
};

// Helper to normalize various status strings into our standard types
function normalizeStatus(status: string): StatusType {
  const statusLower = status.toLowerCase();
  
  // Map common variant status names to our standard types
  if (['success', 'completed', 'synced', 'paid', 'approved'].includes(statusLower)) {
    return 'success';
  }
  
  if (['error', 'failed', 'rejected', 'overdue'].includes(statusLower)) {
    return 'error';
  }
  
  if (['warning', 'partial', 'attention', 'partial_payment'].includes(statusLower)) {
    return 'warning';
  }
  
  if (['pending', 'waiting', 'scheduled', 'draft', 'queued', 'open'].includes(statusLower)) {
    return 'pending';
  }
  
  if (['processing', 'syncing', 'in_progress', 'running'].includes(statusLower)) {
    return 'processing';
  }
  
  if (['inactive', 'disabled', 'archived', 'closed'].includes(statusLower)) {
    return 'inactive';
  }
  
  if (['active', 'enabled', 'online'].includes(statusLower)) {
    return 'active';
  }
  
  // Default fallback
  return 'pending';
}

// Get default label for a status if none provided
function getDefaultLabel(status: StatusType): string {
  const labels: Record<StatusType, string> = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    pending: 'Pending',
    processing: 'Processing',
    inactive: 'Inactive',
    active: 'Active'
  };
  return labels[status];
}

// Get icon and style configuration for each status type
function getStatusConfig(status: StatusType, animate: boolean) {
  const configs = {
    success: {
      icon: CheckCircle2,
      badgeClassName: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800'
    },
    error: {
      icon: AlertCircle,
      badgeClassName: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800'
    },
    warning: {
      icon: AlertTriangle,
      badgeClassName: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800'
    },
    pending: {
      icon: Clock,
      badgeClassName: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800'
    },
    processing: {
      icon: animate ? Loader2 : RefreshCw,
      badgeClassName: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800'
    },
    inactive: {
      icon: Ban,
      badgeClassName: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-800'
    },
    active: {
      icon: CheckCircle2,
      badgeClassName: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800'
    }
  };
  
  return configs[status];
}
