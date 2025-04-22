
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useAccountsReceivable = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  // Make sure we're including customer information in the query
  const sortTable = useTableSort<any>(
    "invoice_record",
    sorting,
    filters,
    "*, customer_profile(*)"
  );

  return useQuery({
    queryKey: ["accounts-receivable", sorting, filters],
    queryFn: sortTable
  });
};
