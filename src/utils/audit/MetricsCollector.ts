
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export type MetricCategory = 'qbo' | 'portal' | 'system' | 'user';
export type MetricOperation = 'read' | 'create' | 'update' | 'delete' | 'sync' | 'auth' | 'export' | 'import';

interface MetricEvent {
  category: MetricCategory;
  operation: MetricOperation;
  entity_type?: string;
  success: boolean;
  duration_ms?: number;
  error_message?: string;
  metadata?: Record<string, any>;
}

/**
 * Collects metrics across the application for performance monitoring and auditing
 */
export class MetricsCollector {
  private static metricsQueue: MetricEvent[] = [];
  private static isProcessingQueue = false;
  private static flushInterval: number | null = null;
  private static organizationId?: string;
  
  /**
   * Initialize metrics collector with organization ID and auto-flush interval
   */
  static initialize(organizationId: string, flushIntervalMs = 30000) {
    this.organizationId = organizationId;
    
    // Clear any existing interval
    if (this.flushInterval !== null) {
      window.clearInterval(this.flushInterval);
    }
    
    // Set up automatic flushing of metrics
    this.flushInterval = window.setInterval(() => {
      this.flush().catch(err => {
        console.error('[MetricsCollector] Error flushing metrics:', err);
      });
    }, flushIntervalMs);
  }
  
  /**
   * Record a metric event
   */
  static record(event: MetricEvent) {
    if (!this.organizationId) {
      console.warn('[MetricsCollector] Not initialized with organization ID');
      return;
    }
    
    this.metricsQueue.push({
      ...event,
      // Timestamp added on server side
    });
    
    // Auto-flush if queue getting large
    if (this.metricsQueue.length >= 20) {
      this.flush().catch(err => {
        console.error('[MetricsCollector] Error flushing metrics:', err);
      });
    }
  }
  
  /**
   * Record QBO specific metrics
   */
  static recordQbo(operation: MetricOperation, entityType: string, success: boolean, durationMs?: number, errorMessage?: string, metadata?: Record<string, any>) {
    this.record({
      category: 'qbo',
      operation,
      entity_type: entityType,
      success,
      duration_ms: durationMs,
      error_message: errorMessage,
      metadata
    });
  }
  
  /**
   * Record Portal specific metrics
   */
  static recordPortal(operation: MetricOperation, entityType: string, success: boolean, durationMs?: number, errorMessage?: string, metadata?: Record<string, any>) {
    this.record({
      category: 'portal',
      operation,
      entity_type: entityType,
      success,
      duration_ms: durationMs,
      error_message: errorMessage,
      metadata
    });
  }
  
  /**
   * Measure the execution time of an async function and record metrics
   */
  static async measureAndRecord<T>(
    category: MetricCategory,
    operation: MetricOperation,
    entityType: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const durationMs = Math.round(performance.now() - startTime);
      this.record({
        category,
        operation,
        entity_type: entityType,
        success: true,
        duration_ms: durationMs
      });
      return result;
    } catch (error) {
      const durationMs = Math.round(performance.now() - startTime);
      this.record({
        category,
        operation,
        entity_type: entityType,
        success: false,
        duration_ms: durationMs,
        error_message: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Flush queued metrics to the database
   */
  static async flush(): Promise<boolean> {
    if (this.isProcessingQueue || this.metricsQueue.length === 0 || !this.organizationId) {
      return false;
    }
    
    this.isProcessingQueue = true;
    
    try {
      // Clone and clear the queue
      const metricsToSend = [...this.metricsQueue];
      this.metricsQueue = [];
      
      // Transform metrics for database insertion
      const metricsForDb = metricsToSend.map(metric => ({
        id: uuidv4(),
        organization_id: this.organizationId,
        category: metric.category,
        operation: metric.operation,
        entity_type: metric.entity_type || null,
        success: metric.success,
        duration_ms: metric.duration_ms || null,
        error_message: metric.error_message || null,
        metadata: metric.metadata || null,
        created_at: new Date().toISOString()
      }));
      
      // Send metrics to database - using manual query to work around typing issues
      const { error } = await supabase
        .from('application_metrics' as any)
        .insert(metricsForDb);
      
      if (error) {
        console.error('[MetricsCollector] Error inserting metrics:', error);
        // Put metrics back in queue for retry
        this.metricsQueue = [...metricsToSend, ...this.metricsQueue];
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('[MetricsCollector] Exception during metrics flush:', err);
      return false;
    } finally {
      this.isProcessingQueue = false;
    }
  }
  
  /**
   * Clean up resources on unmount
   */
  static cleanup() {
    if (this.flushInterval !== null) {
      window.clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // Final flush attempt
    if (this.metricsQueue.length > 0) {
      this.flush().catch(() => {});
    }
  }
}
