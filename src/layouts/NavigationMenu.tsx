
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent 
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import { Navigation } from '@/components/Navigation';

export const NavigationMenu = () => {
  return (
    <>
      <SidebarGroup className="border-b border-border/50 pb-4 mb-2">
        <Logo />
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="sr-only">Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <Navigation />
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
