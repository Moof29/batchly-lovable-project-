
import { CircuitBreaker } from "../circuitBreaker";
import { toast } from "@/hooks/use-toast";

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  halfOpenRetries?: number;
  serviceName: string;
  featureName: string;
  notifyOnStateChange?: boolean;
  silentRecovery?: boolean;
}

/**
 * Factory for creating standardized API circuit breakers across the application
 */
export class ApiCircuitBreakerFactory {
  /**
   * Creates a circuit breaker for API calls with standardized configuration
   */
  static create(options: CircuitBreakerOptions): CircuitBreaker {
    const {
      failureThreshold = 3,
      resetTimeout = 60000,
      halfOpenRetries = 2,
      serviceName,
      featureName,
      notifyOnStateChange = true,
      silentRecovery = false
    } = options;

    return new CircuitBreaker({
      failureThreshold,
      resetTimeout,
      halfOpenRetries,
      onStateChange: (from, to) => {
        if (!notifyOnStateChange) return;
        
        // Log all state changes
        console.log(`[CircuitBreaker] ${serviceName}.${featureName}: ${from} -> ${to}`);
        
        if (to === 'OPEN') {
          toast({
            title: `${serviceName} ${featureName} Service Unavailable`,
            description: `The ${featureName} service is currently unavailable and will retry automatically in ${resetTimeout/1000} seconds.`,
            variant: "destructive"
          });
        } else if (from === 'OPEN' && to === 'CLOSED' && !silentRecovery) {
          toast({
            title: `${serviceName} ${featureName} Service Restored`,
            description: `The ${featureName} service has been restored.`,
          });
        }
      }
    });
  }
  
  /**
   * Creates a set of circuit breakers for QBO API services
   */
  static createQboBreakers() {
    return {
      customer: this.create({ serviceName: 'QBO', featureName: 'Customer' }),
      invoice: this.create({ serviceName: 'QBO', featureName: 'Invoice' }),
      bill: this.create({ serviceName: 'QBO', featureName: 'Bill' }),
      payment: this.create({ serviceName: 'QBO', featureName: 'Payment' }),
      item: this.create({ serviceName: 'QBO', featureName: 'Item' }),
      vendor: this.create({ serviceName: 'QBO', featureName: 'Vendor' }),
      auth: this.create({ 
        serviceName: 'QBO', 
        featureName: 'Authentication', 
        failureThreshold: 2,
        resetTimeout: 120000,
        halfOpenRetries: 1
      })
    };
  }
  
  /**
   * Creates a set of circuit breakers for Portal API services
   */
  static createPortalBreakers() {
    return {
      auth: this.create({ serviceName: 'Portal', featureName: 'Authentication' }),
      document: this.create({ serviceName: 'Portal', featureName: 'Document' }),
      payment: this.create({ serviceName: 'Portal', featureName: 'Payment' }),
      messaging: this.create({ serviceName: 'Portal', featureName: 'Messaging' })
    };
  }
}
