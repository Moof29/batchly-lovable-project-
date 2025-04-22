
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useSalesOrders = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  const sortTable = useTableSort(
    "sales_order",
    sorting,
    filters,
    "*, customer_profile(display_name)"
  );

  return useQuery({
    queryKey: ["salesOrders", sorting, filters],
    queryFn: sortTable
  });
};
