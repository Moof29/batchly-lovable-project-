
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { QBOSyncSettings } from "@/components/integrations/QBOSyncSettings";

export const QBOIntegrationSettingsTab = ({ syncSettings, updateSyncSettings }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Sync Settings</CardTitle>
      <CardDescription>Configure how data is synchronized with QuickBooks Online</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <QBOSyncSettings
        settings={syncSettings}
        updateSettings={updateSyncSettings}
      />
    </CardContent>
  </Card>
);
