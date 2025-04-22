
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

    // Handle filtering first
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        if (column.includes('.')) {
          // For nested field filtering
          const [relationTable, relationField] = column.split('.');
          // Use the proper filter syntax for nested fields
          query = query.filter(`${relationTable}.${relationField}`, 'ilike', `%${value}%`);
        } else {
          // Regular field filtering
          query = query.ilike(column, `%${value}%`);
        }
      }
    });
    
    // Handle sorting after applying filters
    if (sortConfig.column.includes('.')) {
      // For nested field sorting, use the optimized orderBy method
      const [relationTable, relationField] = sortConfig.column.split('.');
      
      // Use orderBy for related fields
      query = query.order(`${relationTable}(${relationField})`, { 
        ascending: sortConfig.direction === "asc" 
      });
    } else {
      // Standard column sorting
      query = query.order(sortConfig.column, { 
        ascending: sortConfig.direction === "asc" 
      });
    }

    // Execute the query
    const { data, error } = await query;
    if (error) {
      console.error(`Supabase query error for ${tableName}:`, error);
      throw error;
    }
    
    console.log(`Query results for ${tableName}:`, data);
    return data as T[];
  };
};
