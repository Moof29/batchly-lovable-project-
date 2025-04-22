
import { supabase } from '@/integrations/supabase/client';
import { circuitBreakerManager } from '@/utils/circuitBreaker/CircuitBreakerManager';
import { auditService } from '@/utils/audit/AuditService';
import { transactionManager } from '@/utils/transaction/TransactionManager';
import { customerPortalValidator } from '@/utils/validation/entityValidators/CustomerValidator';

export class CustomerPortalService {
  private organizationId: string;
  private portalUserId: string;
  
  constructor(organizationId: string, portalUserId: string) {
    this.organizationId = organizationId;
    this.portalUserId = portalUserId;
  }
  
  // Get customer profile for the portal user
  async getCustomerProfile() {
    try {
      // Use circuit breaker
      const breaker = circuitBreakerManager.getBreaker(
        'customer-portal-api', 
        this.organizationId, 
        'portal'
      );
      
      return await breaker.exec(async () => {
        // Get customer profile IDs linked to this portal user
        const { data: links, error: linksError } = await supabase
          .from('customer_portal_user_links')
          .select('customer_id')
          .eq('portal_user_id', this.portalUserId);
          
        if (linksError) throw linksError;
        if (!links?.length) return null;
        
        // Get the customer profile
        const customerIds = links.map(link => link.customer_id);
        const { data: customers, error: customersError } = await supabase
          .from('customer_profile')
          .select('*')
          .in('id', customerIds)
          .eq('organization_id', this.organizationId);
          
        if (customersError) throw customersError;
        
        // Log the profile view
        auditService.logEvent({
          type: 'portal.profile.viewed',
          organizationId: this.organizationId,
          portalUserId: this.portalUserId,
          entityType: 'customer_profile',
          entityId: customers?.[0]?.id
        });
        
        return customers?.[0] || null;
      });
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      
      // Log the error
      auditService.logEvent({
        type: 'portal.profile.viewed',
        organizationId: this.organizationId,
        portalUserId: this.portalUserId,
        severity: 'error',
        detail: { error: String(error) }
      });
      
      return null;
    }
  }
  
