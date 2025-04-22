
import { Mail, Link as LinkIcon, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Link } from "react-router-dom";
import type { PortalUser } from "@/hooks/people/usePortalUsers";

type Props = {
  portalUsers: PortalUser[];
};

export function PortalUsersTable({ portalUsers }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-40">Email</TableHead>
          <TableHead className="w-40">Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Invited</TableHead>
          <TableHead>Accepted</TableHead>
          <TableHead className="w-56">Actions</TableHead>
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
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/people/customers/portal/${user.id}`}>View</Link>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  asChild
                  aria-label="View as customer"
                >
                  <Link
                    to={`/people/customers/portal/impersonate/${user.id}`}
                    title="View this portal as the customer"
                  >
                    <UserIcon className="w-4 h-4 mr-1" />
                    View as Customer
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
