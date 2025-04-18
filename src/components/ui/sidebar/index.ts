
// Export all components from their respective files
export * from "./base"
export * from "./context"
export * from "./menu"
export * from "./menu-button"
export * from "./types"

// Re-export specific components from base.tsx for backwards compatibility
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter
} from "./base"

// Re-export specific components from menu.tsx
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton
} from "./menu"

// Re-export the menu button
import {
  SidebarMenuButton
} from "./menu-button"

// Re-export the context provider and hook
import {
  SidebarProvider,
  useSidebar
} from "./context"

// Now export all specifically imported components
export {
  // From base
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  
  // From menu
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  
  // From menu-button
  SidebarMenuButton,
  
  // From context
  SidebarProvider,
  useSidebar
}

// Compatibility exports for NavigationMenu component
export {
  SidebarContent as SidebarGroup,
  SidebarHeader as SidebarGroupLabel,
  SidebarContent as SidebarGroupContent
}
