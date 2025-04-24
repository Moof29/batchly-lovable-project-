
import { qboService, SyncOperation } from "../QBOService";
import { apiCircuitBreakers } from "../circuitBreakers";
import { validators } from "../validators";
import { categorizeError } from "./categorizeError";

/**
 * Customer-specific QBO service implementation
 */
export class CustomerService {
  /**
   * Process a customer sync operation with circuit breaker and validation
   */
  async processOperation(operation: SyncOperation): Promise<boolean> {
    if (operation.entity_type !== 'customer_profile') {
      throw new Error('Invalid entity type for CustomerService');
    }
    
    try {
      if (operation.request_payload) {
        const validator = validators.customer_profile;
        const validationResult = validator.validate(operation.request_payload);
        if (!validationResult.isValid) {
          await qboService.logError(
            "validation",
            `Data validation failed for customer`,
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
      
      return await apiCircuitBreakers.customer.exec(async () => {
        return await qboService.processSyncOperation(operation);
      });
    } catch (error) {
      await qboService.logError(
        categorizeError(error),
        `Failed to sync customer with id ${operation.entity_id}`,
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
   * Fetch customer data from QBO
   */
  async fetchFromQBO(customerId: string): Promise<any> {
    try {
      return await apiCircuitBreakers.customer.exec(async () => {
        // This would call the actual QBO API directly rather than using getQBOEntity
        // which doesn't exist in the QBOService
        const result = await qboService.getSyncEntityById('customer', customerId);
        return result;
      });
    } catch (error) {
      await qboService.logError(
        categorizeError(error),
        `Failed to fetch customer ${customerId} from QBO`,
        String(error)
      );
      throw error;
    }
  }
}

export const customerService = new CustomerService();
