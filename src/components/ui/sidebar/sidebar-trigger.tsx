
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

interface SidebarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, ...props }, ref) => {
  const { toggleSidebar, isMobile, state } = useSidebar()
  
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        "text-muted-foreground hover:text-foreground",
        isMobile ? "md:hidden" : "hidden md:flex",
        className
      )}
      onClick={toggleSidebar}
      aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
      {...props}
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
})

SidebarTrigger.displayName = "SidebarTrigger"
