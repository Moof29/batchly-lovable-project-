
import { LucideIcon } from 'lucide-react';

export interface SubModule {
  id: string;
  name: string;
  path: string;
}

export interface MenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  path: string;
  subModules?: SubModule[];
}
