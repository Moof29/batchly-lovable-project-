
import { SyncOperation } from "../QBOService";
import { enhancedProcessSyncOperation } from "./enhancedProcessSyncOperation";

export async function processBatch(operations: SyncOperation[], concurrency = 3): Promise<{
  processed: number;
  success: number;
  failed: number;
}> {
  let processed = 0, success = 0, failed = 0;
  for (let i = 0; i < operations.length; i += concurrency) {
    const batch = operations.slice(i, i + concurrency);
    const results = await Promise.allSettled(batch.map(op => enhancedProcessSyncOperation(op)));
    results.forEach(result => {
      processed++;
      if (result.status === "fulfilled" && result.value === true) success++;
      else failed++;
    });
  }
  return { processed, success, failed };
}
