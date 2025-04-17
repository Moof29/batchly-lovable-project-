
import { MainLayout } from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

export const SettingsLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
