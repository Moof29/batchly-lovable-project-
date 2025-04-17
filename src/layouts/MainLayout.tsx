
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { NavigationMenu } from "./NavigationMenu";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <Sidebar className="border-r">
        <SidebarContent>
          <NavigationMenu />
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};
