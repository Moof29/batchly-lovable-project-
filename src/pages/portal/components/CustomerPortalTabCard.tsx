
import { Card } from "@/components/ui/card";

interface CustomerPortalTabCardProps {
  children: React.ReactNode;
  className?: string;
}

export const CustomerPortalTabCard = ({ children, className = "" }: CustomerPortalTabCardProps) => (
  <Card className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>
    {children}
  </Card>
);

export default CustomerPortalTabCard;
