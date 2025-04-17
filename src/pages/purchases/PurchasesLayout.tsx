
import { MainLayout } from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

export const PurchasesLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
