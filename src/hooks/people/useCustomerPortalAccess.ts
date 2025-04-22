
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomerPortalAccessService } from "@/services/people/CustomerPortalAccessService";

export function useCustomerPortalAccess(customerId: string) {
  const queryClient = useQueryClient();

  const { data: hasAccess, isLoading, refetch } = useQuery({
    queryKey: ["portalAccess", customerId],
    queryFn: () => CustomerPortalAccessService.hasPortalAccess(customerId),
  });

  const grantMutation = useMutation({
    mutationFn: () => CustomerPortalAccessService.grantPortalAccess(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portalAccess", customerId] });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: () => CustomerPortalAccessService.revokePortalAccess(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portalAccess", customerId] });
    },
  });

  const setAccess = (allowed: boolean) => {
    if (allowed) grantMutation.mutate();
    else revokeMutation.mutate();
  };

  return {
    hasAccess: !!hasAccess,
    isLoading: isLoading || grantMutation.isPending || revokeMutation.isPending,
    error: grantMutation.error || revokeMutation.error,
    setAccess,
    refetch,
  };
}
