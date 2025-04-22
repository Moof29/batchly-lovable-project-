import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export interface QBOConnection {
  id: string;
  organization_id: string;
  qbo_realm_id: string;
  qbo_company_id: string;
  qbo_access_token?: string;
  qbo_refresh_token?: string;
  qbo_token_expires_at?: string;
  environment: 'production' | 'sandbox';
  is_active: boolean;
  last_connected_at: string;
  last_sync_at?: string;
}

export interface SyncOperation {
  id: string;
  operation_id: string;
  entity_type: string;
  entity_id: string;
  operation_type: 'create' | 'update' | 'delete';
  sync_direction: 'to_qbo' | 'from_qbo';
  status: 'pending' | 'in_progress' | 'success' | 'failed' | 'rollback' | 'conflict';
  qbo_id?: string;
  request_payload?: any;
  response_payload?: any;
  retry_count: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  scheduled_at: string;
}

export interface EntityConfig {
  id: string;
  entity_type: string;
  is_enabled: boolean;
  sync_direction: 'to_qbo' | 'from_qbo' | 'bidirectional';
  priority_level: number;
  dependency_order: number;
  batch_size: number;
}

export interface EntityMapping {
  id: string;
  entity_type: string;
  batchly_id: string;
  qbo_id: string;
  last_batchly_update?: string;
  last_qbo_update?: string;
}

export interface FieldMapping {
  id: string;
  entity_type: string;
  batchly_field: string;
  qbo_field: string;
  transformation_type: 'direct' | 'format' | 'lookup' | 'custom';
  transformation_config?: any;
  is_enabled: boolean;
}

export interface SyncError {
  id: string;
  error_code?: string;
  error_category: 'auth' | 'validation' | 'rate_limit' | 'connection' | 'data' | 'unknown';
  error_message: string;
  suggested_resolution?: string;
  occurrence_count: number;
  is_resolved: boolean;
  last_occurred_at: string;
}

export interface SyncMetrics {
  id: string;
  entity_type: string;
  sync_direction: 'to_qbo' | 'from_qbo';
  operation_count: number;
  success_count: number;
  failure_count: number;
  total_time_ms?: number;
  avg_time_per_entity_ms?: number;
  rate_limit_hits: number;
  recorded_at: string;
}

export interface SyncHistory {
  id: string;
  sync_type: 'scheduled' | 'manual' | 'webhook';
  entity_types: string[];
  started_by?: string;
  status: 'started' | 'completed' | 'failed';
  entity_count: number;
  success_count: number;
  failure_count: number;
  started_at: string;
  completed_at?: string;
  summary?: any;
  error_summary?: string;
}

// Rate limits and batching configuration
const QBO_RATE_LIMITS = {
  MAX_REQUESTS_PER_MINUTE: 500,
  MAX_CONCURRENT_REQUESTS: 10,
  DEFAULT_BATCH_SIZE: 30,
  RETRY_DELAY_MS: 1000,
  MAX_RETRIES: 3
};

class QBOService {
  private organizationId?: string;
  private connection?: QBOConnection;
  private requestCounter = 0;
  private lastRequestReset = Date.now();

  constructor() {
    setInterval(() => {
      this.requestCounter = 0;
      this.lastRequestReset = Date.now();
    }, 60000);
  }

  async initialize(organizationId: string): Promise<boolean> {
    this.organizationId = organizationId;
    try {
      const connection = await this.getConnection();
      return !!connection && connection.is_active;
    } catch (error) {
      console.error("Error initializing QBO service:", error);
      return false;
    }
  }

  async getConnection(): Promise<QBOConnection | null> {
    if (!this.organizationId) {
      throw new Error("QBO service not initialized with organization ID");
    }

    const { data, error } = await supabase
      .from('qbo_connection')
      .select('*')
      .eq('organization_id', this.organizationId)
      .single();

    if (error) {
      console.error("Error fetching QBO connection:", error);
      return null;
    }

    this.connection = data as unknown as QBOConnection;
    return this.connection;
  }

  private needsTokenRefresh(): boolean {
    if (!this.connection?.qbo_token_expires_at) return true;
    
    const expiresAt = new Date(this.connection.qbo_token_expires_at);
    const now = new Date();
    
    return expiresAt.getTime() - now.getTime() < 10 * 60 * 1000;
  }

  async refreshToken(): Promise<boolean> {
    if (!this.connection?.qbo_refresh_token) {
      console.error("No refresh token available");
      return false;
    }

    try {
      const mockNewToken = {
        access_token: `mock_refreshed_token_${Date.now()}`,
        refresh_token: this.connection.qbo_refresh_token,
        expires_in: 3600
      };

      return await this.updateTokens(
        mockNewToken.access_token,
        mockNewToken.refresh_token,
        new Date(Date.now() + mockNewToken.expires_in * 1000)
      );
    } catch (error) {
      console.error("Failed to refresh token:", error);
      await this.logError('auth', 'Token refresh failed', String(error));
      return false;
    }
  }

