
import { MainLayout } from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

export const PaymentsLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
