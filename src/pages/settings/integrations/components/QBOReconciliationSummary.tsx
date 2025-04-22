
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const QBOReconciliationSummary = ({
  summaryStats,
  data,
  entityTypes,
  displayNames
}: {
  summaryStats: any;
  data: any[];
  entityTypes: string[];
  displayNames: Record<string, string>;
}) => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle>Synchronization Summary</CardTitle>
      <CardDescription>Overview of data reconciliation status between Batchly and QBO</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Sync Progress</span>
            <span className="text-sm font-medium">{summaryStats.syncPercentage}%</span>
          </div>
          <Progress value={summaryStats.syncPercentage} className="h-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Total Records</p>
            <p className="text-2xl font-bold">{summaryStats.total}</p>
          </div>
          <div className="bg-green-50 rounded-xl shadow p-4 text-center">
            <p className="text-sm text-green-700 mb-1">Synced</p>
            <p className="text-2xl font-bold text-green-700">{summaryStats.synced}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl shadow p-4 text-center">
            <p className="text-sm text-yellow-700 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{summaryStats.pending}</p>
          </div>
          <div className="bg-red-50 rounded-xl shadow p-4 text-center">
            <p className="text-sm text-red-700 mb-1">Errors</p>
            <p className="text-2xl font-bold text-red-700">{summaryStats.error}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Entity Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entityTypes.map(type => {
              const entityData = data.filter(row => row.entityType === type);
              if (entityData.length === 0) return null;
              const synced = entityData.filter(row => row.batchlyStatus === 'synced' && row.qboStatus === 'synced').length;
              const percent = Math.round((synced / entityData.length) * 100);
              return (
                <div key={type} className="bg-white rounded-xl shadow p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{displayNames[type]}</h4>
                    <Badge variant={percent === 100 ? "secondary" : "outline"} className={percent === 100 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                      {percent}%
                    </Badge>
                  </div>
                  <Progress value={percent} className="h-1 mb-2" />
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Total: {entityData.length}</span>
                    <span>Synced: {synced}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
