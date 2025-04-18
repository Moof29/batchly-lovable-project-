
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure your application settings and preferences.
        </p>
      </div>
      <Separator />
      
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="company-name">Company Name</Label>
          <Input id="company-name" placeholder="Enter your company name" />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="timezone">Timezone</Label>
          <Input id="timezone" placeholder="UTC" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications for important events.
            </p>
          </div>
          <Switch id="notifications" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Enable dark mode for the application interface.
            </p>
          </div>
          <Switch id="dark-mode" />
        </div>
        
        <Button className="w-full md:w-auto">Save Changes</Button>
      </div>
    </div>
  );
};
