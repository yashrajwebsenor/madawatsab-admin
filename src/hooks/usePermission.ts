import useUserStore from "@/store/useUserStore";
import { UserTypes } from "@/types/enum";

// Permission helper for gating UI. super_admin always passes. Other admins are
// checked against the flat permission list resolved from their role at login
// (user.roleId.permissions).
const usePermission = () => {
  const { user } = useUserStore();

  const isSuperAdmin = user?.userType === UserTypes.super_admin;
  const granted: string[] = user?.roleId?.permissions ?? [];

  // True if the user has the given permission (or no permission is required).
  const can = (permission?: string) => {
    if (!permission) return true;
    if (isSuperAdmin) return true;
    return granted.includes(permission);
  };

  // True if the user has at least one of the given permissions.
  const canAny = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return true;
    if (isSuperAdmin) return true;
    return permissions.some((p) => granted.includes(p));
  };

  return { can, canAny, isSuperAdmin, permissions: granted };
};

export default usePermission;
