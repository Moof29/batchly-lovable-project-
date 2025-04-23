
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Menu } from "lucide-react";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { useSidebar } from "@/components/ui/sidebar/context"; // Import sidebar hook

export function Header() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar(); // Access context

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between space-x-4 px-4 md:px-6">
        {/* Hamburger button on mobile */}
        <div className="flex items-center gap-2 flex-1">
          <button
            type="button"
            aria-label="Open navigation menu"
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900"
            onClick={() => setOpenMobile(true)}
            tabIndex={0}
          >
            <Menu className="h-6 w-6" />
          </button>
          {/* Desktop search bar */}
          <form className="hidden lg:block flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-muted/50 border-muted pl-8 focus-visible:ring-1 placeholder:text-muted-foreground/70"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
            <span className="sr-only">Notifications</span>
          </Button>
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