  private async updateTokens(
    accessToken: string,
    refreshToken: string,
    expiresAt: Date
  ): Promise<boolean> {
    if (!this.organizationId) return false;

    const { error } = await supabase
      .from('qbo_connection')
      .update({
        qbo_access_token: accessToken,
        qbo_refresh_token: refreshToken,
        qbo_token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('organization_id', this.organizationId);

    if (error) {
      console.error("Failed to update tokens:", error);
      return false;
    }

    if (this.connection) {
      this.connection.qbo_access_token = accessToken;
      this.connection.qbo_refresh_token = refreshToken;
      this.connection.qbo_token_expires_at = expiresAt.toISOString();
    }

    return true;
  }

  async makeRequest(endpoint: string, method = 'GET', data?: any): Promise<any> {
    if (!this.connection?.qbo_access_token) {
      throw new Error("No QBO access token available");
    }

    if (this.requestCounter >= QBO_RATE_LIMITS.MAX_REQUESTS_PER_MINUTE) {
      const timeToWait = 60000 - (Date.now() - this.lastRequestReset);
      if (timeToWait > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToWait));
      }
    }

    if (this.needsTokenRefresh()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        throw new Error("Failed to refresh QBO access token");
      }
    }

    this.requestCounter++;

    await new Promise(resolve => setTimeout(resolve, 100));

