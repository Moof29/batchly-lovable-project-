
import { MainLayout } from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

export const PeopleLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
