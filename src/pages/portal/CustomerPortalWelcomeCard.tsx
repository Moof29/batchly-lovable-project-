
import { Card } from "@/components/ui/card";

interface CustomerPortalWelcomeCardProps {
  displayName: string;
}

export const CustomerPortalWelcomeCard = ({ displayName }: CustomerPortalWelcomeCardProps) => (
  <div className="w-full">
    <Card className="w-full bg-white shadow-lg rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Welcome, {displayName}</h2>
          <p className="text-gray-600 mt-1">View and manage your account information, invoices, and messages.</p>
        </div>
      </div>
    </Card>
  </div>
);

export default CustomerPortalWelcomeCard;
