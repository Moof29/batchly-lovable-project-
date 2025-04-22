
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

    // Handle sorting
    if (sortConfig.column.includes('.')) {
      // For nested field sorting, we need to handle it differently
      const [relationTable, relationField] = sortConfig.column.split('.');
      
      // Use the orderBy method for related fields, which is more efficient
      query = query.order(`${relationTable}(${relationField})`, { 
        ascending: sortConfig.direction === "asc" 
      });
    } else {
      // For regular fields, use standard ordering
      query = query.order(sortConfig.column, { 
        ascending: sortConfig.direction === "asc" 
      });
    }
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        if (column.includes('.')) {
          // For nested field filtering, we need a different approach
          const [relationTable, relationField] = column.split('.');
          
          // Use the proper filter syntax for nested fields
          query = query.filter(`${relationTable}.${relationField}`, 'ilike', `%${value}%`);
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
  };
};
