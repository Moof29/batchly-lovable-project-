
import React from "react";
import { Calendar, ClockIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SyncStatusOverviewProps {
  lastSync: Date | null;
  syncInProgress: boolean;
  onTriggerSync: () => void;
}

export const SyncStatusOverview: React.FC<SyncStatusOverviewProps> = ({
  lastSync,
  syncInProgress,
  onTriggerSync,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          Last Full Sync: {lastSync ? lastSync.toLocaleDateString() : 'Never'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ClockIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          Last Sync Time: {lastSync ? lastSync.toLocaleTimeString() : 'Never'}
        </span>
      </div>
    </div>
    <Button
      onClick={onTriggerSync}
      disabled={syncInProgress}
      className="flex items-center gap-2"
      aria-label="Sync Now"
    >
      <RefreshCw className={`h-4 w-4 ${syncInProgress ? 'animate-spin' : ''}`} />
      {syncInProgress ? 'Syncing...' : 'Sync Now'}
    </Button>
  </div>
);
