
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

export const useBills = (sorting: SortConfig, filters: Record<string, string>) => {
  return useQuery({
    queryKey: ["bills", sorting, filters],
    queryFn: async () => {
      console.log("Sorting by:", sorting);
      
      let query = supabase
        .from("bill_record")
        .select("*, vendor_profile(display_name), vendor_id")
        .order(sorting.column === "vendor_profile.display_name" ? "vendor_profile.display_name" : sorting.column, { ascending: sorting.direction === "asc" });

      Object.entries(filters).forEach(([column, value]) => {
        if (value) {
          if (column === "vendor_profile.display_name") {
            query = query.ilike("vendor_profile.display_name", `%${value}%`);
          } else {
            query = query.ilike(column, `%${value}%`);
          }
        }
      });

      const { data, error } = await query;
      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }
      
      console.log("Query results:", data);
      return data;
    },
  });
};
