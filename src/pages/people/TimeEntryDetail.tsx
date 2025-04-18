
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

export const TimeEntryDetail = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const { data: timeEntry, isLoading } = useQuery({
    queryKey: ["timeEntry", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_time_tracking")
        .select(`
          *,
          employee_profile:employee_id(first_name, last_name),
          customer_profile:customer_id(display_name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!timeEntry) return <div className="p-4">Time entry not found</div>;

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
          Time Entry Details
        </h1>
        <Badge variant={timeEntry.billable ? "default" : "secondary"}>
          {timeEntry.billable ? "Billable" : "Non-billable"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Employee</dt>
                <dd className="text-sm">
                  {timeEntry.employee_profile?.first_name} {timeEntry.employee_profile?.last_name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Customer</dt>
                <dd className="text-sm">{timeEntry.customer_profile?.display_name || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="text-sm">
                  {new Date(timeEntry.date).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Hours</dt>
                <dd className="text-sm">{timeEntry.hours}</dd>
              </div>
              {timeEntry.start_time && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                  <dd className="text-sm">{timeEntry.start_time}</dd>
                </div>
              )}
              {timeEntry.end_time && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">End Time</dt>
                  <dd className="text-sm">{timeEntry.end_time}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Break Time</dt>
                <dd className="text-sm">{timeEntry.break_time || "0"} hours</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {timeEntry.description && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm break-words">{timeEntry.description}</p>
            </CardContent>
          </Card>
        )}

        {timeEntry.billable && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Billable Rate</dt>
                  <dd className="text-sm">
                    ${timeEntry.billable_rate?.toFixed(2) || "0.00"}/hour
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                  <dd className="text-sm">
                    ${((timeEntry.billable_rate || 0) * timeEntry.hours).toFixed(2)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
