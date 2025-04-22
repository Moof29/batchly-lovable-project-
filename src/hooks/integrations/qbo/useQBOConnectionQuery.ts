
import { useDevMode } from '@/contexts/DevModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useQBOConnectionQuery = () => {
  const { user } = useAuth();
  const { isDevMode } = useDevMode();
  const organizationId = user?.organization_id || (isDevMode ? "00000000-0000-0000-0000-000000000000" : undefined);

  return useQuery({
    queryKey: ['qbo', 'connection', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      if (isDevMode) {
        const mockConfig = localStorage.getItem('batchly-mock-qbo');
        if (mockConfig) return JSON.parse(mockConfig);
        return null;
      }
      const { data, error } = await supabase
        .from('qbo_connection')
        .select('*')
        .eq('organization_id', organizationId)
        .maybeSingle();
      if (error) { console.error("QBO connection error", error); return null; }
      return data;
    },
    enabled: !!organizationId,
    refetchInterval: 300000,
  });
};
