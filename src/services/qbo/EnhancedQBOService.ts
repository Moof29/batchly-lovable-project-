
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { CircuitBreaker } from "@/utils/circuitBreaker";
import { DataValidator } from "@/utils/dataValidator";
import { qboService, 
  QBOConnection, 
  SyncOperation, 
  EntityConfig, 
  EntityMapping, 
  FieldMapping, 
  SyncError, 
  SyncMetrics,
  SyncHistory 
} from "./QBOService";

// Entity validation schemas
const customerValidationSchema = {
  display_name: [DataValidator.rules.required('Display name')],
  email: [DataValidator.rules.email('Email')]
};

const invoiceValidationSchema = {
  customer_id: [DataValidator.rules.required('Customer ID')],
  invoice_date: [DataValidator.rules.required('Invoice date')],
  total: [DataValidator.rules.positiveNumber('Total amount')]
};

const billValidationSchema = {
  vendor_id: [DataValidator.rules.required('Vendor ID')],
  bill_date: [DataValidator.rules.required('Bill date')],
  total: [DataValidator.rules.positiveNumber('Total amount')]
};

// Create circuit breakers for different QBO API endpoints
const apiCircuitBreakers = {
  customer: new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 60000, // 1 minute
    halfOpenRetries: 2,
    onStateChange: (from, to) => {
      console.log(`Customer API circuit changed from ${from} to ${to}`);
      if (to === 'OPEN') {
        toast({
          title: "QBO Customer API Unavailable",
          description: "The system will retry automatically in 1 minute",
          variant: "destructive"
        });
      } else if (from === 'OPEN' && to === 'CLOSED') {
        toast({
          title: "QBO Customer API Restored",
          description: "Connectivity has been restored",
        });
      }
    }
  }),
  invoice: new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 60000,
    halfOpenRetries: 2,
    onStateChange: (from, to) => {
      console.log(`Invoice API circuit changed from ${from} to ${to}`);
      if (to === 'OPEN') {
        toast({
          title: "QBO Invoice API Unavailable",
          description: "The system will retry automatically in 1 minute",
          variant: "destructive"
        });
      } else if (from === 'OPEN' && to === 'CLOSED') {
        toast({
          title: "QBO Invoice API Restored",
          description: "Connectivity has been restored",
        });
      }
    }
  }),
  bill: new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 60000,
    halfOpenRetries: 2,
    onStateChange: (from, to) => {
      console.log(`Bill API circuit changed from ${from} to ${to}`);
      if (to === 'OPEN') {
        toast({
          title: "QBO Bill API Unavailable",
          description: "The system will retry automatically in 1 minute",
          variant: "destructive"
        });
      } else if (from === 'OPEN' && to === 'CLOSED') {
        toast({
          title: "QBO Bill API Restored",
          description: "Connectivity has been restored",
        });
      }
    }
  }),
  auth: new CircuitBreaker({
    failureThreshold: 2,
    resetTimeout: 120000, // 2 minutes
    halfOpenRetries: 1,
    onStateChange: (from, to) => {
      console.log(`Auth API circuit changed from ${from} to ${to}`);
      if (to === 'OPEN') {
        toast({
          title: "QBO Authentication Failed",
          description: "Check your connection settings",
          variant: "destructive"
        });
      }
    }
  })
};

// Validators for different entity types
const validators = {
  customer_profile: new DataValidator(customerValidationSchema),
  invoice_record: new DataValidator(invoiceValidationSchema),
  bill_record: new DataValidator(billValidationSchema)
};

/**
 * Enhanced QBO Service with circuit breaker and data validation
 * Wraps the existing QBOService with resilience patterns
 */
export class EnhancedQBOService {
  
  /**
   * Processes a sync operation with circuit breaker pattern and data validation
   */
  async processSyncOperation(operation: SyncOperation): Promise<boolean> {
    console.log(`Enhanced processing of operation ${operation.id}`);
    
    try {
      // Validate the operation data based on entity type
      if (operation.request_payload && operation.entity_type in validators) {
        const validator = validators[operation.entity_type as keyof typeof validators];
        const validationResult = validator.validate(operation.request_payload);
        
        if (!validationResult.isValid) {
          console.error(`Validation failed for ${operation.entity_type}:`, validationResult.errors);
          
          // Log validation error
          await qboService.logError(
            'validation',
            `Data validation failed for ${operation.entity_type}`,
            `Fields with errors: ${validationResult.errors.map(e => `${e.field} (${e.message})`).join(', ')}`
          );
          
          // Update operation status
          await qboService.updateOperationStatus(
            operation.id,
            'failed',
            null,
            `Validation error: ${validationResult.errors[0].message}`
          );
          
          return false;
        }
      }
      
      // Select appropriate circuit breaker based on entity type
      let circuitBreaker: CircuitBreaker;
      
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
          // Default to using invoice circuit breaker for other entity types
          circuitBreaker = apiCircuitBreakers.invoice;
      }
      
      // Execute the operation through the circuit breaker
      return await circuitBreaker.exec(async () => {
        // Use the original service to process the operation
        const result = await qboService.processSyncOperation(operation);
        return result;
      });
      
    } catch (error) {
      console.error(`Enhanced service error processing operation ${operation.id}:`, error);
      
      // Log the error using original service
      await qboService.logError(
        this.categorizeError(error),
        `Failed to sync ${operation.entity_type} with enhanced service`,
        String(error)
      );
      
      // Update operation status
      await qboService.updateOperationStatus(operation.id, 'failed', null, String(error));
      
      return false;
    }
  }
  
  /**
   * Categorize error by type to enable better error handling
   */
  private categorizeError(error: any): string {
    if (error.status === 401 || error.status === 403) {
      return 'auth';
    } else if (error.status === 400) {
      return 'validation';
    } else if (error.status === 429) {
      return 'rate_limit';
    } else if (error.status >= 500) {
      return 'server';
    } else if (error.message && error.message.includes('network')) {
      return 'connection';
    } else {
      return 'unknown';
    }
  }
  
  /**
   * Batch processes multiple operations with optimized concurrency
   */
  async processBatch(operations: SyncOperation[], concurrency = 3): Promise<{
    processed: number;
    success: number;
    failed: number;
  }> {
    console.log(`Processing batch of ${operations.length} operations with concurrency ${concurrency}`);
    
    let processed = 0;
    let success = 0;
    let failed = 0;
    
    // Process in batches according to concurrency level
    for (let i = 0; i < operations.length; i += concurrency) {
      const batch = operations.slice(i, i + concurrency);
      
      // Process batch in parallel
      const results = await Promise.allSettled(
        batch.map(op => this.processSyncOperation(op))
      );
      
      // Count successes and failures
      results.forEach(result => {
        processed++;
        
        if (result.status === 'fulfilled' && result.value === true) {
          success++;
        } else {
          failed++;
        }
      });
    }
    
    return { processed, success, failed };
  }
  
  /**
   * Perform token refresh with circuit breaker pattern
   */
  async refreshToken(): Promise<boolean> {
    try {
      return await apiCircuitBreakers.auth.exec(async () => {
        return await qboService.refreshToken();
      });
    } catch (error) {
      console.error("Enhanced token refresh failed:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const enhancedQboService = new EnhancedQBOService();
