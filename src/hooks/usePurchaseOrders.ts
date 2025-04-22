
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const usePurchaseOrders = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  const sortTable = useTableSort(
    "purchase_order",
    sorting,
    filters,
    "*, vendor_profile(display_name)"
  );

  return useQuery({
    queryKey: ["purchaseOrders", sorting, filters],
    queryFn: sortTable
  });
};
