
import React from 'react';
import { useDevMode } from '@/contexts/DevModeContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Bug } from 'lucide-react';

export const DevModeToggle: React.FC = () => {
  const { isDevMode, toggleDevMode, devRole, setDevRole } = useDevMode();

  const handleRoleChange = (value: string) => {
    setDevRole(value as UserRole);
  };

  const roles: { value: UserRole, label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'sales_manager', label: 'Sales Manager' },
    { value: 'warehouse_staff', label: 'Warehouse Staff' },
    { value: 'delivery_driver', label: 'Delivery Driver' },
    { value: 'customer_service', label: 'Customer Service' }
  ];

  return (
    <div className={`fixed top-4 right-4 z-50 w-64 p-3 rounded-md shadow-lg transition-all ${isDevMode ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 border border-gray-200'}`}>
      <div className="flex items-center space-x-2 mb-2">
        <Bug className={`h-5 w-5 ${isDevMode ? 'text-purple-600' : 'text-gray-600'}`} />
        <Label htmlFor="dev-mode" className="font-medium">Dev Mode</Label>
        <Switch 
          id="dev-mode" 
          checked={isDevMode} 
          onCheckedChange={toggleDevMode}
          className={isDevMode ? "data-[state=checked]:bg-purple-500" : ""}
        />
      </div>
      
      {isDevMode && (
        <div className="mt-3 relative">
          <Label htmlFor="role-select" className="mb-1 block">Current Role:</Label>
          <Select value={devRole} onValueChange={handleRoleChange}>
            <SelectTrigger id="role-select" className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={5} className="z-[9999]">
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
      )}

      {isDevMode && (
        <div className="mt-3 text-xs text-purple-600 font-medium">
          Dev Mode Active - Bypassing authentication
        </div>
      )}
    </div>
  );
};
