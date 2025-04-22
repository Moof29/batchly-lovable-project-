
import { useQuery } from "@tanstack/react-query";
import { useTableSort } from "./useTableSort";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useItems = (sorting: SortConfig, filters: Record<string, string> = {}) => {
  const sortTable = useTableSort<any>(
    "item_record",
    sorting,
    filters,
    "*, item_pricing(price)"
  );

  return useQuery({
    queryKey: ["items", sorting, filters],
    queryFn: sortTable
  });
};
