
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePortalActivity = (organizationId?: string) => {
  // Query for active users and recent logins
  const usersQuery = useQuery({
    queryKey: ['portal', 'users', organizationId],
    queryFn: async () => {
      if (!organizationId) return { activeUsers: 0, recentLogins: [] };

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      try {
        // Get login events
        const { data: loginEvents, error: loginError } = await supabase
          .from('audit_events')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('event_type', 'portal_login')
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .order('created_at', { ascending: false });
        
        if (loginError) throw loginError;
        
        // Count distinct users who had login events in the last 24 hours
        const distinctUsers = new Set();
        loginEvents?.forEach(event => {
          if (event.portal_user_id) {
            distinctUsers.add(event.portal_user_id);
          }
        });
        
        return {
          activeUsers: distinctUsers.size,
          recentLogins: loginEvents ? loginEvents.map(event => ({
            userId: event.portal_user_id,
            timestamp: event.created_at,
            ipAddress: event.metadata && typeof event.metadata === 'object' ? (event.metadata as any).ip_address : null,
            userAgent: event.metadata && typeof event.metadata === 'object' ? (event.metadata as any).user_agent : null
          })) : []
        };
      } catch (error) {
        console.error('Error fetching portal user activity:', error);
        return { activeUsers: 0, recentLogins: [] };
      }
    },
    enabled: !!organizationId
  });
  
  // Query for message activity
  const messagesQuery = useQuery({
    queryKey: ['portal', 'messages', organizationId],
    queryFn: async () => {
      if (!organizationId) return { 
        total: 0, 
        unresolved: 0, 
        recent: [],
        byCustomer: {}
      };

      try {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        
        // Get message stats
        const { data: messages, error: msgsError } = await supabase
          .from('customer_messages')
          .select('*')
          .eq('organization_id', organizationId);
        
        if (msgsError) throw msgsError;
        
        // Get recent messages
        const { data: recentMessages, error: recentError } = await supabase
          .from('customer_messages')
          .select('*')
          .eq('organization_id', organizationId)
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .order('created_at', { ascending: false });
          
        if (recentError) throw recentError;
        
        // Count unread messages
        const unresolved = messages?.filter(msg => msg.status === 'unread').length || 0;
        
        // Group by customer
        const byCustomer = messages?.reduce((acc, msg) => {
          const customerId = msg.customer_id;
          if (!acc[customerId]) acc[customerId] = { total: 0, unread: 0 };
          acc[customerId].total++;
          if (msg.status === 'unread') acc[customerId].unread++;
          return acc;
        }, {}) || {};
        
        return {
          total: messages?.length || 0,
          unresolved,
          recent: recentMessages ? recentMessages.map(msg => ({
            id: msg.id,
            customerId: msg.customer_id,
            subject: msg.subject,
            status: msg.status,
            timestamp: msg.created_at
          })) : [],
          byCustomer
        };
      } catch (error) {
        console.error('Error fetching portal message activity:', error);
        return { 
          total: 0, 
          unresolved: 0, 
          recent: [],
          byCustomer: {}
        };
      }
    },
    enabled: !!organizationId
  });
  
  // Query for document views
  const documentsQuery = useQuery({
    queryKey: ['portal', 'documents', organizationId],
    queryFn: async () => {
      if (!organizationId) return { total: 0, downloads: 0, recent: [] };

      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // We'll use audit_events table assuming it tracks document views/downloads
        const { data: docEvents, error } = await supabase
          .from('audit_events')
          .select('*')
          .eq('organization_id', organizationId)
          .in('event_type', ['document_view', 'document_download'])
          .gte('created_at', thirtyDaysAgo.toISOString());
          
        if (error) throw error;
        
        const views = docEvents?.filter(e => e.event_type === 'document_view').length || 0;
        const downloads = docEvents?.filter(e => e.event_type === 'document_download').length || 0;
        
        return {
          total: views,
          downloads,
          recent: docEvents ? docEvents.map(event => ({
            id: event.id,
            eventType: event.event_type,
            entityId: event.entity_id,
            userId: event.portal_user_id,
            timestamp: event.created_at,
            documentName: event.metadata && typeof event.metadata === 'object' ? (event.metadata as any).document_name : null
          })) : []
        };
      } catch (error) {
        console.error('Error fetching portal document activity:', error);
        return { total: 0, downloads: 0, recent: [] };
      }
    },
    enabled: !!organizationId
  });
  
  // Query for payment activity
  const paymentsQuery = useQuery({
    queryKey: ['portal', 'payments', organizationId],
    queryFn: async () => {
      if (!organizationId) return { 
        total: 0, 
        totalAmount: 0,
        recentPayments: [] 
      };

      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Get payments made through the portal
        const { data: payments, error } = await supabase
          .from('payment_receipt')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('payment_gateway', 'portal')
          .gte('payment_date', thirtyDaysAgo.toISOString());
          
        if (error) throw error;
        
        // Calculate total amount
        const totalAmount = payments?.reduce((sum, payment) => sum + (payment.total_amount || 0), 0) || 0;
        
        // Group by date for the chart
        const byDate = payments?.reduce((acc, payment) => {
          const dateKey = payment.payment_date;
          if (!acc[dateKey]) acc[dateKey] = { date: dateKey, amount: 0, count: 0 };
          acc[dateKey].amount += (payment.total_amount || 0);
          acc[dateKey].count += 1;
          return acc;
        }, {}) || {};
        
        const recentPayments = Object.values(byDate).sort((a: any, b: any) => 
          a.date.localeCompare(b.date)
        );
        
        return {
          total: payments?.length || 0,
          totalAmount,
          recentPayments
        };
      } catch (error) {
        console.error('Error fetching portal payment activity:', error);
        return { 
          total: 0, 
          totalAmount: 0,
          recentPayments: [] 
        };
      }
    },
    enabled: !!organizationId
  });
  
  return {
    activeUsers: usersQuery.data?.activeUsers || 0,
    recentLogins: usersQuery.data?.recentLogins || [],
    isLoadingUsers: usersQuery.isLoading,
    
    messageActivity: {
      total: messagesQuery.data?.total || 0,
      unresolved: messagesQuery.data?.unresolved || 0,
      recent: messagesQuery.data?.recent || [],
      byCustomer: messagesQuery.data?.byCustomer || {}
    },
    isLoadingMessages: messagesQuery.isLoading,
    
    documentViews: {
      total: documentsQuery.data?.total || 0,
      downloads: documentsQuery.data?.downloads || 0,
      recent: documentsQuery.data?.recent || []
    },
    isLoadingDocuments: documentsQuery.isLoading,
    
    paymentActivity: {
      total: paymentsQuery.data?.total || 0,
      totalAmount: paymentsQuery.data?.totalAmount || 0,
      recentPayments: paymentsQuery.data?.recentPayments || []
    },
    isLoadingPayments: paymentsQuery.isLoading
  };
};