    return this.getMockResponse(endpoint, method, data);
  }

  async createSyncOperation(
    entityType: string,
    entityId: string,
    operationType: 'create' | 'update' | 'delete',
    syncDirection: 'to_qbo' | 'from_qbo',
    qboId?: string,
    payload?: any
  ): Promise<string> {
    if (!this.organizationId) {
      throw new Error("QBO service not initialized with organization ID");
    }

    const operationId = uuidv4();
    
    const { data, error } = await supabase
      .from('qbo_sync_operation')
      .insert({
        organization_id: this.organizationId,
        operation_id: operationId,
        entity_type: entityType,
        entity_id: entityId,
        operation_type: operationType,
        sync_direction: syncDirection,
        status: 'pending',
        qbo_id: qboId,
        request_payload: payload,
        scheduled_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create sync operation:", error);
      throw error;
    }

    return data.id;
  }

  async getPendingOperations(
    entityType?: string,
    limit = 50
  ): Promise<SyncOperation[]> {
    if (!this.organizationId) {
      throw new Error("QBO service not initialized with organization ID");
    }

    let query = supabase
      .from('qbo_sync_operation')
      .select('*')
      .eq('organization_id', this.organizationId)
      .eq('status', 'pending')
      .order('scheduled_at', { ascending: true })
      .limit(limit);

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch pending operations:", error);
      return [];
    }

    return data as unknown as SyncOperation[];
  }

  async updateOperationStatus(
    operationId: string,
    status: 'in_progress' | 'success' | 'failed' | 'rollback' | 'conflict',
    responseData?: any,
    errorMessage?: string
  ): Promise<boolean> {
    if (!this.organizationId) {
      throw new Error("QBO service not initialized with organization ID");
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'in_progress') {
      updateData.started_at = new Date().toISOString();
    } else {
      updateData.completed_at = new Date().toISOString();
    }

    if (responseData) {
      updateData.response_payload = responseData;
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
      updateData.retry_count = supabase.rpc('increment_retry_count', { op_id: operationId });
    }

    const { error } = await supabase
      .from('qbo_sync_operation')
      .update(updateData)
      .eq('id', operationId);

    if (error) {
      console.error("Failed to update operation status:", error);
      return false;
    }

    return true;
  }

  async processSyncOperation(operation: SyncOperation): Promise<boolean> {
    try {
      await this.updateOperationStatus(operation.id, 'in_progress');

      const endpoint = this.getApiEndpoint(operation.entity_type, operation.operation_type, operation.qbo_id);
      
      const method = this.getHttpMethod(operation.operation_type);

      const response = await this.makeRequest(endpoint, method, operation.request_payload);

      await this.updateOperationStatus(operation.id, 'success', response);

      if ((operation.operation_type === 'create' || operation.operation_type === 'update') && 
          operation.sync_direction === 'to_qbo' &&
          response.Id) {
        await this.updateEntityMapping(operation.entity_type, operation.entity_id, response.Id);
      }

      await this.updateEntitySyncStatus(operation.entity_type, operation.entity_id, 'synced');

      return true;
    } catch (error) {
      console.error(`Error processing operation ${operation.id}:`, error);
      
      await this.logError(
        this.categorizeError(error),
        `Failed to sync ${operation.entity_type}`,
        String(error)
      );
      
      await this.updateOperationStatus(operation.id, 'failed', null, String(error));
      
      await this.updateEntitySyncStatus(operation.entity_type, operation.entity_id, 'error');
      
      return false;
    }
  }

  private async updateEntityMapping(
    entityType: string,
    batchlyId: string,
    qboId: string
  ): Promise<boolean> {
    if (!this.organizationId) return false;

    const { data, error: fetchError } = await supabase
      .from('qbo_entity_mapping')
      .select('*')
      .eq('organization_id', this.organizationId)
      .eq('entity_type', entityType)
      .eq('batchly_id', batchlyId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking entity mapping:", fetchError);
      return false;
    }

    const now = new Date().toISOString();

    if (data) {
      const { error } = await supabase
        .from('qbo_entity_mapping')
        .update({
          qbo_id: qboId,
          last_batchly_update: now,
          updated_at: now
        })
        .eq('id', data.id);

      return !error;
    } else {
      const { error } = await supabase
        .from('qbo_entity_mapping')
        .insert({
          organization_id: this.organizationId,
          entity_type: entityType,
          batchly_id: batchlyId,
          qbo_id: qboId,
          last_batchly_update: now
        });

      return !error;
    }
  }

  public async updateEntitySyncStatus(
    entityType: string,
    entityId: string,
    status: 'pending' | 'syncing' | 'synced' | 'error'
  ): Promise<boolean> {
    if (!this.organizationId) return false;

    const tableMap: Record<string, string> = {
      'customer_profile': 'customer_profile',
      'vendor_profile': 'vendor_profile',
      'item_record': 'item_record',
      'invoice_record': 'invoice_record',
      'bill_record': 'bill_record',
      'payment_receipt': 'payment_receipt'
    };

    const tableName = tableMap[entityType];
    if (!tableName) return false;

    try {
      const { error } = await supabase
        .from(tableName as any)
        .update({
          qbo_sync_status: status
        })
        .eq('id', entityId);

      return !error;
    } catch (error) {
      console.error(`Error updating entity sync status for ${entityType}:${entityId}:`, error);
      return false;
    }
  }

  async logError(
    category: 'auth' | 'validation' | 'rate_limit' | 'connection' | 'data' | 'unknown',
    message: string,
    details?: string,
    errorCode?: string
  ): Promise<void> {
    if (!this.organizationId) return;

    try {
      const { data } = await supabase
        .from('qbo_error_registry')
        .select('*')
        .eq('organization_id', this.organizationId)
        .eq('error_message', message)
        .eq('error_category', category)
        .maybeSingle();

      if (data) {
        await supabase
          .from('qbo_error_registry')
          .update({
            occurrence_count: data.occurrence_count + 1,
            last_occurred_at: new Date().toISOString(),
            error_message: details || message
          })
          .eq('id', data.id);
      } else {
        await supabase
          .from('qbo_error_registry')
          .insert({
            organization_id: this.organizationId,
            error_category: category,
            error_code: errorCode,
            error_message: message,
            suggested_resolution: details,
            occurrence_count: 1,
            last_occurred_at: new Date().toISOString(),
            is_resolved: false
          });
      }
    } catch (error) {
      console.error("Failed to log error:", error);
    }
  }

  async startSyncBatch(
    entityType: string,
    entityIds: string[],
    direction: 'to_qbo' | 'from_qbo'
  ): Promise<string> {
    if (!this.organizationId) {
      throw new Error("QBO service not initialized with organization ID");
    }

    const batchId = uuidv4();

    const { data, error } = await supabase
      .from('qbo_sync_batch')
      .insert({
        organization_id: this.organizationId,
        batch_id: batchId,
        entity_type: entityType,
        status: 'pending',
        operation_count: entityIds.length
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create sync batch:", error);
      throw error;
    }

    for (const entityId of entityIds) {
      try {
        const mapping = await this.getEntityMapping(entityType, entityId);
        
        const operationType = mapping ? 'update' : 'create';
        const payload = await this.buildPayload(entityType, entityId, operationType);
        
        await this.createSyncOperation(
          entityType,
          entityId,
          operationType,
          direction,
          mapping?.qbo_id,
          payload
        );
      } catch (err) {
        console.error(`Failed to create operation for ${entityType}:${entityId}`, err);
      }
    }

    return data.id;
  }

  async getEntityMapping(
    entityType: string,
    batchlyId: string
  ): Promise<EntityMapping | null> {
    if (!this.organizationId) return null;

    const { data, error } = await supabase
      .from('qbo_entity_mapping')
      .select('*')
      .eq('organization_id', this.organizationId)
      .eq('entity_type', entityType)
      .eq('batchly_id', batchlyId)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as EntityMapping;
  }

  async getEntityConfig(entityType: string): Promise<EntityConfig | null> {
    if (!this.organizationId) return null;

    const { data, error } = await supabase
      .from('qbo_entity_config')
      .select('*')
      .eq('organization_id', this.organizationId)
      .eq('entity_type', entityType)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as EntityConfig;
  }

  private async buildPayload(
    entityType: string,
    entityId: string,
    operationType: 'create' | 'update' | 'delete'
  ): Promise<any> {
    return {
      Id: operationType === 'update' ? entityId : undefined,
      Name: `Mock ${entityType} ${entityId.substring(0, 8)}`,
      Active: true
    };
  }

  private getApiEndpoint(
    entityType: string,
    operationType: 'create' | 'update' | 'delete',
    qboId?: string
  ): string {
    const entityMap: Record<string, string> = {
      'customer_profile': 'customer',
      'vendor_profile': 'vendor',
      'item_record': 'item',
      'invoice_record': 'invoice',
      'bill_record': 'bill',
      'payment_receipt': 'payment'
    };
    
    const qboEntity = entityMap[entityType] || entityType;
    
    if (operationType === 'delete') {
      return `/v3/company/${this.connection?.qbo_company_id}/${qboEntity}?operation=delete`;
    } else if (operationType === 'update' && qboId) {
      return `/v3/company/${this.connection?.qbo_company_id}/${qboEntity}?operation=update&Id=${qboId}`;
    } else {
      return `/v3/company/${this.connection?.qbo_company_id}/${qboEntity}`;
    }
  }

  private getHttpMethod(operationType: 'create' | 'update' | 'delete'): string {
    switch (operationType) {
      case 'create':
        return 'POST';
      case 'update':
        return 'POST';
      case 'delete':
        return 'POST';
      default:
        return 'GET';
    }
  }

  private categorizeError(error: any): 'auth' | 'validation' | 'rate_limit' | 'connection' | 'data' | 'unknown' {
    const errorMessage = String(error).toLowerCase();
    
    if (errorMessage.includes('token') || errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
      return 'auth';
    } else if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      return 'validation';
    } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      return 'rate_limit';
    } else if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('timeout')) {
      return 'connection';
    } else if (errorMessage.includes('not found') || errorMessage.includes('duplicate')) {
      return 'data';
    } else {
      return 'unknown';
    }
  }

  private getMockResponse(endpoint: string, method: string, data?: any): any {
    const entityMatch = endpoint.match(/\/v3\/company\/[\w\d]+\/(\w+)/);
    const entityType = entityMatch ? entityMatch[1] : 'unknown';
    
    const mockId = data?.Id || `mockQBO_${Date.now()}`;
    
    const mockResponses: Record<string, any> = {
      customer: {
        Id: mockId,
        SyncToken: "0",
        DisplayName: data?.Name || "Mock Customer",
        Active: true,
        CompanyName: data?.CompanyName || "Mock Company",
        CreatedDate: new Date().toISOString()
      },
      vendor: {
        Id: mockId,
        SyncToken: "0",
        DisplayName: data?.Name || "Mock Vendor",
        Active: true,
        CompanyName: data?.CompanyName || "Mock Vendor Co",
        CreatedDate: new Date().toISOString()
      },
      item: {
        Id: mockId,
        SyncToken: "0",
        Name: data?.Name || "Mock Item",
        Active: true,
        Type: "Inventory",
        QtyOnHand: 10,
        CreatedDate: new Date().toISOString()
      },
      invoice: {
        Id: mockId,
        SyncToken: "0",
        DocNumber: data?.DocNumber || `INV-${Date.now()}`,
        TotalAmt: data?.TotalAmt || 100.00,
        CreatedDate: new Date().toISOString()
      },
      bill: {
        Id: mockId,
        SyncToken: "0",
        DocNumber: data?.DocNumber || `BILL-${Date.now()}`,
        TotalAmt: data?.TotalAmt || 75.50,
        CreatedDate: new Date().toISOString()
      },
      payment: {
        Id: mockId,
        SyncToken: "0",
        TotalAmt: data?.TotalAmt || 100.00,
        CreatedDate: new Date().toISOString()
      }
    };
    
    if (Math.random() > 0.95) {
      throw new Error("Mock API error for testing");
    }
    
    return mockResponses[entityType] || { Id: mockId, Message: "Success" };
  }
}

export const qboService = new QBOService();
