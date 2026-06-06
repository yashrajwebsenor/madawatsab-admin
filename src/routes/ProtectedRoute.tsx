import { Navigate } from "react-router-dom";
import usePermission from "@/hooks/usePermission";
import ROUTE_PATHS from "./route-paths";

// Guards a route by required permission. Auth (token) is handled by AppLayout;
// here we only enforce permission. Users hitting a route they lack permission
// for see a "no access" message instead of the page content.
const ForbiddenView = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h2 className="text-2xl font-bold text-gray-900">Access denied</h2>
    <p className="text-gray-500 mt-2 max-w-md">
      You don't have permission to view this page. Contact your administrator
      if you believe this is a mistake.
    </p>
  </div>
);

const ProtectedRoute = ({
  permission,
  children,
}: {
  permission?: string;
  children: React.ReactNode;
}) => {
  const token = localStorage.getItem("token");
  const { can } = usePermission();

  if (!token) {
    return <Navigate to={ROUTE_PATHS.AUTH.LOGIN} replace />;
  }

  if (!can(permission)) {
    return <ForbiddenView />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
