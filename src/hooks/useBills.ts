
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
      
      // Create the base query
      let query = supabase
        .from("bill_record")
        .select("*, vendor_profile(display_name), vendor_id");

      // Handle sorting differently for vendor_profile.display_name
      if (sorting.column === "vendor_profile.display_name") {
        // First get all records
        const { data: allData, error: fetchError } = await query;
        
        if (fetchError) {
          console.error("Supabase fetch error:", fetchError);
          throw fetchError;
        }

        // Then sort them manually in JavaScript
        const sortedData = allData?.sort((a, b) => {
          const aName = a.vendor_profile?.display_name || '';
          const bName = b.vendor_profile?.display_name || '';
          
          if (sorting.direction === "asc") {
            return aName.localeCompare(bName);
          } else {
            return bName.localeCompare(aName);
          }
        });

        console.log("Manually sorted results:", sortedData);
        return sortedData;
      } else {
        // For other columns, use Supabase's sorting
        query = query.order(sorting.column, { ascending: sorting.direction === "asc" });
        
        // Apply filters
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
      }
    },
  });
};
