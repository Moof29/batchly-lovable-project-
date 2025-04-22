
import { supabase } from '@/integrations/supabase/client';

export type AuditEventType = 
  // QBO Events
  | 'qbo.sync.started'
  | 'qbo.sync.completed'
  | 'qbo.sync.failed'
  | 'qbo.connection.established'
  | 'qbo.connection.refreshed'
  | 'qbo.connection.failed'
  // Portal Events
  | 'portal.login'
  | 'portal.logout'
  | 'portal.profile.updated'
  | 'portal.profile.viewed'
  | 'portal.order.created'
  | 'portal.order.viewed'
  | 'portal.invoice.viewed'
  | 'portal.invoice.paid'
  // Common Data Events
  | 'data.created'
  | 'data.updated'
  | 'data.deleted';

export type AuditEventSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditEventData {
  type: AuditEventType;
  organizationId: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  portalUserId?: string;
  detail?: any;
  severity?: AuditEventSeverity;
  metadata?: Record<string, any>;
  createdAt?: string;
}

export class AuditService {
  private static instance: AuditService;
  private eventQueue: AuditEventData[] = [];
  private flushInterval: number = 10000; // 10 seconds
  private intervalId: number | null = null;
  private isProcessing: boolean = false;
  
  private constructor() {
    // Start background flushing
    this.startAutoFlush();
  }
  
  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }
  
  private startAutoFlush() {
    if (this.intervalId === null) {
      this.intervalId = window.setInterval(() => this.flush(), this.flushInterval);
    }
  }
  
  private stopAutoFlush() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  public logEvent(eventData: AuditEventData): void {
    const finalEventData = {
      ...eventData,
      severity: eventData.severity || 'info',
      createdAt: new Date().toISOString(),
      metadata: {
        ...(eventData.metadata || {}),
        userAgent: navigator.userAgent,
        origin: window.location.origin + window.location.pathname
      }
    };
    
    // Add to queue
    this.eventQueue.push(finalEventData);
    
    // Flush immediately for critical events
    if (eventData.severity === 'critical') {
      this.flush();
    } 
    // Flush if queue gets too large
    else if (this.eventQueue.length >= 20) {
      this.flush();
    }
  }
  
  public async flush(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return;
    
    this.isProcessing = true;
    const eventsToFlush = [...this.eventQueue];
    this.eventQueue = [];
    
    try {
      // Convert events to database format
      const eventsToInsert = eventsToFlush.map(event => ({
        organization_id: event.organizationId,
        event_type: event.type,
        user_id: event.userId || null,
        portal_user_id: event.portalUserId || null,
        entity_type: event.entityType || null,
        entity_id: event.entityId || null,
        severity: event.severity,
        detail: event.detail || null,
        metadata: event.metadata || {},
        created_at: event.createdAt || new Date().toISOString()
      }));
      
      // Insert into database
      const { error } = await supabase.from('audit_events').insert(eventsToInsert);
      
      if (error) {
        console.error('Failed to flush audit events:', error);
        // Put back in queue for retry
        this.eventQueue = [...eventsToFlush, ...this.eventQueue];
      }
    } catch (err) {
      console.error('Error during audit flush:', err);
      // Put back in queue for retry
      this.eventQueue = [...eventsToFlush, ...this.eventQueue];
    }
    
    this.isProcessing = false;
  }
  
  public setFlushInterval(intervalMs: number): void {
    this.flushInterval = intervalMs;
    this.stopAutoFlush();
    this.startAutoFlush();
  }
  
  public destroy(): void {
    this.stopAutoFlush();
    this.flush();
  }
}

// Export a singleton instance
export const auditService = AuditService.getInstance();
