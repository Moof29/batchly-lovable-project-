
import { CircuitBreaker } from "@/utils/circuitBreaker";
import { toast } from "@/hooks/use-toast";

export const apiCircuitBreakers = {
  customer: new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 60000,
    halfOpenRetries: 2,
    onStateChange: (from, to) => {
      if (to === 'OPEN') {
        toast({
          title: "QBO Customer API Unavailable",
          description: "The system will retry automatically in 1 minute",
          variant: "destructive"
        });
      } else if (from === 'OPEN' && to === 'CLOSED') {
        toast({
          title: "QBO Customer API Restored",
          description: "Connectivity has been restored",
        });
      }
    }
  }),
  invoice: new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 60000,
    halfOpenRetries: 2,
    onStateChange: (from, to) => {
      if (to === 'OPEN') {
        toast({
          title: "QBO Invoice API Unavailable",
          description: "The system will retry automatically in 1 minute",
          variant: "destructive"
        });
      } else if (from === 'OPEN' && to === 'CLOSED') {
        toast({
          title: "QBO Invoice API Restored",
          description: "Connectivity has been restored",
        });
      }
    }
  }),
  bill: new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 60000,
    halfOpenRetries: 2,
    onStateChange: (from, to) => {
      if (to === 'OPEN') {
        toast({
          title: "QBO Bill API Unavailable",
          description: "The system will retry automatically in 1 minute",
          variant: "destructive"
        });
      } else if (from === 'OPEN' && to === 'CLOSED') {
        toast({
          title: "QBO Bill API Restored",
          description: "Connectivity has been restored",
        });
      }
    }
  }),
  auth: new CircuitBreaker({
    failureThreshold: 2,
    resetTimeout: 120000,
    halfOpenRetries: 1,
    onStateChange: (from, to) => {
      if (to === 'OPEN') {
        toast({
          title: "QBO Authentication Failed",
          description: "Check your connection settings",
          variant: "destructive"
        });
      }
    }
  })
};
