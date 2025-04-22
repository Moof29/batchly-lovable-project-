
import { supabase } from '@/integrations/supabase/client';
import { auditService } from '../audit/AuditService';

// Represent an operation in a transaction
export interface TransactionOperation {
  table: string;
  type: 'insert' | 'update' | 'delete' | 'upsert';
  data?: any;
  match?: any;
  returning?: string;
}

// Transaction result
export interface TransactionResult {
  success: boolean;
  results?: any[];
  error?: any;
}

// Journal entry for audit trail
interface JournalEntry {
  entityType: string;
  entityId: string;
  operation: string;
  before?: any;
  after?: any;
  organizationId: string;
  userId?: string;
  portalUserId?: string;
  source: 'qbo' | 'portal' | 'internal';
}

export class TransactionManager {
  private static instance: TransactionManager;
  private journalQueue: JournalEntry[] = [];
  
  private constructor() {
    // Private constructor for singleton pattern
    window.addEventListener('beforeunload', () => {
      this.flushJournal();
    });
  }
  
  public static getInstance(): TransactionManager {
    if (!TransactionManager.instance) {
      TransactionManager.instance = new TransactionManager();
    }
    return TransactionManager.instance;
  }
  
  // Execute a transaction with multiple operations
  public async executeTransaction(
    operations: TransactionOperation[],
    journal?: Omit<JournalEntry, 'operation' | 'before' | 'after'>
  ): Promise<TransactionResult> {
    if (operations.length === 0) {
      return { success: true, results: [] };
    }
    
    // Start transaction
    const results: any[] = [];
    let success = true;
    let error: any = null;
    
    try {
      // Execute each operation in sequence (Supabase JS doesn't support true transactions)
      for (const op of operations) {
        let result;
        let query;
        let beforeState = null;
        
        if (journal && op.match) {
          // Use type assertion to handle dynamic table names
          const { data: before } = await supabase
            .from(op.table as any)
            .select('*')
            .match(op.match)
            .maybeSingle();
          beforeState = before;
        }
        
        switch (op.type) {
          case 'insert':
            // Use type assertion for dynamic table names
            query = supabase.from(op.table as any).insert(op.data);
            
            if (op.returning) {
              query = query.select(op.returning);
            }
            
            result = await query;
            
            if (result.error) throw result.error;
            
            // Journal the operation if requested
            if (journal) {
              this.addToJournal({
                ...journal,
                operation: 'insert',
                before: beforeState,
                after: result.data?.[0] || op.data
              });
            }
            
            results.push(result.data);
            break;
            
          case 'update':
            // Use type assertion for dynamic table names
            query = supabase.from(op.table as any).update(op.data).match(op.match);
            
            if (op.returning) {
              query = query.select(op.returning);
            }
            
            result = await query;
            
            if (result.error) throw result.error;
            
            // Journal the operation if requested
            if (journal) {
              this.addToJournal({
                ...journal,
                operation: 'update',
                before: beforeState,
                after: result.data?.[0] || { ...beforeState, ...op.data }
              });
            }
            
            results.push(result.data);
            break;
            
          case 'delete':
            // Use type assertion for dynamic table names
            query = supabase.from(op.table as any).delete();
            
            if (op.match) {
              query = query.match(op.match);
            }
            
            if (op.returning) {
              query = query.select(op.returning);
            }
            
            result = await query;
            
            if (result.error) throw result.error;
            
            // Journal the operation if requested
            if (journal) {
              this.addToJournal({
                ...journal,
                operation: 'delete',
                before: beforeState,
                after: null
              });
            }
            
            results.push(result.data);
            break;
            
          case 'upsert':
            // Use type assertion for dynamic table names
            query = supabase.from(op.table as any).upsert(op.data);
            
            if (op.returning) {
              query = query.select(op.returning);
            }
            
            result = await query;
            
            if (result.error) throw result.error;
            
            // For upserts we don't attempt to get before state
            if (journal) {
              this.addToJournal({
                ...journal,
                operation: 'upsert',
                before: null,
                after: result.data?.[0] || op.data
              });
            }
            
            results.push(result.data);
            break;
        }
      }
    } catch (err) {
      console.error('Transaction failed:', err);
      success = false;
      error = err;
      
      // Log error event
      if (journal) {
        auditService.logEvent({
          type: 'data.updated',
          organizationId: journal.organizationId,
          userId: journal.userId,
          portalUserId: journal.portalUserId,
          entityType: journal.entityType,
          entityId: journal.entityId,
          severity: 'error',
          detail: {
            error: err instanceof Error ? err.message : String(err),
            operations
          }
        });
      }
    }
    
    return { success, results, error };
  }
  
  // Add an entry to the journal queue
  private addToJournal(entry: JournalEntry): void {
    this.journalQueue.push(entry);
    
    // Flush if queue gets too large
    if (this.journalQueue.length >= 20) {
      this.flushJournal();
    }
  }
  
  // Flush journal entries to the database
  public async flushJournal(): Promise<void> {
    if (this.journalQueue.length === 0) return;
    
    const entries = [...this.journalQueue];
    this.journalQueue = [];
    
    try {
      // Convert journal entries to database format
      const recordsToInsert = entries.map(entry => ({
        organization_id: entry.organizationId,
        table_name: entry.entityType,
        record_id: entry.entityId,
        operation_type: entry.operation,
        user_id: entry.userId || null,
        before_data: entry.before || null,
        after_data: entry.after || null,
        timestamp: new Date().toISOString()
      }));
      
      // Insert records into change_log table
      const { error } = await supabase
        .from('change_log')
        .insert(recordsToInsert);
      
      if (error) {
        console.error('Failed to flush journal entries:', error);
        // Put back in queue for retry
        this.journalQueue = [...entries, ...this.journalQueue];
      }
    } catch (err) {
      console.error('Error during journal flush:', err);
      // Put back in queue for retry
      this.journalQueue = [...entries, ...this.journalQueue];
    }
  }
}

// Export a singleton instance
export const transactionManager = TransactionManager.getInstance();
