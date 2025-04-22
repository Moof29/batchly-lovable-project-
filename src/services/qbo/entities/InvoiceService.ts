
/**
 * QBO Invoice Service
 * Handles invoice-specific operations for QBO sync
 */

import { qboService, SyncOperation } from "../QBOService";
import { apiCircuitBreakers } from "../circuitBreakers";
import { validators } from "../validators";
import { categorizeError } from "./categorizeError";
import { circuitBreakerManager } from "@/utils/circuitBreaker/CircuitBreakerManager";
import { auditService } from "@/utils/audit/AuditService";

export class InvoiceService {
  private organizationId: string;
  
  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }
  
  async syncInvoice(operation: SyncOperation): Promise<boolean> {
    try {
      // Validate invoice data
      if (operation.request_payload) {
        const validator = validators.invoice_record;
        const validationResult = validator.validate(operation.request_payload);
        
        if (!validationResult.isValid) {
          await qboService.logError(
            "validation",
            `Data validation failed for invoice`,
            `Fields with errors: ${validationResult.errors.map(e => `${e.field} (${e.message})`).join(", ")}`
          );
          
          await qboService.updateOperationStatus(
            operation.id,
            "failed",
            null,
            `Validation error: ${validationResult.errors[0].message}`
          );
          
          return false;
        }
      }
      
      // Use circuit breaker for the API call
      const breaker = circuitBreakerManager.getBreaker(
        'invoice-api', 
        this.organizationId, 
        'qbo'
      );
      
      // Log the attempt
      auditService.logEvent({
        type: 'qbo.sync.started',
        organizationId: this.organizationId,
        entityType: 'invoice_record',
        entityId: operation.entity_id,
        detail: {
          operationId: operation.id,
          operationType: operation.operation_type
        }
      });
      
      // Execute with circuit breaker protection
      return await breaker.exec(async () => {
        const result = await qboService.processSyncOperation(operation);
        
        if (result) {
          auditService.logEvent({
            type: 'qbo.sync.completed',
            organizationId: this.organizationId,
            entityType: 'invoice_record',
            entityId: operation.entity_id,
            detail: {
              operationId: operation.id,
              operationType: operation.operation_type
            }
          });
        } else {
          auditService.logEvent({
            type: 'qbo.sync.failed',
            organizationId: this.organizationId,
            entityType: 'invoice_record',
            entityId: operation.entity_id,
            severity: 'error',
            detail: {
              operationId: operation.id,
              operationType: operation.operation_type
            }
          });
        }
        
        return result;
      });
    } catch (error) {
      // Log the error
      const errorCategory = categorizeError(error);
      await qboService.logError(
        errorCategory,
        `Failed to sync invoice`,
        String(error)
      );
      
      await qboService.updateOperationStatus(
        operation.id, 
        "failed", 
        null, 
        String(error)
      );
      
      // Record the error event
      auditService.logEvent({
        type: 'qbo.sync.failed',
        organizationId: this.organizationId,
        entityType: 'invoice_record',
        entityId: operation.entity_id,
        severity: 'error',
        detail: {
          operationId: operation.id,
          operationType: operation.operation_type,
          error: String(error),
          errorCategory
        }
      });
      
      return false;
    }
  }
  
  async getCustomerInvoices(customerId: string): Promise<any[]> {
    // Implement invoice fetching logic
    try {
      const breaker = circuitBreakerManager.getBreaker(
        'invoice-api', 
        this.organizationId, 
        'qbo'
      );
      
      return await breaker.exec(async () => {
        // This would be replaced with actual QBO API call
        return [];
      });
    } catch (error) {
      console.error('Error fetching customer invoices:', error);
      return [];
    }
  }
}
