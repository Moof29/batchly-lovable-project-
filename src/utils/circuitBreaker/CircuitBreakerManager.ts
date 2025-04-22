
/**
 * Circuit Breaker Manager
 * Centralized management for application-wide circuit breakers
 */
import { CircuitBreaker } from "../circuitBreaker";
import { toast } from "@/hooks/use-toast";

// Circuit breaker configuration by type
interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenRetries: number;
}

export class CircuitBreakerManager {
  private static instance: CircuitBreakerManager;
  private breakers: Map<string, CircuitBreaker> = new Map();
  
  // Default configurations for different types of circuit breakers
  private defaultConfigs = {
    qbo: {
      failureThreshold: 3,
      resetTimeout: 60000, // 1 minute
      halfOpenRetries: 2
    },
    portal: {
      failureThreshold: 5,     // Higher threshold for portal APIs
      resetTimeout: 30000,     // Shorter reset timeout
      halfOpenRetries: 3
    },
    internal: {
      failureThreshold: 3,
      resetTimeout: 120000,    // Longer reset for internal operations
      halfOpenRetries: 1
    }
  };
  
  private constructor() {
    // Private constructor to enforce singleton pattern
  }
  
  public static getInstance(): CircuitBreakerManager {
    if (!CircuitBreakerManager.instance) {
      CircuitBreakerManager.instance = new CircuitBreakerManager();
    }
    return CircuitBreakerManager.instance;
  }
  
  // Get or create an organization-specific circuit breaker
  public getBreaker(
    name: string, 
    organization: string, 
    type: 'qbo' | 'portal' | 'internal' = 'internal'
  ): CircuitBreaker {
    const key = `${organization}:${name}`;
    
    if (!this.breakers.has(key)) {
      const config = this.defaultConfigs[type];
      this.breakers.set(
        key, 
        new CircuitBreaker({
          ...config,
          onStateChange: (from, to) => {
            console.log(`Circuit breaker '${name}' for org '${organization}' changed from ${from} to ${to}`);
            
            if (to === 'OPEN') {
              toast({
                title: `${name} Service Unavailable`,
                description: `Service is temporarily unavailable. Will retry automatically in ${config.resetTimeout/1000} seconds.`,
                variant: "destructive"
              });
            } else if (from === 'OPEN' && to === 'CLOSED') {
              toast({
                title: `${name} Service Restored`,
                description: "Connectivity has been restored.",
              });
            }
          }
        })
      );
    }
    
    return this.breakers.get(key)!;
  }
  
  // Get circuit breaker status for an organization
  public getStatus(organization: string): Record<string, string> {
    const status: Record<string, string> = {};
    
    for (const [key, breaker] of this.breakers.entries()) {
      if (key.startsWith(`${organization}:`)) {
        const name = key.split(':')[1];
        status[name] = breaker.getState();
      }
    }
    
    return status;
  }
  
  // Reset all circuit breakers for an organization
  public resetOrganizationBreakers(organization: string): void {
    for (const [key, breaker] of this.breakers.entries()) {
      if (key.startsWith(`${organization}:`)) {
        breaker.reset();
      }
    }
  }
}

// Export a singleton instance
export const circuitBreakerManager = CircuitBreakerManager.getInstance();
