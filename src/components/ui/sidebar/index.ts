
// Export all components from their respective files
export * from "./base"
export * from "./context"
export * from "./menu"
export * from "./types"

// Re-export the context provider and hook
export {
  SidebarProvider,
  useSidebar
} from "./context"

// We don't need to re-export components that are already exported via export *
// The compatibility exports below are causing the error
// because they're trying to re-export components that are already exported

// Compatibility exports for NavigationMenu component
// Only include these if needed and properly imported
export {
  SidebarContent,
  SidebarHeader
} from "./base"

// No need to re-export SidebarContent twice
// export {
//   SidebarContent as SidebarGroupContent
// } from "./base"

// Instead, provide type aliases if needed
export type SidebarGroup = typeof SidebarHeader
export type SidebarGroupLabel = typeof SidebarHeader
export type SidebarGroupContent = typeof SidebarContent
