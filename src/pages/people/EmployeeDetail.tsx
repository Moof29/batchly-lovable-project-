
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const EmployeeDetail = () => {
  const { id } = useParams();

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_profile")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!employee) return <div>Employee not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {employee.first_name} {employee.last_name}
        </h1>
        <Badge variant={employee.is_active ? "default" : "secondary"}>
          {employee.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Display Name</dt>
                <dd className="text-sm">{employee.display_name || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm">{employee.email || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="text-sm">{employee.phone || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                <dd className="text-sm">{employee.mobile || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Birth Date</dt>
                <dd className="text-sm">
                  {employee.birth_date ? new Date(employee.birth_date).toLocaleDateString() : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="text-sm capitalize">{employee.gender || "-"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Employment Type</dt>
                <dd className="text-sm capitalize">{employee.employment_type || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
                <dd className="text-sm">
                  {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : "-"}
                </dd>
              </div>
              {employee.release_date && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Release Date</dt>
                  <dd className="text-sm">
                    {new Date(employee.release_date).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="text-sm">
                  {employee.address_line1}
                  {employee.address_line2 && (
                    <>
                      <br />
                      {employee.address_line2}
                    </>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="text-sm">{employee.city || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">State</dt>
                <dd className="text-sm">{employee.state || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                <dd className="text-sm">{employee.postal_code || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="text-sm">{employee.country || "-"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
