
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useCustomers = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  const sortTable = useTableSort(
    "customer_profile",
    sorting,
    filters
  );

  return useQuery({
    queryKey: ["customers", sorting, filters],
    queryFn: sortTable
  });
};
