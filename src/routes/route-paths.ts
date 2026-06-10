const ROUTE_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  APP: {
    DASHBOARD: "/app/dashboard",
    USERS: {
      LIST: "/app/users",
      DETAILS: "/app/users/:id",
      CREATE: "/app/users/create",
    },
    ADMIN_USERS: {
      LIST: "/app/admin-users",
      CREATE: "/app/admin-users/create",
      UPDATE: "/app/admin-users/:id/update",
    },
    AGENTS: {
      LIST: "/app/agents",
      CREATE: "/app/agents/create",
      UPDATE: "/app/agents/:id/update",
      REQUESTS: "/app/agents/requests",
      CUSTOMERS: "/app/agents/customers",
    },
    ROLES: {
      LIST: "/app/roles",
      CREATE: "/app/roles/create",
      UPDATE: "/app/roles/:id/update",
    },
    PLANS: {
      LIST: "/app/plans",
      UPDATE: "/app/plans/:id/update",
      PREVIEW: "/app/plans/:id/preview",
    },
    CMS: {
      LIST: "/app/cms",
      UPDATE: "/app/cms/:slug/update",
    },
    ADVERTISEMENTS: {
      LIST: "/app/advertisements",
      CREATE: "/app/advertisements/create",
      UPDATE: "/app/advertisements/:id/update",
    },
    HELP_SUPPORT: {
      LIST: "/app/help-support",
    },
    PHOTO_REVIEWS: {
      LIST: "/app/photo-reviews",
      DETAILS: "/app/photo-reviews/:userId",
    },
    CONFIGS: {
      LIST: "/app/configs",
      METADATA: {
        LIST: "/app/configs/metadata/:type",
        CREATE: "/app/configs/metadata/:type/create",
      },
    },
  },
};

export default ROUTE_PATHS;
