
import { LucideIcon } from 'lucide-react';
import { UserRole } from './auth';

export interface MenuItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  permissions: UserRole[];
  children?: MenuItem[];
  showInDevMode?: boolean; // Whether to show in dev mode
  showWhenAuthenticated?: boolean; // Whether to show when authenticated
  id?: string; // Optional id field for Navigation.tsx
}

// Adding the SubModule type that's referenced in NavigationSubmenu.tsx
export interface SubModule {
  id: string;
  name: string;
  path: string;
}
