
import { Outlet } from "react-router-dom";

export const PortalLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default PortalLayout;
