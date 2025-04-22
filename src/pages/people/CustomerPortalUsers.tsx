
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

// Types for portal user and joined customer info
type PortalUser = {
  id: string;
  email: string;
  invited_at: string | null;
  accepted_at: string | null;
  customer_id: string | null;
  is_active: boolean;
  invite_token: string | null;
  created_at: string;
  customer: {
    id: string;
    display_name: string;
  } | null;
};

export default function CustomerPortalUsers() {
  // Simple pagination—can be improved, but follows minimal request
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  // Fetch portal users, join display_name of associated customer 
  const { data, isLoading, error } = useQuery({
    queryKey: ["portal_users", { page }],
    queryFn: async () => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Join customer display_name (assuming FK exists and is called customer_id)
      const { data, error } = await supabase
        .from("customer_portal_user")
        .select("id,email,invited_at,accepted_at,customer_id,is_active,invite_token,created_at,customer:customer_id(display_name,id)")
        .range(from, to)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PortalUser[];
    },
    keepPreviousData: true,
  });

  const portalUsers = data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Customer Portal Users</h1>
        {/* Placeholder: button for inviting users */}
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
            <div className="text-destructive">Error: {error.message}</div>
          ) : portalUsers.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No portal users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">Email</TableHead>
                    <TableHead className="w-40">Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invited</TableHead>
                    <TableHead>Accepted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portalUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {user.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.customer ? (
                          <Link
                            className="hover:underline text-brand-500"
                            to={`/people/customers/${user.customer.id}`}
                          >
                            <span className="flex items-center gap-1"><LinkIcon className="w-4 h-4" />{user.customer.display_name}</span>
                          </Link>
                        ) : (
                          <span className="text-gray-500">Unlinked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.invited_at ? (
                          <span title={user.invited_at}>
                            {new Date(user.invited_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.accepted_at ? (
                          <span title={user.accepted_at}>
                            {new Date(user.accepted_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link to={`/people/customers/portal/${user.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  aria-label="Previous page"
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">Page {page}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={portalUsers.length < PAGE_SIZE}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
