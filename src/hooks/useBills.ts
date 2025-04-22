
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useBills = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  const sortTable = useTableSort(
    "bill_record",
    sorting,
    filters,
    "*, vendor_profile(display_name), vendor_id"
  );

  return useQuery({
    queryKey: ["bills", sorting, filters],
    queryFn: sortTable
  });
};
