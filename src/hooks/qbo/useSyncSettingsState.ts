
import { useState, useCallback } from 'react';
import { SyncSettings } from "@/components/integrations/QBOSyncSettings";
import { toast } from "@/hooks/use-toast";

export const useSyncSettingsState = (defaultSettings: SyncSettings) => {
  const [syncSettings, setSyncSettings] = useState<SyncSettings>(defaultSettings);
  const updateSyncSettings = useCallback((newSettings: SyncSettings) => {
    setSyncSettings(newSettings);
    toast({
      title: 'Sync Settings Updated',
      description: 'Your QuickBooks sync settings have been saved',
    });
  }, []);
  return { syncSettings, updateSyncSettings };
};
