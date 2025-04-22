
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useDevMode } from '@/contexts/DevModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { circuitBreakerManager } from '@/utils/circuitBreaker/CircuitBreakerManager';
import { auditService } from '@/utils/audit/AuditService';

export const useQBOConnectionMutations = (organizationId?: string) => {
  const { isDevMode } = useDevMode();
  const { user } = useAuth();

  // OAuth mutation
  const oauthMutation = useMutation({
    mutationFn: async () => {
      if (!organizationId) throw new Error('Organization ID is required');
      
      // Log the OAuth attempt
      auditService.logEvent({
        type: 'qbo.connection.established',
        organizationId,
        userId: user?.id,
        detail: { environment: 'production' }
      });
      
      if (isDevMode) return { success: true, authUrl: '#' };
      
      try {
        // Use circuit breaker for the API call
        const breaker = circuitBreakerManager.getBreaker('qbo-oauth', organizationId, 'qbo');
        
        return await breaker.exec(async () => {
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
        });
      } catch (error) {
        // Log the connection error
        auditService.logEvent({
          type: 'qbo.connection.failed',
          organizationId,
          userId: user?.id,
          severity: 'error',
          detail: { error: String(error) }
        });
        
        throw error;
      }
    }
  });

  // Disconnect
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!organizationId) throw new Error('Organization ID required');
      
      if (isDevMode) return { success: true };
      
      try {
        // Use circuit breaker for the API call
        const breaker = circuitBreakerManager.getBreaker('qbo-oauth', organizationId, 'qbo');
        
        const result = await breaker.exec(async () => {
          const { data, error } = await supabase.functions.invoke('qbo-oauth', {
            body: { organizationId, action: 'disconnect' },
            method: 'POST'
          });
          
          if (error) throw error;
          return data;
        });
        
        // Log the successful disconnection
        auditService.logEvent({
          type: 'qbo.connection.failed', // Using failed here as it's a disconnection
          organizationId,
          userId: user?.id,
          detail: { action: 'disconnect', result }
        });
        
        return result;
      } catch (error) {
        // Log the disconnect error
        auditService.logEvent({
          type: 'qbo.connection.failed',
          organizationId,
          userId: user?.id,
          severity: 'error',
          detail: { action: 'disconnect', error: String(error) }
        });
        
        throw error;
      }
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
      
      try {
        // Use circuit breaker for the API call
        const breaker = circuitBreakerManager.getBreaker('qbo-oauth', organizationId, 'qbo');
        
        const result = await breaker.exec(async () => {
          const { data, error } = await supabase.functions.invoke('qbo-oauth', {
            body: { organizationId, action: 'refresh' },
            method: 'POST'
          });
          
          if (error) throw error;
          return data;
        });
        
        // Log the token refresh
        auditService.logEvent({
          type: 'qbo.connection.refreshed',
          organizationId,
          userId: user?.id,
          detail: { 
            action: 'refresh', 
            expiresAt: result.expires_at 
          }
        });
        
        return result;
      } catch (error) {
        // Log the refresh error
        auditService.logEvent({
          type: 'qbo.connection.failed',
          organizationId,
          userId: user?.id,
          severity: 'error',
          detail: { action: 'refresh', error: String(error) }
        });
        
        throw error;
      }
    }
  });

  return { oauthMutation, disconnectMutation, refreshTokenMutation };
};
