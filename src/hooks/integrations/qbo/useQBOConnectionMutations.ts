
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useDevMode } from '@/contexts/DevModeContext';
import { useAuth } from '@/contexts/AuthContext';

export const useQBOConnectionMutations = (organizationId?: string) => {
  const { isDevMode } = useDevMode();

  // OAuth mutation
  const oauthMutation = useMutation({
    mutationFn: async () => {
      if (!organizationId) throw new Error('Organization ID is required');
      if (isDevMode) return { success: true, authUrl: '#' };
      const { data, error } = await supabase.functions.invoke('qbo-oauth', {
        body: {
          organizationId,
          environment: 'production',
          redirectUri: `${window.location.origin}/settings/integrations`
        },
        method: 'POST'
      });
      if (error) throw error;
      return data;
    }
  });

  // Disconnect
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!organizationId) throw new Error('Organization ID required');
      if (isDevMode) return { success: true };
      const { data, error } = await supabase.functions.invoke('qbo-oauth', {
        body: { organizationId, action: 'disconnect' },
        method: 'POST'
      });
      if (error) throw error;
      return data;
    }
  });

  // NEW: Refresh QBO Token
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      if (!organizationId) throw new Error('Organization ID required');
      if (isDevMode) {
        // Simulate refresh delay
        await new Promise(r => setTimeout(r, 1000));
        return { success: true, expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString() };
      }
      const { data, error } = await supabase.functions.invoke('qbo-oauth', {
        body: { organizationId, action: 'refresh' },
        method: 'POST'
      });
      if (error) throw error;
      return data;
    }
  });

  return { oauthMutation, disconnectMutation, refreshTokenMutation };
};
