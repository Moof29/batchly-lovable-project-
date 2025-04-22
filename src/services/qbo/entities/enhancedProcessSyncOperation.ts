
import { qboService, SyncOperation } from "../QBOService";
import { apiCircuitBreakers } from "../circuitBreakers";
import { validators } from "../validators";
import { categorizeError } from "./categorizeError";

export async function enhancedProcessSyncOperation(operation: SyncOperation): Promise<boolean> {
  try {
    if (operation.request_payload && operation.entity_type in validators) {
      const validator = validators[operation.entity_type as keyof typeof validators];
      const validationResult = validator.validate(operation.request_payload);
      if (!validationResult.isValid) {
        await qboService.logError(
          "validation",
          `Data validation failed for ${operation.entity_type}`,
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
    let circuitBreaker;
    switch(operation.entity_type) {
      case 'customer_profile':
        circuitBreaker = apiCircuitBreakers.customer;
        break;
      case 'invoice_record':
        circuitBreaker = apiCircuitBreakers.invoice;
        break;
      case 'bill_record':
        circuitBreaker = apiCircuitBreakers.bill;
        break;
      default:
        circuitBreaker = apiCircuitBreakers.invoice;
    }
    return await circuitBreaker.exec(async () => {
      return await qboService.processSyncOperation(operation);
    });
  } catch (error) {
    await qboService.logError(
      categorizeError(error),
      `Failed to sync ${operation.entity_type} with enhanced service`,
      String(error)
    );
    await qboService.updateOperationStatus(operation.id, "failed", null, String(error));
    return false;
  }
}
