
import { MainLayout } from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

export const InventoryLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
