
import { Header } from "@/components/ui/header";
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { NavigationMenu } from "./navigation/NavigationMenu";
import { LogoIcon } from "@/components/LogoIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <Sidebar className="border-r border-border/50 bg-white shadow-md">
        <SidebarContent>
          <div className="p-4 mb-4 flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <LogoIcon className="h-8 w-8" />
                  {!isCollapsed && <span className="ml-2 text-lg font-semibold">Batchly</span>}
                </div>
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
