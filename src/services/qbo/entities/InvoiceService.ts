
import { qboService, SyncOperation } from "../QBOService";
import { apiCircuitBreakers } from "../circuitBreakers";
import { validators } from "../validators";
import { categorizeError } from "./categorizeError";

/**
 * Invoice-specific QBO service implementation
 */
export class InvoiceService {
  /**
   * Process an invoice sync operation with circuit breaker and validation
   */
  async processOperation(operation: SyncOperation): Promise<boolean> {
    if (operation.entity_type !== 'invoice_record') {
      throw new Error('Invalid entity type for InvoiceService');
    }
    
    try {
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
      
      return await apiCircuitBreakers.invoice.exec(async () => {
        return await qboService.processSyncOperation(operation);
      });
    } catch (error) {
      await qboService.logError(
        categorizeError(error),
        `Failed to sync invoice with id ${operation.entity_id}`,
        String(error)
      );
      await qboService.updateOperationStatus(
        operation.id, 
        "failed", 
        null, 
        String(error)
      );
      return false;
    }
  }
  
  /**
   * Fetch invoice data from QBO
   */
  async fetchFromQBO(invoiceId: string, includeLineItems: boolean = false): Promise<any> {
    try {
      return await apiCircuitBreakers.invoice.exec(async () => {
        // Use enhanced QBO service's method instead
        const enhancedQBOServiceV2 = new (await import('../entities/EnhancedQBOServiceV2')).EnhancedQBOServiceV2();
        const result = await enhancedQBOServiceV2.getSyncEntityById('invoice', invoiceId);
        return result;
      });
    } catch (error) {
      await qboService.logError(
        categorizeError(error),
        `Failed to fetch invoice ${invoiceId} from QBO`,
        String(error)
      );
      throw error;
    }
  }
}

export const invoiceService = new InvoiceService();
