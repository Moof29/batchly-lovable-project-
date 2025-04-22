
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CustomerPortalHeaderProps {
  onBack: () => void;
}

export const CustomerPortalHeader = ({ onBack }: CustomerPortalHeaderProps) => (
  <header className="sticky top-0 left-0 w-full bg-white shadow-lg flex items-center px-6 py-4 min-h-[68px] z-20 border-b">
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
    <h1 className="text-2xl font-bold text-gray-900 tracking-tight" style={{letterSpacing: "-0.02em"}}>Customer Portal</h1>
  </header>
);

export default CustomerPortalHeader;
