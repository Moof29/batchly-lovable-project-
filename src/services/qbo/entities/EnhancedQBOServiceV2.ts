
import { SyncOperation } from "../QBOService";
import { customerService } from "./CustomerService";
import { invoiceService } from "./InvoiceService";
import { billService } from "./BillService";
import { processBatch } from "./processBatch";
import { refreshTokenWithBreaker } from "./refreshTokenWithBreaker";

/**
 * Enhanced QBO Service with circuit breaker and data validation - V2
 * Entity-specific service implementation with improved modularity
 */
export class EnhancedQBOServiceV2 {
  private organizationId?: string;
  private apiKey?: string;

  constructor(organizationId?: string, apiKey?: string) {
    this.organizationId = organizationId;
    this.apiKey = apiKey;
  }
  
  /**
   * Process a sync operation based on entity type
   */
  async processSyncOperation(operation: SyncOperation): Promise<boolean> {
    switch (operation.entity_type) {
      case 'customer_profile':
        return customerService.processOperation(operation);
      case 'invoice_record':
        return invoiceService.processOperation(operation);
      case 'bill_record':
        return billService.processOperation(operation);
      default:
        // For entities without a specialized service, use the generic processor
        return this.processGenericOperation(operation);
    }
  }
  
  /**
   * Process a generic operation without specialized handling
   */
  private async processGenericOperation(operation: SyncOperation): Promise<boolean> {
    // Use the common enhanced processing logic from the original implementation
    const { enhancedProcessSyncOperation } = await import('./enhancedProcessSyncOperation');
    return enhancedProcessSyncOperation(operation);
  }
  
  /**
   * Batch processes multiple operations with optimized concurrency
   */
  async processBatch(operations: SyncOperation[], concurrency = 3): Promise<{
    processed: number;
    success: number;
    failed: number;
  }> {
    return processBatch(operations, concurrency);
  }

  /**
   * Get a synchronized entity by ID - added to fix missing method errors
   */
  async getSyncEntityById(entityType: string, entityId: string): Promise<any> {
    // Placeholder implementation to support entity services
    // This would be implemented to match the actual QBO API call
    return { id: entityId, type: entityType };
  }

  /**
   * Perform token refresh with circuit breaker pattern
   */
  async refreshToken(): Promise<boolean> {
    return refreshTokenWithBreaker();
  }
}

export const enhancedQboServiceV2 = new EnhancedQBOServiceV2();
