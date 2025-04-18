
import React, { useState } from 'react';
import { useDevMode } from '@/contexts/DevModeContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from './ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UserRole } from '@/types/auth';
import { Bug, RefreshCcw, X } from 'lucide-react';
import { Card } from './ui/card';

export const DevModeToggle: React.FC = () => {
  const { isDevMode, toggleDevMode, devRole, setDevRole, resetDevMode } = useDevMode();
  const [isMinimized, setIsMinimized] = useState(false);

  const roles: { value: UserRole; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'sales_manager', label: 'Sales Manager' },
    { value: 'warehouse_staff', label: 'Warehouse Staff' },
    { value: 'delivery_driver', label: 'Delivery Driver' },
    { value: 'customer_service', label: 'Customer Service' }
  ];

  return (
    <Card className={`fixed top-4 right-4 z-50 shadow-xl border-2 ${isDevMode ? 'border-purple-500' : 'border-gray-200'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bug className={`h-5 w-5 ${isDevMode ? 'text-purple-600' : 'text-gray-600'}`} />
            <span className="font-semibold">Development Mode</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDevMode}
              className="h-8 w-8 p-0"
              title="Reset Dev Mode"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className={isMinimized ? 'hidden' : ''}>
          <div className="flex items-center space-x-4 mb-4">
            <Label htmlFor="dev-mode">Enable Dev Mode</Label>
            <Switch
              id="dev-mode"
              checked={isDevMode}
              onCheckedChange={toggleDevMode}
              className={isDevMode ? "data-[state=checked]:bg-purple-500" : ""}
            />
          </div>

          {isDevMode && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-select" className="mb-2 block">Current Role:</Label>
                <Select value={devRole} onValueChange={setDevRole}>
                  <SelectTrigger id="role-select" className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5}>
                    <SelectGroup>
                      <SelectLabel>Available Roles</SelectLabel>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-purple-600 font-medium bg-purple-50 p-2 rounded">
                Dev Mode Active - Using role: {devRole}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
