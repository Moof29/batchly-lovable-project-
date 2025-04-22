
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useEmployees = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  const sortTable = useTableSort<any>(
    "employee_profile",
    sorting,
    filters
  );

  return useQuery({
    queryKey: ["employees", sorting, filters],
    queryFn: sortTable
  });
};
