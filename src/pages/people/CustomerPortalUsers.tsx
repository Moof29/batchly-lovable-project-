
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { usePortalUsers } from "@/hooks/people/usePortalUsers";
import { PortalUsersTable } from "@/components/people/PortalUsersTable";
import { TablePagination } from "@/components/people/TablePagination";

export default function CustomerPortalUsers() {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const { data: portalUsers = [], isLoading, error } = usePortalUsers(page, PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Customer Portal Users</h1>
        <Button asChild>
          <Link to="/people/customers/portal/invite">
            <Plus className="mr-2 h-4 w-4" />
            Invite Portal User
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>All Portal Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 flex justify-center text-muted-foreground">Loading portal users...</div>
          ) : error ? (
            <div className="text-destructive">Error: {(error as Error).message}</div>
          ) : portalUsers.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No portal users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <PortalUsersTable portalUsers={portalUsers} />
              <TablePagination
                page={page}
                setPage={setPage}
                hasNext={portalUsers.length >= PAGE_SIZE}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
