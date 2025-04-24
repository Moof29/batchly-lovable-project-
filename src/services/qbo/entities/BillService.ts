
import { qboService, SyncOperation } from "../QBOService";
import { apiCircuitBreakers } from "../circuitBreakers";
import { validators } from "../validators";
import { categorizeError } from "./categorizeError";

/**
 * Bill-specific QBO service implementation
 */
export class BillService {
  /**
   * Process a bill sync operation with circuit breaker and validation
   */
  async processOperation(operation: SyncOperation): Promise<boolean> {
    if (operation.entity_type !== 'bill_record') {
      throw new Error('Invalid entity type for BillService');
    }
    
    try {
      if (operation.request_payload) {
        const validator = validators.bill_record;
        const validationResult = validator.validate(operation.request_payload);
        if (!validationResult.isValid) {
          await qboService.logError(
            "validation",
            `Data validation failed for bill`,
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
      
      return await apiCircuitBreakers.bill.exec(async () => {
        return await qboService.processSyncOperation(operation);
      });
    } catch (error) {
      await qboService.logError(
        categorizeError(error),
        `Failed to sync bill with id ${operation.entity_id}`,
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
   * Fetch bill data from QBO
   */
  async fetchFromQBO(billId: string, includeLineItems: boolean = false): Promise<any> {
    try {
      return await apiCircuitBreakers.bill.exec(async () => {
        // Use enhanced QBO service's method instead
        const enhancedQBOServiceV2 = new (await import('../entities/EnhancedQBOServiceV2')).EnhancedQBOServiceV2();
        const result = await enhancedQBOServiceV2.getSyncEntityById('bill', billId);
        return result;
      });
    } catch (error) {
      await qboService.logError(
        categorizeError(error),
        `Failed to fetch bill ${billId} from QBO`,
        String(error)
      );
      throw error;
    }
  }
}

export const billService = new BillService();
