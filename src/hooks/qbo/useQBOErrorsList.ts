
import { useEffect, useState } from "react";
export const useQBOErrorsList = (errorsQueryData: any) => {
  const [syncErrors, setSyncErrors] = useState<any[]>([]);
  useEffect(() => {
    if (errorsQueryData) setSyncErrors(errorsQueryData);
    else setSyncErrors([]);
  }, [errorsQueryData]);
  return syncErrors;
}
