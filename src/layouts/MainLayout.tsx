
import { Header } from "@/components/ui/header";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import { NavigationMenu } from "./NavigationMenu";
import { useIsMobile } from "@/hooks/use-mobile";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar 
        className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        data-collapsible={isMobile ? "offcanvas" : "icon"}
      >
        <SidebarContent>
          <NavigationMenu />
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mx-auto max-w-7xl space-y-4 md:space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