  // Update customer profile
  async updateCustomerProfile(customerId: string, profileData: any) {
    try {
      // Validate the profile data
      const validationResult = customerPortalValidator.validate(profileData);
      const sanitizedData = validationResult.sanitized || profileData;
      
      if (!validationResult.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validationResult.errors[0].message}`,
          validationErrors: validationResult.errors
        };
      }
      
      // Use circuit breaker
      const breaker = circuitBreakerManager.getBreaker(
        'customer-portal-api', 
        this.organizationId, 
        'portal'
      );
      
      return await breaker.exec(async () => {
        // Verify this portal user has access to this customer
        const { data: links, error: linksError } = await supabase
          .from('customer_portal_user_links')
          .select('id')
          .eq('portal_user_id', this.portalUserId)
          .eq('customer_id', customerId);
          
        if (linksError) throw linksError;
        if (!links?.length) {
          return {
            success: false,
            error: 'You do not have permission to update this customer profile'
          };
        }
        
        // Execute transaction
        const result = await transactionManager.executeTransaction(
          [
            {
              table: 'customer_profile',
              type: 'update',
              match: { id: customerId, organization_id: this.organizationId },
              data: {
                ...sanitizedData,
                updated_at: new Date().toISOString(),
                qbo_sync_status: 'pending' // Mark for sync
              },
              returning: '*'
            }
          ],
          {
            entityType: 'customer_profile',
            entityId: customerId,
            organizationId: this.organizationId,
            portalUserId: this.portalUserId,
            source: 'portal'
          }
        );
        
        if (result.success) {
          // Log the profile update
          auditService.logEvent({
            type: 'portal.profile.updated',
            organizationId: this.organizationId,
            portalUserId: this.portalUserId,
            entityType: 'customer_profile',
            entityId: customerId,
            detail: {
              fields: Object.keys(profileData)
            }
          });
          
          return {
            success: true,
            data: result.results?.[0]?.[0]
          };
        } else {
          return {
            success: false,
            error: result.error
          };
        }
      });
    } catch (error) {
      console.error('Error updating customer profile:', error);
      
      // Log the error
      auditService.logEvent({
        type: 'portal.profile.updated',
        organizationId: this.organizationId,
        portalUserId: this.portalUserId,
        entityType: 'customer_profile',
        entityId: customerId,
        severity: 'error',
        detail: { error: String(error) }
      });
      
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }
  
  // Get customer invoices
  async getCustomerInvoices(customerId: string) {
    try {
      // Use circuit breaker
      const breaker = circuitBreakerManager.getBreaker(
        'customer-portal-api', 
        this.organizationId, 
        'portal'
      );
      
      return await breaker.exec(async () => {
        // Verify this portal user has access to this customer
        const { data: links, error: linksError } = await supabase
          .from('customer_portal_user_links')
          .select('id')
          .eq('portal_user_id', this.portalUserId)
          .eq('customer_id', customerId);
          
        if (linksError) throw linksError;
        if (!links?.length) return { error: 'Not authorized' };
        
        // Get invoices
        const { data: invoices, error: invoicesError } = await supabase
          .from('invoice_record')
          .select(`
            *,
            invoice_line_item (*)
          `)
          .eq('organization_id', this.organizationId)
          .eq('customer_id', customerId)
          .order('invoice_date', { ascending: false });
          
        if (invoicesError) throw invoicesError;
        
        // Log the invoice view
        auditService.logEvent({
          type: 'portal.invoice.viewed',
          organizationId: this.organizationId,
          portalUserId: this.portalUserId,
          entityType: 'invoice_record',
          detail: {
            customerId,
            count: invoices?.length || 0
          }
        });
        
        return { invoices: invoices || [] };
      });
    } catch (error) {
      console.error('Error fetching customer invoices:', error);
      
      // Log the error
      auditService.logEvent({
        type: 'portal.invoice.viewed',
        organizationId: this.organizationId,
        portalUserId: this.portalUserId,
        entityType: 'invoice_record',
        severity: 'error',
        detail: {
          customerId,
          error: String(error)
        }
      });
      
      return { error: 'Failed to load invoices' };
    }
  }
  
  // Get a specific invoice
  async getInvoiceDetails(invoiceId: string) {
    try {
      // Use circuit breaker
      const breaker = circuitBreakerManager.getBreaker(
        'customer-portal-api', 
        this.organizationId, 
        'portal'
      );
      
      return await breaker.exec(async () => {
        // Get the invoice with line items
        const { data: invoice, error: invoiceError } = await supabase
          .from('invoice_record')
          .select(`
            *,
            invoice_line_item (*)
          `)
          .eq('id', invoiceId)
          .eq('organization_id', this.organizationId)
          .single();
          
        if (invoiceError) throw invoiceError;
        if (!invoice) return { error: 'Invoice not found' };
        
        // Verify this portal user has access to this customer
        const { data: links, error: linksError } = await supabase
          .from('customer_portal_user_links')
          .select('id')
          .eq('portal_user_id', this.portalUserId)
          .eq('customer_id', invoice.customer_id);
          
        if (linksError) throw linksError;
        if (!links?.length) return { error: 'Not authorized' };
        
        // Log the invoice detail view
        auditService.logEvent({
          type: 'portal.invoice.viewed',
          organizationId: this.organizationId,
          portalUserId: this.portalUserId,
          entityType: 'invoice_record',
          entityId: invoiceId,
          detail: {
            customerId: invoice.customer_id,
            invoiceNumber: invoice.invoice_number
          }
        });
        
        return { invoice };
      });
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      
      // Log the error
      auditService.logEvent({
        type: 'portal.invoice.viewed',
        organizationId: this.organizationId,
        portalUserId: this.portalUserId,
        entityType: 'invoice_record',
        entityId: invoiceId,
        severity: 'error',
        detail: { error: String(error) }
      });
      
      return { error: 'Failed to load invoice details' };
    }
  }
}

// Factory function to create a customer portal service instance
export const createCustomerPortalService = (
  organizationId: string,
  portalUserId: string
) => {
  return new CustomerPortalService(organizationId, portalUserId);
};
