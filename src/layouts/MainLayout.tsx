
import { Header } from "@/components/ui/header";
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { NavigationMenu } from "./NavigationMenu";
import { LogoIcon } from "@/components/LogoIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar className="border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarContent>
          <div className="p-4 mb-2 flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <LogoIcon className="h-8 w-8" />
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Batchly</TooltipContent>}
            </Tooltip>
            {!isCollapsed && <SidebarTrigger className="hidden md:flex" />}
          </div>
          <NavigationMenu />
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 flex flex-col min-h-screen">
        <Header>
          <div className="flex items-center">
            <SidebarTrigger className="text-foreground mr-2" />
          </div>
        </Header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
