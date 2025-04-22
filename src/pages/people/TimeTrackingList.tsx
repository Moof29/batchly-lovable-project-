
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
import { Plus, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { FilterDropdown } from "@/components/common/FilterDropdown";

export const TimeTrackingList = () => {
  const [sorting, setSorting] = useState({ column: "date", direction: "desc" as "asc" | "desc" });
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  const { data: timeEntries, isLoading } = useTimeTracking(sorting, filters);

  const handleSort = (column: string) => {
    setSorting(prev => ({
      column,
      direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleFilter = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value,
    }));
  };

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
            <div className="flex items-center justify-center h-32">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("date")}
                        className="flex items-center hover:text-primary"
                      >
                        Date
                        {sorting.column === "date" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("employee_profile.last_name")}
                        className="flex items-center hover:text-primary"
                      >
                        Employee
                        {sorting.column === "employee_profile.last_name" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters["employee_profile.last_name"] || ""}
                        onChange={(value) => handleFilter("employee_profile.last_name", value)}
                        placeholder="Filter employees..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("customer_profile.display_name")}
                        className="flex items-center hover:text-primary"
                      >
                        Customer
                        {sorting.column === "customer_profile.display_name" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters["customer_profile.display_name"] || ""}
                        onChange={(value) => handleFilter("customer_profile.display_name", value)}
                        placeholder="Filter customers..."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("hours")}
                        className="flex items-center hover:text-primary"
                      >
                        Hours
                        {sorting.column === "hours" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSort("billable")}
                        className="flex items-center hover:text-primary"
                      >
                        Status
                        {sorting.column === "billable" && (
                          sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                        )}
                      </button>
                      <FilterDropdown
                        value={filters.billable || ""}
                        onChange={(value) => handleFilter("billable", value)}
                        placeholder="Filter status..."
                      />
                    </div>
                  </TableHead>
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
