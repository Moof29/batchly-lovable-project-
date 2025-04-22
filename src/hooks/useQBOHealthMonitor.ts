
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

type HealthStatus = 'healthy' | 'degraded' | 'unavailable';

interface QBOHealthMetrics {
  status: HealthStatus;
  responseTime: number | null;
  errorRate: number; // percentage
  lastChecked: Date;
  serviceComponents: {
    auth: HealthStatus;
    customer: HealthStatus;
    invoice: HealthStatus;
    bill: HealthStatus;
  };
  failedOperations24h: number;
  successRate24h: number; // percentage
}

export const useQBOHealthMonitor = (organizationId?: string) => {
  const [health, setHealth] = useState<QBOHealthMetrics>({
    status: 'healthy',
    responseTime: null,
    errorRate: 0,
    lastChecked: new Date(),
    serviceComponents: {
      auth: 'healthy',
      customer: 'healthy',
      invoice: 'healthy',
      bill: 'healthy'
    },
    failedOperations24h: 0,
    successRate24h: 100
  });

  // Query to get error information
  const { data: errorData } = useQuery({
    queryKey: ['qbo', 'healthErrorMetrics', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;

      // Get timestamp for 24 hours ago
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayISO = yesterday.toISOString();

      // Get all operations in the last 24 hours
      const { data: operations, error: opsError } = await supabase
        .from('qbo_sync_operation')
        .select('status')
        .eq('organization_id', organizationId)
        .gte('created_at', yesterdayISO);

      if (opsError) throw opsError;

      // Get errors in the last 24 hours
      const { data: errors, error: errError } = await supabase
        .from('qbo_error_registry')
        .select('error_category, last_occurred_at')
        .eq('organization_id', organizationId)
        .gte('last_occurred_at', yesterdayISO);

      if (errError) throw errError;

      // Calculate metrics
      const totalOps = operations?.length || 0;
      const failedOps = operations?.filter(op => op.status === 'failed').length || 0;
      const successRate = totalOps > 0 ? ((totalOps - failedOps) / totalOps) * 100 : 100;

      // Count errors by category
      const errorsByCategory: Record<string, number> = {};
      errors?.forEach(err => {
        errorsByCategory[err.error_category] = (errorsByCategory[err.error_category] || 0) + 1;
      });

      return {
        totalOperations: totalOps,
        failedOperations: failedOps,
        successRate,
        errorsByCategory,
        errors
      };
    },
    enabled: !!organizationId,
    refetchInterval: 5 * 60 * 1000 // 5 minutes
  });

  // Effect to update health metrics based on error data
  useEffect(() => {
    if (errorData) {
      const componentHealth: Record<string, HealthStatus> = {
        auth: 'healthy',
        customer: 'healthy',
        invoice: 'healthy',
        bill: 'healthy'
      };

      // Determine component health based on errors
      if (errorData.errors) {
        errorData.errors.forEach((err: any) => {
          if (err.error_category === 'auth') {
            componentHealth.auth = 'degraded';
          }
          // Map other error categories to components based on your logic
          // This is a simplified example
        });
      }

      // Calculate overall status
      let overallStatus: HealthStatus = 'healthy';
      if (errorData.successRate < 50) {
        overallStatus = 'unavailable';
      } else if (errorData.successRate < 90) {
        overallStatus = 'degraded';
      }

      setHealth({
        status: overallStatus,
        responseTime: null, // Would come from actual API measurements
        errorRate: 100 - errorData.successRate,
        lastChecked: new Date(),
        serviceComponents: {
          auth: componentHealth.auth,
          customer: componentHealth.customer,
          invoice: componentHealth.invoice,
          bill: componentHealth.bill
        },
        failedOperations24h: errorData.failedOperations,
        successRate24h: errorData.successRate
      });
    }
  }, [errorData]);

  return {
    health,
    isHealthy: health.status === 'healthy',
    isDegraded: health.status === 'degraded',
    isUnavailable: health.status === 'unavailable'
  };
};
