
import { useDevMode } from '@/contexts/DevModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SyncError } from '@/types/qbo';

export const useQBOErrorsQuery = (organizationId?: string, enabled?: boolean) => {
  const { isDevMode } = useDevMode();
  return useQuery({
    queryKey: ['qbo', 'errors', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      if (isDevMode) {
        return [
          {
            id: 'err-1',
            entityType: 'invoices' as 'invoices',
            message: 'Invoice #INV-2023-0547 failed: Invalid customer reference',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            resolved: false
          },
          {
            id: 'err-2',
            entityType: 'items' as 'items',
            message: 'Item SKU-7744 failed to sync: Duplicate SKU in QuickBooks',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            resolved: false
          }
        ] as SyncError[];
      }
      const { data, error } = await supabase
        .from('qbo_error_registry')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_resolved', false)
        .order('last_occurred_at', { ascending: false })
        .limit(10);
      if (error) { console.error("QBO errors", error); return []; }
      return data.map(err => ({
        id: err.id,
        entityType: err.error_category === 'data'
          ? 'items'
          : err.error_category === 'validation'
            ? 'customers'
            : err.error_category === 'auth'
              ? 'invoices'
              : 'bills',
        message: err.error_message,
        timestamp: new Date(err.last_occurred_at),
        resolved: err.is_resolved
      }));
    },
    enabled,
    refetchInterval: 30000,
  });
};
