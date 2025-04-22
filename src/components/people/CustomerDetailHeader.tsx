
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

type CustomerDetailHeaderProps = {
  displayName: string;
  customerId: string;
  portalAccess: boolean;
  portalLoading: boolean;
  setPortalAccess: (val: boolean) => void;
};

export const CustomerDetailHeader = ({
  displayName,
  customerId,
  portalAccess,
  portalLoading,
  setPortalAccess,
}: CustomerDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{displayName}</h1>
        <div className="flex items-center gap-2">
          <Switch
            checked={portalAccess}
            disabled={portalLoading}
            onCheckedChange={setPortalAccess}
            aria-label="Toggle portal access"
          />
          <span className="text-sm">Portal Access</span>
        </div>
      </div>
      {portalAccess && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/portal?asCustomer=${customerId}`)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View as Customer
        </Button>
      )}
    </div>
  );
};
