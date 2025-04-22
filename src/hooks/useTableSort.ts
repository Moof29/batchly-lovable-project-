
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

// Create a type that represents all table names in the database
type TableNames = keyof Database["public"]["Tables"];

export const useTableSort = <T>(
  tableName: TableNames,
  sortConfig: SortConfig,
  filters: Record<string, string> = {},
  extraSelects: string = "*"
) => {
  return async () => {
    console.log(`Sorting ${tableName} by:`, sortConfig);
    
    // Create the base query
    let query = supabase
      .from(tableName)
      .select(extraSelects);

    // Check if we're sorting by a nested field (contains a dot)
    if (sortConfig.column.includes('.')) {
      // First get all records
      const { data: allData, error: fetchError } = await query;
      
      if (fetchError) {
        console.error(`Supabase fetch error for ${tableName}:`, fetchError);
        throw fetchError;
      }

      // Then sort them manually in JavaScript
      const sortedData = allData?.sort((a, b) => {
        const aValue = sortConfig.column.split('.').reduce((obj, key) => obj?.[key], a) || '';
        const bValue = sortConfig.column.split('.').reduce((obj, key) => obj?.[key], b) || '';
        
        if (sortConfig.direction === "asc") {
          return String(aValue).localeCompare(String(bValue));
        } else {
          return String(bValue).localeCompare(String(aValue));
        }
      });

      console.log(`Manually sorted ${tableName} results:`, sortedData);
      return sortedData;
    } else {
      // For other columns, use Supabase's sorting
      query = query.order(sortConfig.column, { ascending: sortConfig.direction === "asc" });
      
      // Apply filters
      Object.entries(filters).forEach(([column, value]) => {
        if (value) {
          if (column.includes('.')) {
            query = query.ilike(column, `%${value}%`);
          } else {
            query = query.ilike(column, `%${value}%`);
          }
        }
      });

      const { data, error } = await query;
      if (error) {
        console.error(`Supabase query error for ${tableName}:`, error);
        throw error;
      }
      
      console.log(`Query results for ${tableName}:`, data);
      return data as T[];
    }
  };
};
