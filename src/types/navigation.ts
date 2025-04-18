
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
}
