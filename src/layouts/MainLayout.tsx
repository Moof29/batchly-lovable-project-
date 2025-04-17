
import { Header } from "@/components/ui/header";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { NavigationMenu } from "./NavigationMenu";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarContent>
          <NavigationMenu />
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
