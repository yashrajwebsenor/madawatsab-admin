import { Navigate } from "react-router-dom";
import useUserStore from "@/store/useUserStore";
import usePermission from "@/hooks/usePermission";
import { navigations } from "@/configs/data";
import { UserTypes } from "@/types/enum";
import { PERMISSIONS } from "@/configs/permissions";
import ROUTE_PATHS from "./route-paths";

// Picks the right landing page for the current user instead of hardcoding the
// dashboard (which an agent / limited admin has no permission to view).
const HomeRedirect = () => {
  const { user } = useUserStore();
  const { can } = usePermission();

  if (!user) {
    return <Navigate to={ROUTE_PATHS.AUTH.LOGIN} replace />;
  }

  // Agents have their own portal — send them to their customers list.
  if (user.userType === UserTypes.agent) {
    return <Navigate to={ROUTE_PATHS.APP.AGENTS.CUSTOMERS} replace />;
  }

  // Admins land on the dashboard if allowed, else on the first sidebar tab
  // their role can access.
  if (can(PERMISSIONS.DASHBOARD)) {
    return <Navigate to={ROUTE_PATHS.APP.DASHBOARD} replace />;
  }

  const firstAllowed = (navigations[UserTypes.admin] || [])
    .flatMap((section: any) => section.child || [])
    .find((nav: any) => nav.href && can(nav.permission));

  return (
    <Navigate to={firstAllowed?.href ?? ROUTE_PATHS.APP.DASHBOARD} replace />
  );
};

export default HomeRedirect;
