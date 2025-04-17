
import { Header } from "@/components/ui/header";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { NavigationMenu } from "./NavigationMenu";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar className="border-r">
        <SidebarContent>
          <NavigationMenu />
        </SidebarContent>
      </Sidebar>
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
