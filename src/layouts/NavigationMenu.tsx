
import { 
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import { Navigation } from '@/components/Navigation';

export const NavigationMenu = () => {
  return (
    <>
      <SidebarContent className="border-b border-border/50 pb-4 mb-2">
        <Logo />
      </SidebarContent>

      <SidebarContent>
        <SidebarHeader className="sr-only">Navigation</SidebarHeader>
        <Navigation />
      </SidebarContent>
    </>
  );
};
