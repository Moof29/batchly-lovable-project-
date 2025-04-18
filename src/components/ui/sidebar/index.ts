
// Export all components from their respective files
export * from "./base"
export * from "./context"
export * from "./menu"
export * from "./menu-button"
export * from "./types"

// Re-export specific components
export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "./base"

export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./menu"

// Re-export the context provider and hook
export {
  SidebarProvider,
  useSidebar
} from "./context"

// Compatibility exports for NavigationMenu component
export {
  SidebarContent as SidebarGroup,
  SidebarHeader as SidebarGroupLabel,
  SidebarContent as SidebarGroupContent
}
