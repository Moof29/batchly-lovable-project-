
import { usePortalUserActivity } from './portal/usePortalUserActivity';
import { usePortalMessageActivity } from './portal/usePortalMessageActivity';
import { usePortalDocumentActivity } from './portal/usePortalDocumentActivity';
import { usePortalPaymentActivity } from './portal/usePortalPaymentActivity';

export const usePortalActivity = (organizationId?: string) => {
  const userActivity = usePortalUserActivity(organizationId);
  const messageActivity = usePortalMessageActivity(organizationId);
  const documentActivity = usePortalDocumentActivity(organizationId);
  const paymentActivity = usePortalPaymentActivity(organizationId);

  return {
    activeUsers: userActivity.data?.activeUsers || 0,
    recentLogins: userActivity.data?.recentLogins || [],
    isLoadingUsers: userActivity.isLoading,
    
    messageActivity: {
      total: messageActivity.data?.total || 0,
      unresolved: messageActivity.data?.unresolved || 0,
      recent: messageActivity.data?.recent || [],
      byCustomer: messageActivity.data?.byCustomer || {}
    },
    isLoadingMessages: messageActivity.isLoading,
    
    documentViews: {
      total: documentActivity.data?.total || 0,
      downloads: documentActivity.data?.downloads || 0,
      recent: documentActivity.data?.recent || []
    },
    isLoadingDocuments: documentActivity.isLoading,
    
    paymentActivity: {
      total: paymentActivity.data?.total || 0,
      totalAmount: paymentActivity.data?.totalAmount || 0,
      recentPayments: paymentActivity.data?.recentPayments || []
    },
    isLoadingPayments: paymentActivity.isLoading
  };
};
