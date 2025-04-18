
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, CircleDot, Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RoleComparisonModalProps {
  open: boolean;
  onClose: () => void;
}

export const RoleComparisonModal: React.FC<RoleComparisonModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Role Permission Comparison</DialogTitle>
          <DialogDescription>
            See how different roles compare in terms of system access and permissions
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="rounded-md border border-gray-200">
              <div className="bg-brand-50 p-4 border-b border-gray-200">
                <h3 className="font-medium">Role Hierarchy Explanation</h3>
              </div>
              <div className="p-4">
                <p className="text-sm mb-4">Batchly uses a role-based access control system with five hierarchical roles. Higher roles inherit all permissions from lower roles.</p>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-medium text-purple-800">Administrator</span>
                    <span className="ml-2 text-sm text-gray-600">(Highest access - complete control over the entire system)</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">Sales Manager</span>
                    <span className="ml-2 text-sm text-gray-600">(High access - manage sales operations and customer data)</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Warehouse Staff</span>
                    <span className="ml-2 text-sm text-gray-600">(Medium access - manage inventory and purchase orders)</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Delivery Driver</span>
                    <span className="ml-2 text-sm text-gray-600">(Limited access - manage deliveries and view routes)</span>
                  </div>
                  
                  <div className="flex items-center">
                    <ShieldX className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-800">Customer Service</span>
                    <span className="ml-2 text-sm text-gray-600">(Basic access - view customer data and process returns)</span>
                  </div>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[250px]">Permission / Feature</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                  <TableHead className="text-center">Sales Manager</TableHead>
                  <TableHead className="text-center">Warehouse Staff</TableHead>
                  <TableHead className="text-center">Delivery Driver</TableHead>
                  <TableHead className="text-center">Customer Service</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* QuickBooks Integration */}
                <TableRow className="bg-brand-50/30">
                  <TableCell className="font-medium">QuickBooks Integration</TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                </TableRow>

                {/* User Management */}
                <TableRow>
                  <TableCell className="font-medium">User Management</TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                </TableRow>
                
                {/* Sales */}
                <TableRow>
                  <TableCell className="font-medium">Manage Sales Orders</TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><CircleDot className="h-5 w-5 text-amber-500 mx-auto" title="View only" /></TableCell>
                </TableRow>

                {/* Inventory */}
                <TableRow>
                  <TableCell className="font-medium">Manage Inventory</TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><CircleDot className="h-5 w-5 text-amber-500 mx-auto" title="View only" /></TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                </TableRow>

                {/* Customer Management */}
                <TableRow>
                  <TableCell className="font-medium">Manage Customers</TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><CircleDot className="h-5 w-5 text-amber-500 mx-auto" title="View only" /></TableCell>
                </TableRow>

                {/* Delivery Routes */}
                <TableRow>
                  <TableCell className="font-medium">Manage Deliveries</TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><CircleDot className="h-5 w-5 text-amber-500 mx-auto" title="View only" /></TableCell>
                  <TableCell className="text-center"><CircleDot className="h-5 w-5 text-amber-500 mx-auto" title="View only" /></TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                </TableRow>

                {/* Reports */}
                <TableRow>
                  <TableCell className="font-medium">View All Reports</TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><CircleDot className="h-5 w-5 text-amber-500 mx-auto" title="Sales reports only" /></TableCell>
                  <TableCell className="text-center"><CircleDot className="h-5 w-5 text-amber-500 mx-auto" title="Inventory reports only" /></TableCell>
                  <TableCell className="text-center"><CircleDot className="h-5 w-5 text-amber-500 mx-auto" title="Delivery reports only" /></TableCell>
                  <TableCell className="text-center"><CircleDot className="h-5 w-5 text-amber-500 mx-auto" title="Customer reports only" /></TableCell>
                </TableRow>

                {/* Company Settings */}
                <TableRow className="bg-brand-50/30">
                  <TableCell className="font-medium">Company Settings</TableCell>
                  <TableCell className="text-center"><CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                  <TableCell className="text-center"><XCircle className="h-5 w-5 text-red-400 mx-auto" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                <span>Full Access</span>
              </div>
              <div className="flex items-center">
                <CircleDot className="h-4 w-4 text-amber-500 mr-1" />
                <span>Limited Access</span>
              </div>
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-red-400 mr-1" />
                <span>No Access</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
