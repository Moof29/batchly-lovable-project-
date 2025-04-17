
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Configure your application settings here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
