
import { Card } from "@/components/ui/card";

interface CustomerPortalWelcomeCardProps {
  displayName: string;
}

export const CustomerPortalWelcomeCard = ({ displayName }: CustomerPortalWelcomeCardProps) => (
  <div className="w-full">
    <Card className="w-full bg-white shadow-lg rounded-xl p-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome, {displayName}
          </h2>
          <p className="text-gray-600 mt-1">
            View and manage your account information, invoices, and messages.
          </p>
        </div>
      </div>
    </Card>
  </div>
);

export default CustomerPortalWelcomeCard;
