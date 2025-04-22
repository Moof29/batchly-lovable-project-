import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useQBOEntityStatus = (organizationId?: string) =>
  useCallback(async (entityType: string) => {
    if (!organizationId) return { pending: 0, syncing: 0, synced: 0, error: 0, total: 0 };
    
    // Map entity type to table name
    const tableMap: Record<string, string> = {
      'customer_profile': 'customer_profile',
      'vendor_profile': 'vendor_profile',
      'item_record': 'item_record',
      'invoice_record': 'invoice_record',
      'bill_record': 'bill_record',
      'payment_receipt': 'payment_receipt'
    };
    
    const tableName = tableMap[entityType];
    if (!tableName) return { pending: 0, syncing: 0, synced: 0, error: 0, total: 0 };
    
    try {
      // Need to manually count since the group function isn't available
      const statuses = ['pending', 'syncing', 'synced', 'error'];
      const counts = {
        pending: 0,
        syncing: 0,
        synced: 0,
        error: 0,
        total: 0
      };
      
      // Get total count
      const { count: totalCount } = await supabase
        .from(tableName as any) // Type cast to work around the typing issue
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId);
      
      counts.total = totalCount || 0;
      
      // Get individual status counts
      for (const status of statuses) {
        const { count } = await supabase
          .from(tableName as any) // Type cast to work around the typing issue
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organizationId)
          .eq('qbo_sync_status', status);
        
        counts[status as keyof typeof counts] = count || 0;
      }
      
      return counts;
    } catch (error) {
      console.error(`Error fetching sync status counts for ${entityType}:`, error);
      return { pending: 0, syncing: 0, synced: 0, error: 0, total: 0 };
    }
  }, [organizationId]);
