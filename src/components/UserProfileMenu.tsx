
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Settings, User, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types/auth";

const getRoleBadgeStyle = (role: UserRole) => {
  switch(role) {
    case 'admin':
      return "bg-red-100 text-red-800 border-red-200";
    case 'sales_manager':
      return "bg-blue-100 text-blue-800 border-blue-200";
    case 'warehouse_staff':
      return "bg-amber-100 text-amber-800 border-amber-200";
    case 'delivery_driver':
      return "bg-green-100 text-green-800 border-green-200";
    case 'customer_service':
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getRoleLabel = (role: UserRole) => {
  switch(role) {
    case 'admin':
      return "Admin";
    case 'sales_manager':
      return "Sales Manager";
    case 'warehouse_staff':
      return "Warehouse Staff";
    case 'delivery_driver':
      return "Delivery Driver";
    case 'customer_service':
      return "Customer Service";
    default:
      return role;
  }
};

export const UserProfileMenu = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button variant="ghost" size="icon" onClick={() => navigate("/auth")}>
        <User className="h-5 w-5" />
      </Button>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const initials = user.first_name && user.last_name 
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}` 
    : user.email.substring(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || ""} alt={user.first_name || user.email} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <Badge variant="outline" className={`mt-2 ${getRoleBadgeStyle(user.role)}`}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate(`/profile`)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {hasPermission('admin') && (
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          )}
          {hasPermission('admin') && (
            <DropdownMenuItem onClick={() => navigate('/users')}>
              <UserCog className="mr-2 h-4 w-4" />
              <span>User Management</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
