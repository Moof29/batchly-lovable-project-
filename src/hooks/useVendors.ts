
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useVendors = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  const sortTable = useTableSort(
    "vendor_profile",
    sorting,
    filters
  );

  return useQuery({
    queryKey: ["vendors", sorting, filters],
    queryFn: sortTable
  });
};
