const ENDPOINTS = {
  DASHBOARD: {
    STATS: "dashboard/stats",
  },
  AUTH: {
    LOGIN: "auth/login",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    DETAILS: (id: string) => `/users/${id}`,
    VERIFY: (id: string) => `/users/${id}/verify`,
    BAN: (id: string) => `/users/${id}/ban`,
  },
  PERMISSIONS: {
    ALL: "/permissions",
  },
  ROLES: {
    LIST: "roles",
    CREATE: "roles/create",
    OPTIONS: "roles/options",
    DETAILS: (id: string) => `roles/${id}`,
    UPDATE: (id: string) => `roles/${id}`,
    DELETE: (id: string) => `roles/${id}`,
  },
  ADMIN_USERS: {
    CREATE: "create",
    LIST: "/",
    DETAILS: (id: string) => `admin-users/${id}`,
    UPDATE: (id: string) => `${id}`,
    DELETE: (id: string) => `${id}`,
  },
  AGENTS: {
    CREATE: "agents",
    LIST: "agents",
    USERS_LIST: "agents/users",
    REQUESTS: "agents/requests",
    UPDATE: (id: string) => `agents/${id}`,
    DELETE: (id: string) => `agents/${id}`,
    UPDATE_REQUEST: (id: string) => `agents/requests/${id}`,
  },
  PLANS: {
    CREATE: "plans",
    LIST: "plans",
    DETAILS: (id: string) => `plans/${id}`,
    UPDATE: (id: string) => `plans/${id}`,
    DELETE: (id: string) => `plans/${id}`,
  },
  CMS: {
    LIST: "/cms",
    DETAILS: (slug: string) => `/cms/${slug}`,
    UPDATE: (slug: string) => `/cms/${slug}`,
  },
  ADVERTISEMENTS: {
    CREATE: "advertisements",
    LIST: "advertisements",
    DETAILS: (id: string) => `advertisements/${id}`,
    UPDATE: (id: string) => `advertisements/${id}`,
    DELETE: (id: string) => `advertisements/${id}`,
    UPDATE_STATUS: (id: string) => `advertisements/${id}/status`,
  },
  HELP_SUPPORT: {
    LIST: "help-support",
    UPDATE_STATUS: (id: string) => `help-support/${id}/status`,
  },
  REPORTS: {
    LIST: "reports",
    DETAILS: (id: string) => `reports/${id}`,
    UPDATE_STATUS: (id: string) => `reports/${id}/status`,
    BAN_USER: (id: string) => `reports/${id}/ban-user`,
    UNBAN_USER: (id: string) => `reports/${id}/unban-user`,
  },
  CONFIGS: {
    LIST: "configs",
    UPDATE: (id: string) => `configs/${id}`,
    COUNTRIES: "configs/countries",
    STATES: (countryId: string) => `configs/states/${countryId}`,
    CITIES: (countryId: string, stateId: string) =>
      `configs/cities/${countryId}/${stateId}`,
  },
  NOTIFICATIONS: {
    SEND: "notifications/send",
  },
  ATTACHMENTS: {
    DELETE: (id: string) => `attachments/${id}`,
  },
  PHOTO_REVIEWS: {
    PENDING_USERS: "attachments/photos/pending-users",
    USER_PHOTOS: (userId: string) => `attachments/photos/user/${userId}`,
    UPDATE_STATUS: (id: string) => `attachments/${id}/status`,
  },
  METADATA: {
    BULK_CREATE: "metadata/bulk-create",
    DELETE: (id: string) => `metadata/${id}`,
    LIST: (type: string) => `metadata/list/${type}`,
  },
};

export default ENDPOINTS;
