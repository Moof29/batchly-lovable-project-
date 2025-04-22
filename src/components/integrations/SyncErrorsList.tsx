
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, XCircle } from "lucide-react";
import { SyncError } from "./QBOSyncStatus";

interface SyncErrorsListProps {
  syncErrors: SyncError[];
}

export const SyncErrorsList: React.FC<SyncErrorsListProps> = ({ syncErrors }) => {
  if (!syncErrors || syncErrors.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        Sync Errors ({syncErrors.length})
      </h3>
      <div className="space-y-2">
        {syncErrors.slice(0, 3).map((error) => (
          <div key={error.id} className="border border-red-200 bg-red-50 rounded-md p-3">
            <div className="flex items-start">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{error.entityType}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(error.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{error.message}</p>
              </div>
            </div>
          </div>
        ))}
        {syncErrors.length > 3 && (
          <Button variant="link" className="text-sm">
            View all {syncErrors.length} errors
          </Button>
        )}
      </div>
    </div>
  );
};
