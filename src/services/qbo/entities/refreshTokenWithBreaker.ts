
import { apiCircuitBreakers } from "../circuitBreakers";
import { qboService } from "../QBOService";

export async function refreshTokenWithBreaker() {
  try {
    return await apiCircuitBreakers.auth.exec(async () => {
      return await qboService.refreshToken();
    });
  } catch (error) {
    console.error("Enhanced token refresh failed:", error);
    return false;
  }
}
