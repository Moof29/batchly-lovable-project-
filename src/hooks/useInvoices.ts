
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useInvoices = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  const sortTable = useTableSort(
    "invoice_record",
    sorting,
    filters,
    "*, customer_profile(display_name)"
  );

  return useQuery({
    queryKey: ["invoices", sorting, filters],
    queryFn: sortTable
  });
};
