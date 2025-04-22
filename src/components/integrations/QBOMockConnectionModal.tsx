import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface QBOMockConnectionModalProps {
  open: boolean;
  isOpen?: boolean; // Added for backward compatibility
  onClose: () => void;
}

export const QBOMockConnectionModal: React.FC<QBOMockConnectionModalProps> = ({
  open,
  isOpen,
  onClose
}) => {
  // Use either open or isOpen prop
  const isDialogOpen = open || isOpen || false;

  const [mockSettings, setMockSettings] = useState({
    enabled: true,
    companyName: "Acme Test Company",
    companyId: "1234567890",
    responseDelay: 500,
    simulateErrors: false,
    errorRate: 10,
  });

  const handleSwitchChange = (field: string) => {
    setMockSettings({
      ...mockSettings,
      [field]: !mockSettings[field as keyof typeof mockSettings]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMockSettings({
      ...mockSettings,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const saveMockSettings = () => {
    // In a real app, this would save to your dev mode context/storage
    toast({
      title: "Mock Settings Saved",
      description: "QuickBooks Online mock configuration has been updated.",
    });
    onClose();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mock QBO Integration</DialogTitle>
          <DialogDescription>
            Configure mock QuickBooks Online integration for development and testing purposes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p>This mock integration is for development purposes only.</p>
              <p className="mt-1">No data will be sent to or received from actual QuickBooks Online services.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mock-enabled">Enable Mock Integration</Label>
              <p className="text-sm text-muted-foreground">
                Turn on/off mock QBO integration
              </p>
            </div>
            <Switch
              id="mock-enabled"
              checked={mockSettings.enabled}
              onCheckedChange={() => handleSwitchChange('enabled')}
            />
          </div>
          
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="data">Mock Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  name="companyName"
                  value={mockSettings.companyName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-id">Company ID</Label>
                <Input
                  id="company-id"
                  name="companyId"
                  value={mockSettings.companyId}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="behavior" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="response-delay">Response Delay (ms)</Label>
                <Input
                  id="response-delay"
                  name="responseDelay"
                  type="number"
                  min={0}
                  max={10000}
                  value={mockSettings.responseDelay}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Simulate API response delay in milliseconds
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="simulate-errors">Simulate Errors</Label>
                  <p className="text-xs text-muted-foreground">
                    Randomly generate sync errors
                  </p>
                </div>
                <Switch
                  id="simulate-errors"
                  checked={mockSettings.simulateErrors}
                  onCheckedChange={() => handleSwitchChange('simulateErrors')}
                />
              </div>
              
              {mockSettings.simulateErrors && (
                <div className="space-y-2">
                  <Label htmlFor="error-rate">Error Rate (%)</Label>
                  <Input
                    id="error-rate"
                    name="errorRate"
                    type="number"
                    min={0}
                    max={100}
                    value={mockSettings.errorRate}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="data" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline">Generate Sample Data</Button>
                <Button variant="outline">Reset Mock Data</Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Current mock data size:</p>
                <ul className="list-disc list-inside mt-2 pl-2">
                  <li>Customers: 255</li>
                  <li>Products/Services: 890</li>
                  <li>Invoices: 452</li>
                  <li>Payments: 320</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={saveMockSettings}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
