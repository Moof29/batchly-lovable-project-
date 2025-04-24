import { EnhancedQBOServiceV2 } from "./qbo/entities/EnhancedQBOServiceV2";
import { customerService } from "./qbo/entities/CustomerService";
import { invoiceService } from "./qbo/entities/InvoiceService";
import { billService } from "./qbo/entities/BillService";
import { CustomerPortalService } from "./customerPortal/CustomerPortalService";
import { qboService } from "./qbo/QBOService";
import { ValidationFactory } from "@/utils/validation/ValidationFactory";
import { ApiCircuitBreakerFactory } from "@/utils/circuitBreaker/ApiCircuitBreakerFactory";
import { MetricsCollector } from "@/utils/audit/MetricsCollector";
import { TransactionServiceV2 } from "@/utils/transaction/TransactionServiceV2";

/**
 * Service factory to create and initialize application services
 */
export class ServiceFactory {
  static organizationId: string | null = null;
  
  /**
   * Initialize all services with organization ID
   */
  static async initialize(organizationId: string): Promise<boolean> {
    this.organizationId = organizationId;
    
    // Initialize QBO services
    await qboService.initialize(organizationId);
    
    // Initialize metrics collector
    MetricsCollector.initialize(organizationId);
    
    console.log(`[ServiceFactory] All services initialized for organization ${organizationId}`);
    return true;
  }
  
  /**
   * Get the QBO service
   */
  static getQBOService(): EnhancedQBOServiceV2 {
    if (!this.organizationId) {
      throw new Error('Services not initialized');
    }
    return new EnhancedQBOServiceV2();  // Removed organizationId
  }
  
  /**
   * Get the Customer Portal service
   */
  static getCustomerPortalService(): CustomerPortalService {
    if (!this.organizationId) {
      throw new Error('Services not initialized');
    }
    return new CustomerPortalService();
  }
  
  /**
   * Get entity-specific services
   */
  static getCustomerService() {
    return customerService;
  }
  
  static getInvoiceService() {
    return invoiceService;
  }
  
  static getBillService() {
    return billService;
  }
  
  /**
   * Get validation services
   */
  static getValidators() {
    return ValidationFactory;
  }
  
  /**
   * Get circuit breakers
   */
  static getCircuitBreakers() {
    const qboBreakers = ApiCircuitBreakerFactory.createQboBreakers();
    const portalBreakers = ApiCircuitBreakerFactory.createPortalBreakers();
    return { qbo: qboBreakers, portal: portalBreakers };
  }
  
  /**
   * Get transaction service
   */
  static getTransactionService() {
    return TransactionServiceV2;
  }
  
  /**
   * Clean up all services
   */
  static cleanup(): void {
    // Cleanup metrics collector
    MetricsCollector.cleanup();
    
    this.organizationId = null;
    console.log('[ServiceFactory] All services cleaned up');
  }
}
