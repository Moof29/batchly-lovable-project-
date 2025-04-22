
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useTimeTracking = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  const sortTable = useTableSort(
    "employee_time_tracking",
    sorting,
    filters,
    "*, employee_profile(first_name, last_name), customer_profile(display_name)"
  );

  return useQuery({
    queryKey: ["timeEntries", sorting, filters],
    queryFn: sortTable
  });
};
