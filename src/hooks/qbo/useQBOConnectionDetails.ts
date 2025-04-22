
import { useEffect, useState } from "react";
export const useQBOConnectionDetails = (connectionQueryData: any, isDevMode: boolean) => {
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  useEffect(() => {
    if (connectionQueryData) {
      if (isDevMode && typeof connectionQueryData === 'object' && connectionQueryData.enabled) {
        setConnectionDetails({
          companyName: connectionQueryData.companyName || 'Mock Company',
          companyId: connectionQueryData.companyId || '123456789',
          connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
      } else if (!isDevMode && connectionQueryData.is_active) {
        setConnectionDetails({
          companyName: connectionQueryData.qbo_company_id || 'QBO Company',
          companyId: connectionQueryData.qbo_realm_id,
          connectedAt: new Date(connectionQueryData.last_connected_at),
          expiresAt: new Date(connectionQueryData.qbo_token_expires_at),
        });
      } else {
        setConnectionDetails(null);
      }
    } else {
      setConnectionDetails(null);
    }
  }, [connectionQueryData, isDevMode]);
  return connectionDetails;
}
