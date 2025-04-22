import { useEffect, useState } from "react";
import { categorizeError } from "@/services/qbo/entities/categorizeError";
import { SyncError } from "@/types/qbo";

// Define types for better error handling
export interface QBOSyncError extends SyncError {
  category: string;
  occurrenceCount?: number;
  code?: string;
  affectedRecords?: number;
  suggestedResolution?: string;
}

/**
 * Enhanced hook to handle QBO error list with improved categorization and filtering
 */
export const useQBOErrorsList = (errorsQueryData: any) => {
  const [syncErrors, setSyncErrors] = useState<QBOSyncError[]>([]);
  const [filteredErrors, setFilteredErrors] = useState<QBOSyncError[]>([]);
  const [filters, setFilters] = useState({
    category: "all",
    entityType: "all",
    resolved: false
  });

  // Process and categorize errors
  useEffect(() => {
    if (!errorsQueryData) {
      setSyncErrors([]);
      return;
    }

    const processedErrors = errorsQueryData.map((err: any) => {
      // Map entity type based on error category or context
      let entityType = 'unknown';
      if (err.entity_type) {
        entityType = err.entity_type;
      } else if (err.error_category === 'data') {
        entityType = 'items';
      } else if (err.error_category === 'validation') {
        entityType = 'customers';
      } else if (err.error_category === 'auth') {
        entityType = 'connection';
      } else {
        entityType = 'system';
      }

      const category = err.error_category || categorizeError(err.error_message || "unknown error");

      return {
        id: err.id,
        entityType,
        message: err.error_message || err.message,
        category,
        timestamp: new Date(err.last_occurred_at || err.timestamp),
        resolved: err.is_resolved || false,
        occurrenceCount: err.occurrence_count || 1,
        code: err.error_code,
        affectedRecords: err.affected_records || 0,
        suggestedResolution: err.suggested_resolution
      };
    });

    setSyncErrors(processedErrors);
  }, [errorsQueryData]);

  // Apply filters to errors
  useEffect(() => {
    let result = [...syncErrors];

    if (filters.category !== "all") {
      result = result.filter(err => err.category === filters.category);
    }
    
    if (filters.entityType !== "all") {
      result = result.filter(err => err.entityType === filters.entityType);
    }

    if (!filters.resolved) {
      result = result.filter(err => !err.resolved);
    }

    setFilteredErrors(result);
  }, [syncErrors, filters]);

  // Update filters
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Get error statistics
  const getErrorStats = () => {
    const categories = syncErrors.reduce((acc: Record<string, number>, err) => {
      if (!acc[err.category]) acc[err.category] = 0;
      acc[err.category] += 1;
      return acc;
    }, {});

    const entityTypes = syncErrors.reduce((acc: Record<string, number>, err) => {
      if (!acc[err.entityType]) acc[err.entityType] = 0;
      acc[err.entityType] += 1;
      return acc;
    }, {});

    return {
      totalErrors: syncErrors.length,
      unresolvedErrors: syncErrors.filter(e => !e.resolved).length,
      categories,
      entityTypes
    };
  };

  return {
    errors: filteredErrors,
    allErrors: syncErrors,
    stats: getErrorStats(),
    filters,
    updateFilters
  };
};
