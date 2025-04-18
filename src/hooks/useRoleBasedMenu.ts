
import { useAuth } from '@/contexts/AuthContext';
import { getMenuItemsByRole } from '@/config/menuItems';

export const useRoleBasedMenu = () => {
  const { user } = useAuth();
  return user ? getMenuItemsByRole(user.role) : [];
};
