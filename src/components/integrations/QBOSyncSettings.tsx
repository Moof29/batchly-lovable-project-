
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface SyncSettings {
  entities: {
    customers: boolean;
    items: boolean;
    invoices: boolean;
    payments: boolean;
    bills: boolean;
  };
  frequency: 'manual' | 'hourly' | 'daily' | 'weekly';
  scheduleTime?: string;
  scheduleDay?: number;
  autoSyncNewRecords: boolean;
  conflictResolutionStrategy: 'qbo_wins' | 'batchly_wins' | 'newest_wins' | 'ask';
}

interface QBOSyncSettingsProps {
  settings: SyncSettings;
  updateSettings: (settings: SyncSettings) => void;
}

export const QBOSyncSettings: React.FC<QBOSyncSettingsProps> = ({
  settings,
  updateSettings,
}) => {
  const [localSettings, setLocalSettings] = React.useState<SyncSettings>(settings);

  const handleEntityToggle = (entity: keyof SyncSettings['entities']) => {
    setLocalSettings({
      ...localSettings,
      entities: {
        ...localSettings.entities,
        [entity]: !localSettings.entities[entity]
      }
    });
  };

  const handleFrequencyChange = (value: string) => {
    setLocalSettings({
      ...localSettings,
      frequency: value as SyncSettings['frequency']
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSettings({
      ...localSettings,
      scheduleTime: e.target.value
    });
  };

  const handleDayChange = (value: string) => {
    setLocalSettings({
      ...localSettings,
      scheduleDay: parseInt(value)
    });
  };

  const handleAutoSyncToggle = () => {
    setLocalSettings({
      ...localSettings,
      autoSyncNewRecords: !localSettings.autoSyncNewRecords
    });
  };

  const handleConflictStrategyChange = (value: string) => {
    setLocalSettings({
      ...localSettings,
      conflictResolutionStrategy: value as SyncSettings['conflictResolutionStrategy']
    });
  };

  const saveSettings = () => {
    updateSettings(localSettings);
    toast({
      title: "Settings saved",
      description: "Your synchronization settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Entities to Synchronize</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="sync-customers" 
              checked={localSettings.entities.customers} 
              onCheckedChange={() => handleEntityToggle('customers')}
            />
            <Label htmlFor="sync-customers">Customers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="sync-items" 
              checked={localSettings.entities.items} 
              onCheckedChange={() => handleEntityToggle('items')}
            />
            <Label htmlFor="sync-items">Inventory Items</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="sync-invoices" 
              checked={localSettings.entities.invoices} 
              onCheckedChange={() => handleEntityToggle('invoices')}
            />
            <Label htmlFor="sync-invoices">Invoices</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="sync-payments" 
              checked={localSettings.entities.payments} 
              onCheckedChange={() => handleEntityToggle('payments')}
            />
            <Label htmlFor="sync-payments">Payments</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="sync-bills" 
              checked={localSettings.entities.bills} 
              onCheckedChange={() => handleEntityToggle('bills')}
            />
            <Label htmlFor="sync-bills">Bills</Label>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Sync Schedule</h3>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sync-frequency">Sync Frequency</Label>
              <Select 
                value={localSettings.frequency} 
                onValueChange={handleFrequencyChange}
              >
                <SelectTrigger id="sync-frequency" className="mt-1">
                  <SelectValue placeholder="Select a frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Only</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(localSettings.frequency === 'daily' || localSettings.frequency === 'weekly') && (
              <div>
                <Label htmlFor="schedule-time">Time of Day</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={localSettings.scheduleTime || ""}
                  onChange={handleTimeChange}
                  className="mt-1"
                />
              </div>
            )}
            
            {localSettings.frequency === 'weekly' && (
              <div>
                <Label htmlFor="schedule-day">Day of Week</Label>
                <Select 
                  value={localSettings.scheduleDay?.toString() || "1"} 
                  onValueChange={handleDayChange}
                >
                  <SelectTrigger id="schedule-day" className="mt-1">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                    <SelectItem value="0">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-sync" 
              checked={localSettings.autoSyncNewRecords} 
              onCheckedChange={handleAutoSyncToggle}
            />
            <Label htmlFor="auto-sync">Automatically sync new records as they are created</Label>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Conflict Resolution</h3>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="conflict-strategy">When records conflict between systems:</Label>
            <Select 
              value={localSettings.conflictResolutionStrategy} 
              onValueChange={handleConflictStrategyChange}
            >
              <SelectTrigger id="conflict-strategy" className="mt-1">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qbo_wins">QuickBooks data takes precedence</SelectItem>
                <SelectItem value="batchly_wins">Batchly data takes precedence</SelectItem>
                <SelectItem value="newest_wins">Most recently modified record wins</SelectItem>
                <SelectItem value="ask">Ask me for each conflict</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Be careful with conflict resolution settings!</p>
              <p className="mt-1">Incorrect settings could result in data loss or duplication between systems.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>
    </div>
  );
};
