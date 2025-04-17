
import { MainLayout } from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

export const SalesLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
