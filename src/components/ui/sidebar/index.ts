
// Export all components from their respective files
export * from "./base"
export * from "./context"
export * from "./menu"
export * from "./types"

// Re-export the context provider and hook for convenience
export {
  SidebarProvider,
  useSidebar
} from "./context"

// Re-export these specific components for backwards compatibility
export {
  SidebarContent,
  SidebarHeader
} from "./base"

// Re-export SidebarMenuButton from menu.tsx
export {
  SidebarMenu,
  SidebarMenuItem
} from "./menu"

// For compatibility with previous API usage patterns
import { SidebarContent, SidebarHeader } from "./base"
import { SidebarMenu, SidebarMenuItem } from "./menu"

// Type aliases for backwards compatibility
export type SidebarGroup = typeof SidebarContent
export type SidebarGroupLabel = typeof SidebarHeader
export type SidebarGroupContent = typeof SidebarContent
