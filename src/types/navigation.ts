
import { LucideIcon } from 'lucide-react';
import { UserRole } from './auth';

export interface MenuItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  permissions: UserRole[];
  children?: MenuItem[];
  showInDevMode?: boolean;
  showWhenAuthenticated?: boolean;
  id?: string;
}

export interface SubModule {
  id: string;
  name: string;
  path: string;
}
