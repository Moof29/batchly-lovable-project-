
import { qboService, SyncOperation } from "./QBOService";
import { apiCircuitBreakers } from "./circuitBreakers";
import { validators } from "./validators";
import { enhancedProcessSyncOperation } from "./entities/enhancedProcessSyncOperation";
import { processBatch } from "./entities/processBatch";
import { refreshTokenWithBreaker } from "./entities/refreshTokenWithBreaker";

/**
 * Enhanced QBO Service with circuit breaker and data validation
 * Wraps the existing QBOService with resilience patterns
 */
export class EnhancedQBOService {
  /**
   * Processes a sync operation with circuit breaker pattern and data validation
   */
  async processSyncOperation(operation: SyncOperation): Promise<boolean> {
    return enhancedProcessSyncOperation(operation);
  }

  /**
   * Batch processes multiple operations with optimized concurrency
   */
  async processBatch(operations: SyncOperation[], concurrency = 3): Promise<{
    processed: number;
    success: number;
    failed: number;
  }> {
    return processBatch(operations, concurrency);
  }

  /**
   * Perform token refresh with circuit breaker pattern
   */
  async refreshToken(): Promise<boolean> {
    return refreshTokenWithBreaker();
  }
}

export const enhancedQboService = new EnhancedQBOService();
