// ============================================================================
// CANONICAL PERMISSION CATALOG
// ----------------------------------------------------------------------------
// One permission per module/tab. Holding a module's permission grants full
// access to every action in that module (read/create/update/delete).
//
// The catalog lives in the `Permission` collection and is produced from
// PERMISSION_GROUPS below by the seeder. A Role stores a flat array of these
// value strings (Model A), e.g. ["users", "roles"].
// ============================================================================

export const PERMISSIONS = {
  DASHBOARD: "dashboard",
  ADMIN_USERS: "admin_users",
  ROLES: "roles",
  AGENTS: "agents",
  USERS: "users",
  PLANS: "plans",
  ADVERTISEMENTS: "advertisements",
  HELP_SUPPORT: "help_support",
  CMS: "cms",
  METADATA: "metadata",
  CONFIGS: "configs",
  NOTIFICATIONS: "notifications",
} as const;

// Catalog used to seed the `Permission` collection and to render the checkbox
// UI in the admin panel. A single group holds one checkbox per module.
export const PERMISSION_GROUPS: {
  name: string;
  permissions: { name: string; value: string }[];
}[] = [
  {
    name: "Module Access",
    permissions: [
      { name: "Dashboard", value: PERMISSIONS.DASHBOARD },
      { name: "Admin Users", value: PERMISSIONS.ADMIN_USERS },
      { name: "Roles & Permissions", value: PERMISSIONS.ROLES },
      { name: "Agents", value: PERMISSIONS.AGENTS },
      { name: "Users", value: PERMISSIONS.USERS },
      { name: "Subscription Plans", value: PERMISSIONS.PLANS },
      { name: "Advertisements", value: PERMISSIONS.ADVERTISEMENTS },
      { name: "Help & Support", value: PERMISSIONS.HELP_SUPPORT },
      { name: "CMS", value: PERMISSIONS.CMS },
      { name: "Metadata", value: PERMISSIONS.METADATA },
      { name: "Configs", value: PERMISSIONS.CONFIGS },
      { name: "Notifications", value: PERMISSIONS.NOTIFICATIONS },
    ],
  },
];
