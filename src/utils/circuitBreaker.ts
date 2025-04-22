
/**
 * Circuit Breaker implementation for API calls
 * Provides automatic fallback and recovery for failing services
 */

type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenRetries: number;
  onStateChange?: (from: CircuitBreakerState, to: CircuitBreakerState) => void;
  fallbackFn?: <T>(...args: any[]) => Promise<T>;
}

export class CircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private nextAttemptTime = Date.now();
  private readonly options: CircuitBreakerOptions;

  constructor(options: Partial<CircuitBreakerOptions> = {}) {
    this.options = {
      failureThreshold: 3,
      resetTimeout: 30000, // 30 seconds
      halfOpenRetries: 2,
      ...options
    };
  }

  private changeState(to: CircuitBreakerState) {
    const from = this.state;
    if (from !== to) {
      this.state = to;
      if (this.options.onStateChange) {
        this.options.onStateChange(from, to);
      }
      
      // Reset counters on state change
      this.failureCount = 0;
      this.successCount = 0;

      if (to === 'OPEN') {
        this.nextAttemptTime = Date.now() + this.options.resetTimeout;
      }
    }
  }

  public async exec<T>(fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttemptTime) {
        return this.attemptHalfOpen(fn, ...args);
      }
      
      if (this.options.fallbackFn) {
        return this.options.fallbackFn<T>(...args);
      }
      
      throw new Error('Circuit is OPEN and no fallback provided');
    }

    try {
      const result = await fn(...args);
      
      if (this.state === 'HALF_OPEN') {
        this.successCount++;
        if (this.successCount >= this.options.halfOpenRetries) {
          this.changeState('CLOSED');
        }
      }
      
      return result;
    } catch (error) {
      return this.handleFailure(error, fn, ...args);
    }
  }

  private async attemptHalfOpen<T>(fn: (...args: any[]) => Promise<T>, ...args: any[]) {
    this.changeState('HALF_OPEN');
    
    try {
      const result = await fn(...args);
      
      this.successCount++;
      if (this.successCount >= this.options.halfOpenRetries) {
        this.changeState('CLOSED');
      }
      
      return result;
    } catch (error) {
      this.changeState('OPEN');
      
      if (this.options.fallbackFn) {
        return this.options.fallbackFn<T>(...args);
      }
      
      throw error;
    }
  }

  private async handleFailure<T>(
    error: any, 
    fn: (...args: any[]) => Promise<T>, 
    ...args: any[]
  ): Promise<T> {
    this.failureCount++;
    
    if (this.state === 'CLOSED' && this.failureCount >= this.options.failureThreshold) {
      this.changeState('OPEN');
    }
    
    if (this.state === 'HALF_OPEN') {
      this.changeState('OPEN');
    }
    
    if (this.options.fallbackFn) {
      return this.options.fallbackFn<T>(...args);
    }
    
    throw error;
  }

  public getState(): CircuitBreakerState {
    return this.state;
  }

  public reset(): void {
    this.changeState('CLOSED');
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttemptTime = Date.now();
  }
}
