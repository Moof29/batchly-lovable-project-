
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useBills = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  // Make sure we're including all necessary related tables in the query
  const sortTable = useTableSort(
    "bill_record",
    sorting,
    filters,
    "*, vendor_profile(*)"
  );

  return useQuery({
    queryKey: ["bills", sorting, filters],
    queryFn: sortTable
  });
};
