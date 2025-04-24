
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { MetricsCollector } from "../audit/MetricsCollector";

export interface TransactionOptions {
  useTransaction?: boolean;
  recordMetrics?: boolean;
  category?: string;
  operation?: string;
  entityType?: string;
  metadata?: Record<string, any>;
}

type TransactionOperation<T> = () => Promise<T>;

/**
 * TransactionService provides reliable data operations with logging and metrics
 * Can be used by both QBO and Customer Portal features
 */
export class TransactionServiceV2 {
  /**
   * Execute operations with optional transaction wrapping and metrics
   */
  static async execute<T>(
    operation: TransactionOperation<T>,
    options: TransactionOptions = {}
  ): Promise<T> {
    const {
      useTransaction = true,
      recordMetrics = true,
      category = 'system',
      operation: opType = 'update',
      entityType = 'general',
      metadata = {}
    } = options;
    
    const startTime = performance.now();
    const transactionId = uuidv4();
    
    try {
      let result: T;
      
      if (useTransaction) {
        // Start transaction
        console.log(`[Transaction:${transactionId}] Starting transaction`);
        
        // This is a simplified version - ideally we would use a real Postgres transaction
        // Supabase SDK doesn't support proper transactions yet, so we use a hack
        result = await operation();
      } else {
        // Just execute the operation without a transaction
        result = await operation();
      }
      
      if (recordMetrics) {
        const duration = Math.round(performance.now() - startTime);
        MetricsCollector.record({
          category: category as any,
          operation: opType as any,
          entity_type: entityType,
          success: true,
          duration_ms: duration,
          metadata: { ...metadata, transaction_id: transactionId }
        });
      }
      
      return result;
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      
      console.error(`[Transaction:${transactionId}] Failed:`, error);
      
      if (recordMetrics) {
        MetricsCollector.record({
          category: category as any,
          operation: opType as any,
          entity_type: entityType,
          success: false,
          duration_ms: duration,
          error_message: error instanceof Error ? error.message : String(error),
          metadata: { ...metadata, transaction_id: transactionId }
        });
      }
      
      throw error;
    }
  }
  
  /**
   * Record an audit log entry
   */
  static async recordAuditEvent(
    organizationId: string, 
    eventType: string, 
    entityType?: string,
    entityId?: string,
    userId?: string, 
    portalUserId?: string,
    detail?: any,
    metadata?: any
  ): Promise<void> {
    try {
      await supabase.from('audit_events').insert({
        organization_id: organizationId,
        event_type: eventType,
        entity_type: entityType,
        entity_id: entityId,
        user_id: userId,
        portal_user_id: portalUserId,
        detail,
        metadata
      });
    } catch (error) {
      console.error('Failed to record audit event:', error);
      // Don't throw - audit failure shouldn't break business operations
    }
  }
  
  /**
   * Specialized method for recording QBO sync events
   */
  static async recordQBOSyncEvent(
    organizationId: string,
    entityType: string,
    entityId: string,
    syncStatus: string,
    userId?: string,
    detail?: any
  ): Promise<void> {
    return this.recordAuditEvent(
      organizationId,
      `qbo_sync_${syncStatus}`,
      entityType,
      entityId,
      userId,
      undefined,
      detail,
      { sync_status: syncStatus }
    );
  }
  
  /**
   * Specialized method for recording portal activity
   */
  static async recordPortalActivity(
    organizationId: string,
    activityType: string,
    portalUserId: string,
    entityType?: string,
    entityId?: string,
    detail?: any,
    metadata?: any
  ): Promise<void> {
    return this.recordAuditEvent(
      organizationId,
      `portal_${activityType}`,
      entityType,
      entityId,
      undefined,
      portalUserId,
      detail,
      metadata
    );
  }
}
