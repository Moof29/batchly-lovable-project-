
import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
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
        "h-9 w-9 rounded-md",
        state === "expanded" ? "text-foreground" : "text-primary",
        className
      )}
      onClick={toggleSidebar}
      aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
      {...props}
    >
      {isMobile ? (
        <Menu className="h-5 w-5" />
      ) : (
        state === "expanded" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
      )}
    </Button>
  )
})

SidebarTrigger.displayName = "SidebarTrigger"
