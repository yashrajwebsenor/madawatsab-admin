// Canonical permission values — must mirror the backend
// (backend/src/modules/auth/permissions.constants.ts). One permission per
// module/tab; holding it grants full access to that module.
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
