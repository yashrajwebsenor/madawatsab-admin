import ROUTE_PATHS from "@/routes/route-paths";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MainSidebar from "./MainSidebar";
import MainHeader from "./MainHeader";
import { SidebarDrawerProvider } from "@/contexts/SidebarDrawerContext";
import SidebarDrawer from "../drawers/SidebarDrawer";

const AppLayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate(ROUTE_PATHS.AUTH.LOGIN);
    }
  }, [token, navigate]);

  return (
    <SidebarDrawerProvider>
      <div className="flex h-screen w-full bg-white">
        <MainSidebar />
        <main className="flex-1 overflow-hidden flex flex-col">
          <MainHeader />
          <div className="flex-1 overflow-y-auto px-3 py-6 bg-gray-50/90">
            <div className="container mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      <SidebarDrawer />
    </SidebarDrawerProvider>
  );
};

export default AppLayout;
