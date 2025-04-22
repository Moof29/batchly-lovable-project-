
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CustomerPortalHeaderProps {
  onBack: () => void;
}

export const CustomerPortalHeader = ({ onBack }: CustomerPortalHeaderProps) => (
  <header className="w-full bg-white shadow-lg flex items-center px-6 py-4 min-h-[68px] z-10">
    <Button
      onClick={onBack}
      aria-label="Back to Admin"
      variant="outline"
      size="sm"
      className="mr-4"
    >
      <ArrowLeft className="h-4 w-4 mr-2" aria-hidden />
      Back to Admin
    </Button>
    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Portal</h1>
  </header>
);

export default CustomerPortalHeader;
