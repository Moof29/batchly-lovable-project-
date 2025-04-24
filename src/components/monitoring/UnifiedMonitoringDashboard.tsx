
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from '@/components/common/StatusBadge';
import { useQBOSync } from '@/hooks/useQBOSync';
import { useQBOHealthMonitor } from '@/hooks/useQBOHealthMonitor';
import { usePortalActivity } from '@/hooks/usePortalActivity';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

export const UnifiedMonitoringDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const organizationId = user?.organization_id;

  // QBO integration data
  const { 
    connection: qboConnection,
    syncHistory,
    errors: qboErrors,
    isConnected: qboIsConnected
  } = useQBOSync(organizationId);
  
  const { health: qboHealth } = useQBOHealthMonitor(organizationId);
  
  // Portal activity data - this would be implemented in a separate hook
  const { 
    activeUsers,
    recentLogins,
    messageActivity,
    documentViews,
    paymentActivity
  } = usePortalActivity(organizationId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Monitoring Dashboard</h1>
        <div className="flex items-center gap-3">
          <StatusBadge 
            status={qboIsConnected ? "active" : "inactive"} 
            label={qboIsConnected ? "QBO Connected" : "QBO Disconnected"}
          />
          <StatusBadge 
            status={activeUsers > 0 ? "active" : "inactive"} 
            label={`${activeUsers} Portal Users Active`}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="qbo">QuickBooks</TabsTrigger>
          <TabsTrigger value="portal">Customer Portal</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SystemStatusCard 
              qboHealth={qboHealth} 
              portalActiveUsers={activeUsers}
              portalMessages={messageActivity.total}
              portalDocuments={documentViews.total}
            />
            <ActivitySummaryCard 
              qboSyncs={syncHistory?.length || 0}
              qboErrors={qboErrors?.length || 0}
              portalLogins={recentLogins.length}
              portalPayments={paymentActivity.total}
            />
            <ActionItemsCard 
              qboErrors={qboErrors?.length || 0}
              unresolvedMessages={messageActivity.unresolved}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Combined activity across QBO and Customer Portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={combineActivityData(syncHistory || [], recentLogins, messageActivity.recent)} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="qbo" fill="#8884d8" name="QBO Activity" />
                  <Bar dataKey="portal" fill="#82ca9d" name="Portal Activity" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="qbo" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QBOStatusCard health={qboHealth} connection={qboConnection} />
            <QBOSyncStatsCard syncHistory={syncHistory || []} />
            <QBOErrorSummaryCard errors={qboErrors || []} />
          </div>
          
          <QBOActivityTimeline syncHistory={syncHistory || []} />
        </TabsContent>
        
        <TabsContent value="portal" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PortalActivityCard 
              activeUsers={activeUsers}
              recentLogins={recentLogins}
            />
            <PortalMessagingCard messageActivity={messageActivity} />
            <PortalDocumentsCard documentViews={documentViews} />
          </div>
          
          <PortalPaymentChart paymentActivity={paymentActivity} />
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-6">
          <QBOErrorsTable errors={qboErrors || []} />
          <PortalErrorsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper components for dashboard
const SystemStatusCard = ({ qboHealth, portalActiveUsers, portalMessages, portalDocuments }) => (
  <Card>
    <CardHeader>
      <CardTitle>System Status</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">QBO Integration</span>
        <StatusBadge status={qboHealth.status} />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Customer Portal</span>
        <StatusBadge status={portalActiveUsers > 0 ? "active" : "inactive"} />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Message Center</span>
        <StatusBadge status={portalMessages > 0 ? "active" : "inactive"} />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Document Center</span>
        <StatusBadge status={portalDocuments > 0 ? "active" : "inactive"} />
      </div>
    </CardContent>
  </Card>
);

const ActivitySummaryCard = ({ qboSyncs, qboErrors, portalLogins, portalPayments }) => (
  <Card>
    <CardHeader>
      <CardTitle>Activity Summary (Last 24h)</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">QBO Syncs</span>
        <span className="font-medium">{qboSyncs}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Portal Logins</span>
        <span className="font-medium">{portalLogins}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Portal Payments</span>
        <span className="font-medium">{portalPayments}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">QBO Errors</span>
        <span className="font-medium text-red-600">{qboErrors}</span>
      </div>
    </CardContent>
  </Card>
);

const ActionItemsCard = ({ qboErrors, unresolvedMessages }) => (
  <Card>
    <CardHeader>
      <CardTitle>Action Items</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {qboErrors > 0 && (
        <div className="rounded-md bg-red-50 p-3 border border-red-100">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-red-800">
                {qboErrors} QBO sync errors need resolution
              </p>
            </div>
          </div>
        </div>
      )}
      
      {unresolvedMessages > 0 && (
        <div className="rounded-md bg-amber-50 p-3 border border-amber-100">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-amber-800">
                {unresolvedMessages} customer messages need response
              </p>
            </div>
          </div>
        </div>
      )}
      
      {qboErrors === 0 && unresolvedMessages === 0 && (
        <div className="rounded-md bg-green-50 p-3 border border-green-100">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-green-800">
                No action items needed at this time
              </p>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

// QBO specific components
const QBOStatusCard = ({ health, connection }) => (
  <Card>
    <CardHeader>
      <CardTitle>QBO Status</CardTitle>
    </CardHeader>
    <CardContent>
      {/* QBO status details */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Connection Status</span>
          <StatusBadge status={health.status} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Success Rate</span>
          <span className="font-medium">{health.successRate24h.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Last Sync</span>
          <span className="text-sm">{connection?.last_sync_at ? new Date(connection.last_sync_at).toLocaleString() : 'Never'}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QBOSyncStatsCard = ({ syncHistory }) => (
  <Card>
    <CardHeader>
      <CardTitle>Sync Statistics</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Sync stats */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-blue-50 p-3">
            <p className="text-xs font-medium text-blue-600">Total Syncs</p>
            <p className="text-2xl font-semibold">{syncHistory.length}</p>
          </div>
          <div className="rounded-md bg-green-50 p-3">
            <p className="text-xs font-medium text-green-600">Successful</p>
            <p className="text-2xl font-semibold">
              {syncHistory.filter(s => s.status === 'completed').length}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-amber-50 p-3">
            <p className="text-xs font-medium text-amber-600">Partial</p>
            <p className="text-2xl font-semibold">
              {syncHistory.filter(s => s.status === 'partial').length}
            </p>
          </div>
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-xs font-medium text-red-600">Failed</p>
            <p className="text-2xl font-semibold">
              {syncHistory.filter(s => s.status === 'failed').length}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QBOErrorSummaryCard = ({ errors }) => (
  <Card>
    <CardHeader>
      <CardTitle>Error Summary</CardTitle>
    </CardHeader>
    <CardContent>
      {errors.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">No errors detected</p>
        </div>
      ) : (
        <div className="space-y-3">
          {errors.slice(0, 3).map((error, i) => (
            <div key={i} className="border-l-4 border-red-400 pl-3 py-1">
              <p className="text-sm font-medium">{error.error_message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(error.last_occurred_at).toLocaleString()}
              </p>
            </div>
          ))}
          {errors.length > 3 && (
            <p className="text-sm text-muted-foreground text-center">
              +{errors.length - 3} more errors
            </p>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);

// Placeholder components for QBO activity timeline and errors table
const QBOActivityTimeline = ({ syncHistory }) => (
  <Card>
    <CardHeader>
      <CardTitle>QBO Sync Timeline</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Timeline visualization would be implemented here */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={transformSyncHistoryForChart(syncHistory)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="success" stroke="#82ca9d" />
          <Line type="monotone" dataKey="failure" stroke="#ff7875" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const QBOErrorsTable = ({ errors }) => (
  <Card>
    <CardHeader>
      <CardTitle>QBO Error Log</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Occurred</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {errors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No errors found</td>
              </tr>
            ) : (
              errors.map((error, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 text-sm text-gray-900">{error.error_message}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{error.error_category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(error.last_occurred_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{error.occurrence_count}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge 
                      status={error.is_resolved ? "success" : "error"} 
                      label={error.is_resolved ? "Resolved" : "Unresolved"}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

// Placeholder components for Portal tabs
const PortalActivityCard = ({ activeUsers, recentLogins }) => (
  <Card>
    <CardHeader>
      <CardTitle>Portal Activity</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Activity details */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Active Users</span>
          <span className="font-medium">{activeUsers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Recent Logins</span>
          <span className="font-medium">{recentLogins.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Last Login</span>
          <span className="text-sm">
            {recentLogins.length > 0 
              ? new Date(recentLogins[0].timestamp).toLocaleString() 
              : 'None'}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PortalMessagingCard = ({ messageActivity }) => (
  <Card>
    <CardHeader>
      <CardTitle>Message Center</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Message stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-blue-50 p-3">
          <p className="text-xs font-medium text-blue-600">Total Messages</p>
          <p className="text-2xl font-semibold">{messageActivity.total}</p>
        </div>
        <div className="rounded-md bg-amber-50 p-3">
          <p className="text-xs font-medium text-amber-600">Unread</p>
          <p className="text-2xl font-semibold">{messageActivity.unresolved}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PortalDocumentsCard = ({ documentViews }) => (
  <Card>
    <CardHeader>
      <CardTitle>Document Activity</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Document stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-blue-50 p-3">
          <p className="text-xs font-medium text-blue-600">Total Views</p>
          <p className="text-2xl font-semibold">{documentViews.total}</p>
        </div>
        <div className="rounded-md bg-green-50 p-3">
          <p className="text-xs font-medium text-green-600">Downloads</p>
          <p className="text-2xl font-semibold">{documentViews.downloads}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PortalPaymentChart = ({ paymentActivity }) => (
  <Card>
    <CardHeader>
      <CardTitle>Portal Payment Activity</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Payment chart would be implemented here */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={paymentActivity.recentPayments}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" name="Payment Amount" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const PortalErrorsTable = () => (
  <Card>
    <CardHeader>
      <CardTitle>Portal Error Log</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No errors found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

// Helper functions for data transformation
function combineActivityData(qboSyncHistory, portalLogins, portalMessages) {
  // Logic to combine activity data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  
  return last7Days.map(date => {
    const qboCount = qboSyncHistory.filter(s => 
      s.started_at && s.started_at.startsWith(date)
    ).length;
    
    const portalCount = [
      ...portalLogins.filter(l => l.timestamp && l.timestamp.startsWith(date)),
      ...portalMessages.filter(m => m.timestamp && m.timestamp.startsWith(date))
    ].length;
    
    return {
      date: date,
      qbo: qboCount,
      portal: portalCount
    };
  });
}

function transformSyncHistoryForChart(syncHistory) {
  // Group by date and count success/failure
  const grouped = syncHistory.reduce((acc, item) => {
    const date = item.started_at ? item.started_at.split('T')[0] : 'unknown';
    if (!acc[date]) acc[date] = { success: 0, failure: 0 };
    
    if (item.status === 'completed') acc[date].success++;
    else acc[date].failure++;
    
    return acc;
  }, {});
  
  // Convert to array for chart
  return Object.entries(grouped).map(([date, counts]) => ({
    date,
    success: counts.success,
    failure: counts.failure
  })).sort((a, b) => a.date.localeCompare(b.date));
}
