
import { supabase } from "@/integrations/supabase/client";

interface PerformanceMetric {
  operation: string;
  entityType: string;
  durationMs: number;
  success: boolean;
  timestamp: Date;
  size?: number;
  errorType?: string;
}

interface MetricsRecord {
  organization_id: string;
  entity_type: string;
  operation_type: string;
  success: boolean;
  duration_ms: number;
  record_size_bytes?: number;
  error_type?: string;
  created_at: string;
}

/**
 * QBO Metrics Logger for tracking performance and reliability metrics
 */
export class QBOMetricsLogger {
  private organizationId: string | undefined;
  private metrics: PerformanceMetric[] = [];
  
  constructor(organizationId?: string) {
    this.organizationId = organizationId;
  }
  
  /**
   * Set the organization ID
   */
  setOrganizationId(orgId: string) {
    this.organizationId = orgId;
  }
  
  /**
   * Log a performance metric
   */
  logPerformance(metric: PerformanceMetric) {
    // Add to in-memory queue
    this.metrics.push(metric);
    
    // If we have enough metrics, flush them
    if (this.metrics.length >= 10) {
      this.flush();
    }
  }
  
  /**
   * Create a timer for measuring operation duration
   */
  startTimer(operation: string, entityType: string, size?: number) {
    const start = performance.now();
    
    return {
      stop: (success: boolean, errorType?: string) => {
        const end = performance.now();
        const durationMs = end - start;
        
        this.logPerformance({
          operation,
          entityType,
          durationMs,
          success,
          timestamp: new Date(),
          size,
          errorType
        });
        
        return durationMs;
      }
    };
  }
  
  /**
   * Flush metrics to the database
   */
  async flush() {
    if (!this.organizationId || this.metrics.length === 0) return;
    
    try {
      // Process metrics
      const now = new Date().toISOString();
      const metricsToInsert = this.metrics.map(metric => ({
        organization_id: this.organizationId,
        entity_type: metric.entityType,
        operation_type: metric.operation,
        success: metric.success,
        duration_ms: Math.round(metric.durationMs),
        record_size_bytes: metric.size,
        error_type: metric.errorType,
        created_at: now
      }));
      
      // Insert metrics
      // Note: We don't use a specific table since it may not exist yet
      // Instead, we log to console for now and can implement proper storage later
      console.log('QBO Metrics to store:', metricsToInsert);
      
      // Clear the processed metrics
      this.metrics = [];
      
      /* 
      // Code to use when the qbo_performance_metrics table is created:
      const { error } = await supabase
        .from('qbo_performance_metrics')
        .insert(metricsToInsert);
      
      if (error) {
        console.error('Failed to store QBO metrics:', error);
      } else {
        // Clear the processed metrics
        this.metrics = [];
      }
      */
    } catch (e) {
      console.error('Error flushing QBO metrics:', e);
    }
  }
  
  /**
   * Calculate aggregate metrics
   */
  async getAggregateMetrics(lookbackHours = 24) {
    if (!this.organizationId) return null;
    
    try {
      // For now, return mock data since we haven't created the specific table yet
      return {
        totalOperations: this.metrics.length,
        successfulOperations: this.metrics.filter(m => m.success).length,
        successRate: this.metrics.length > 0 ? 
          (this.metrics.filter(m => m.success).length / this.metrics.length) * 100 : 
          100,
        averageDurationMs: this.metrics.length > 0 ? 
          this.metrics.reduce((acc, curr) => acc + curr.durationMs, 0) / this.metrics.length : 
          0,
        durationByOperationType: this.getDurationByOperationType(),
        errorDistribution: this.getErrorDistribution()
      };
      
      /* 
      // Code to use when table is created:
      // Calculate time boundary
      const timeBoundary = new Date();
      timeBoundary.setHours(timeBoundary.getHours() - lookbackHours);
      
      // Get all metrics within the lookback period
      const { data, error } = await supabase
        .from('qbo_performance_metrics')
        .select('*')
        .eq('organization_id', this.organizationId)
        .gte('created_at', timeBoundary.toISOString());
        
      if (error) {
        console.error('Failed to retrieve QBO metrics:', error);
        return null;
      }
      
      // Calculate aggregate metrics
      const totalOperations = data.length;
      const successfulOperations = data.filter(m => m.success).length;
      
      // Average durations by operation type
      const opTypes = [...new Set(data.map(m => m.operation_type))];
      const durationByOp: Record<string, number> = {};
      
      opTypes.forEach(op => {
        const opsOfType = data.filter(m => m.operation_type === op);
        const avgDuration = opsOfType.reduce((acc, curr) => acc + curr.duration_ms, 0) / opsOfType.length;
        durationByOp[op] = Math.round(avgDuration);
      });
      
      // Error distribution
      const errorTypes = [...new Set(data.filter(m => !m.success).map(m => m.error_type))];
      const errorCounts: Record<string, number> = {};
      
      errorTypes.forEach(type => {
        if (type) {
          errorCounts[type] = data.filter(m => m.error_type === type).length;
        }
      });
      
      return {
        totalOperations,
        successfulOperations,
        successRate: totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0,
        averageDurationMs: data.reduce((acc, curr) => acc + curr.duration_ms, 0) / totalOperations,
        durationByOperationType: durationByOp,
        errorDistribution: errorCounts
      };
      */
    } catch (e) {
      console.error('Error calculating aggregate metrics:', e);
      return null;
    }
  }

  /**
   * Helper method to calculate duration by operation type
   */
  private getDurationByOperationType(): Record<string, number> {
    const operations = [...new Set(this.metrics.map(m => m.operation))];
    const result: Record<string, number> = {};

    operations.forEach(op => {
      const metricsForOp = this.metrics.filter(m => m.operation === op);
      const avgDuration = metricsForOp.reduce((acc, curr) => acc + curr.durationMs, 0) / metricsForOp.length;
      result[op] = Math.round(avgDuration);
    });

    return result;
  }

  /**
   * Helper method to calculate error distribution
   */
  private getErrorDistribution(): Record<string, number> {
    const errors = this.metrics.filter(m => !m.success);
    const errorTypes = [...new Set(errors.map(m => m.errorType || 'unknown'))];
    const result: Record<string, number> = {};

    errorTypes.forEach(type => {
      result[type] = errors.filter(m => m.errorType === type).length;
    });

    return result;
  }
}

// Export a singleton instance
export const qboMetricsLogger = new QBOMetricsLogger();
