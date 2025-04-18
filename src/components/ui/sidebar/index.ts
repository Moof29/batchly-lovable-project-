
export * from "./base"
export * from "./context"
export * from "./menu"
export * from "./menu-button"
export * from "./types"

// Re-export specific components for backwards compatibility
export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter
} from "./base"

export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton
} from "./menu"

export {
  SidebarMenuButton
} from "./menu-button"

export {
  SidebarProvider,
  useSidebar
} from "./context"

// Compatibility exports for NavigationMenu component
export const SidebarGroup = SidebarContent;
export const SidebarGroupLabel = SidebarHeader;
export const SidebarGroupContent = SidebarContent;
