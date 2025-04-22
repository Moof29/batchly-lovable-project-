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
import { Bug, RefreshCcw, Home, MinusCircle, GripHorizontal } from 'lucide-react';
import { Card } from './ui/card';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';

export const DevModeToggle: React.FC = () => {
  const { isDevMode, toggleDevMode, devRole, setDevRole, resetDevMode } = useDevMode();
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();

  const roles: { value: UserRole; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'sales_manager', label: 'Sales Manager' },
    { value: 'warehouse_staff', label: 'Warehouse Staff' },
    { value: 'delivery_driver', label: 'Delivery Driver' },
    { value: 'customer_service', label: 'Customer Service' }
  ];

  const handleGoToDashboard = () => {
    console.log("Navigating to dashboard");
    navigate('/dashboard');
  };

  return (
    <Draggable handle=".drag-handle" bounds="body">
      <Card className={`fixed top-4 right-4 z-[9999] shadow-xl border-2 ${isDevMode ? 'border-purple-500' : 'border-gray-200'}`} style={{ maxWidth: '300px' }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="drag-handle cursor-move p-1">
                <GripHorizontal className="h-4 w-4 text-gray-400" />
              </div>
              <Bug className={`h-5 w-5 ${isDevMode ? 'text-purple-600' : 'text-gray-600'}`} />
              <span className="font-semibold">Dev Mode</span>
            </div>
            <div className="flex items-center space-x-2">
              {!isMinimized && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8 p-0"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              )}
              {isMinimized && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                  className="h-8 w-8 p-0"
                >
                  <Bug className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className={isMinimized ? 'hidden' : ''}>
            <div className="flex items-center space-x-4 mb-4">
              <Label htmlFor="dev-mode">Enable</Label>
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
                  <Label htmlFor="role-select" className="mb-2 block">Role:</Label>
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

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetDevMode}
                    className="flex-1"
                  >
                    <RefreshCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleGoToDashboard}
                    className="flex-1"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Draggable>
  );
};
