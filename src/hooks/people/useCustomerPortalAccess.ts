
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomerPortalAccessService } from "@/services/people/CustomerPortalAccessService";
import { toast } from "sonner";

export function useCustomerPortalAccess(customerId: string) {
  const queryClient = useQueryClient();

  const { data: hasAccess, isLoading, refetch } = useQuery({
    queryKey: ["portalAccess", customerId],
    queryFn: () => CustomerPortalAccessService.hasPortalAccess(customerId),
    enabled: !!customerId,
  });

  const grantMutation = useMutation({
    mutationFn: () => CustomerPortalAccessService.grantPortalAccess(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portalAccess", customerId] });
      toast.success("Portal access granted successfully");
    },
    onError: (error) => {
      console.error("Failed to grant portal access:", error);
      toast.error("Failed to grant portal access");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: () => CustomerPortalAccessService.revokePortalAccess(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portalAccess", customerId] });
      toast.success("Portal access revoked successfully");
    },
    onError: (error) => {
      console.error("Failed to revoke portal access:", error);
      toast.error("Failed to revoke portal access");
    },
  });

  const setAccess = (allowed: boolean) => {
    if (allowed) {
      grantMutation.mutate();
    } else {
      revokeMutation.mutate();
    }
  };

  return {
    hasAccess: !!hasAccess,
    isLoading: isLoading || grantMutation.isPending || revokeMutation.isPending,
    error: grantMutation.error || revokeMutation.error,
    setAccess,
    refetch,
  };
}
