
import { useState, useEffect } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { createCustomerPortalService } from '@/services/customerPortal/CustomerPortalService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { auditService } from '@/utils/audit/AuditService';

export const useCustomerPortal = (portalUserId?: string, organizationId?: string) => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (portalUserId && organizationId) {
      setIsInitialized(true);
    }
  }, [portalUserId, organizationId]);
  
  // Create portal service instance when needed
  const getPortalService = () => {
    if (!portalUserId || !organizationId) {
      throw new Error('Portal user ID and organization ID are required');
    }
    return createCustomerPortalService(organizationId, portalUserId);
  };
  
  // Get customer profile
  const profileQuery = useQuery({
    queryKey: ['customerPortal', 'profile', portalUserId, organizationId],
    queryFn: async () => {
      const service = getPortalService();
      return await service.getCustomerProfile();
    },
    enabled: isInitialized
  });
  
  // Get customer invoices
  const useInvoices = (customerId?: string) => {
    return useQuery({
      queryKey: ['customerPortal', 'invoices', customerId, portalUserId, organizationId],
      queryFn: async () => {
        if (!customerId) return { invoices: [] };
        const service = getPortalService();
        return await service.getCustomerInvoices(customerId);
      },
      enabled: isInitialized && !!customerId
    });
  };
  
  // Get invoice details
  const useInvoiceDetails = (invoiceId?: string) => {
    return useQuery({
      queryKey: ['customerPortal', 'invoice', invoiceId, portalUserId, organizationId],
      queryFn: async () => {
        if (!invoiceId) return { invoice: null };
        const service = getPortalService();
        return await service.getInvoiceDetails(invoiceId);
      },
      enabled: isInitialized && !!invoiceId
    });
  };
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async ({
      customerId,
      profileData
    }: {
      customerId: string;
      profileData: any;
    }) => {
      const service = getPortalService();
      return await service.updateCustomerProfile(customerId, profileData);
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ['customerPortal', 'profile']
        });
        
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.'
        });
      } else {
        toast({
          title: 'Update Failed',
          description: data.error || 'Failed to update profile',
          variant: 'destructive'
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: 'An unexpected error occurred while updating your profile.',
        variant: 'destructive'
      });
      
      // Log the error
      if (portalUserId && organizationId) {
        auditService.logEvent({
          type: 'portal.profile.updated',
          organizationId,
          portalUserId,
          severity: 'error',
          detail: { error: String(error) }
        });
      }
    }
  });
  
  return {
    isInitialized,
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isPending,
    useInvoices,
    useInvoiceDetails,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending
  };
};
