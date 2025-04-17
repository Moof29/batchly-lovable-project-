
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const TimeTrackingList = () => {
  const { data: timeEntries, isLoading } = useQuery({
    queryKey: ["timeEntries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_time_tracking")
        .select(`
          *,
          employee_profile:employee_id(first_name, last_name),
          customer_profile:customer_id(display_name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Time Tracking</h1>
        <Button asChild>
          <Link to="/people/time-tracking/new">
            <Plus className="mr-2 h-4 w-4" />
            New Time Entry
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {entry.employee_profile?.first_name} {entry.employee_profile?.last_name}
                    </TableCell>
                    <TableCell>{entry.customer_profile?.display_name}</TableCell>
                    <TableCell>{entry.hours}</TableCell>
                    <TableCell className="capitalize">
                      {entry.billable ? 'Billable' : 'Non-billable'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" asChild>
                        <Link to={`/people/time-tracking/${entry.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
