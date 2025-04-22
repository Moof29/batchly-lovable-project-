import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { TimeEntriesTable } from "@/components/time-tracking/TimeEntriesTable";

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
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Time Tracking</h1>
          <p className="text-sm text-muted-foreground">Track and manage employee time entries</p>
        </div>
        <Button asChild>
          <Link to="/people/time-tracking/new">
            <Plus className="mr-2 h-4 w-4" />
            New Time Entry
          </Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader className="py-4">
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading time entries...</div>
            </div>
          ) : (
            <TimeEntriesTable
              timeEntries={timeEntries || []}
              sorting={sorting}
              filters={filters}
              onSort={handleSort}
              onFilter={handleFilter}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
