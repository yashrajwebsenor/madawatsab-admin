import { lazy } from "react";
import ROUTE_PATHS from "./route-paths";
import { PERMISSIONS } from "@/configs/permissions";

const routes = [
  {
    layout: lazy(() => import("@/components/layouts/AuthLayout")),
    pages: [
      {
        path: ROUTE_PATHS.AUTH.LOGIN,
        component: lazy(() => import("@/pages/auth/LoginPage")),
      },
    ],
  },
  {
    layout: lazy(() => import("@/components/layouts/AppLayout")),
    pages: [
      {
        path: ROUTE_PATHS.APP.DASHBOARD,
        component: lazy(() => import("@/pages/dashboard/DashboardPage")),
        permission: PERMISSIONS.DASHBOARD,
      },
      {
        path: ROUTE_PATHS.APP.USERS.LIST,
        component: lazy(() => import("@/pages/users/UsersListPage")),
        permission: PERMISSIONS.USERS,
      },
      {
        path: ROUTE_PATHS.APP.USERS.DETAILS,
        component: lazy(() => import("@/pages/users/UserDetailsPage")),
        permission: PERMISSIONS.USERS,
      },
      {
        path: ROUTE_PATHS.APP.USERS.CREATE,
        component: lazy(() => import("@/pages/users/UserFormPage")),
        permission: PERMISSIONS.USERS,
      },
      {
        path: ROUTE_PATHS.APP.ROLES.LIST,
        component: lazy(
          () => import("@/pages/roles-permissions/RolesListPage"),
        ),
        permission: PERMISSIONS.ROLES,
      },
      {
        path: ROUTE_PATHS.APP.ROLES.CREATE,
        component: lazy(
          () => import("@/pages/roles-permissions/RolesFormPage"),
        ),
        permission: PERMISSIONS.ROLES,
      },
      {
        path: ROUTE_PATHS.APP.ROLES.UPDATE,
        component: lazy(
          () => import("@/pages/roles-permissions/RolesFormPage"),
        ),
        permission: PERMISSIONS.ROLES,
      },
      {
        path: ROUTE_PATHS.APP.ADMIN_USERS.LIST,
        component: lazy(() => import("@/pages/admin-users/AdminUserListPage")),
        permission: PERMISSIONS.ADMIN_USERS,
      },
      {
        path: ROUTE_PATHS.APP.ADMIN_USERS.CREATE,
        component: lazy(() => import("@/pages/admin-users/AdminUserFormPage")),
        permission: PERMISSIONS.ADMIN_USERS,
      },
      {
        path: ROUTE_PATHS.APP.ADMIN_USERS.UPDATE,
        component: lazy(() => import("@/pages/admin-users/AdminUserFormPage")),
        permission: PERMISSIONS.ADMIN_USERS,
      },
      {
        path: ROUTE_PATHS.APP.PLANS.LIST,
        component: lazy(() => import("@/pages/plans/PlanListPage")),
        permission: PERMISSIONS.PLANS,
      },
      {
        path: ROUTE_PATHS.APP.PLANS.UPDATE,
        component: lazy(() => import("@/pages/plans/PlanFormPage")),
        permission: PERMISSIONS.PLANS,
      },
      {
        path: ROUTE_PATHS.APP.PLANS.PREVIEW,
        component: lazy(() => import("@/pages/plans/PlanPreviewPage")),
        permission: PERMISSIONS.PLANS,
      },
      {
        path: ROUTE_PATHS.APP.CMS.LIST,
        component: lazy(() => import("@/pages/cms/CMSListPage")),
        permission: PERMISSIONS.CMS,
      },
      {
        path: ROUTE_PATHS.APP.CMS.UPDATE,
        component: lazy(() => import("@/pages/cms/CMSFormPage")),
        permission: PERMISSIONS.CMS,
      },
      {
        path: ROUTE_PATHS.APP.ADVERTISEMENTS.LIST,
        component: lazy(
          () => import("@/pages/advertisements/AdvertisementListPage"),
        ),
        permission: PERMISSIONS.ADVERTISEMENTS,
      },
      {
        path: ROUTE_PATHS.APP.ADVERTISEMENTS.CREATE,
        component: lazy(
          () => import("@/pages/advertisements/AdvertisementForm"),
        ),
        permission: PERMISSIONS.ADVERTISEMENTS,
      },
      {
        path: ROUTE_PATHS.APP.ADVERTISEMENTS.UPDATE,
        component: lazy(
          () => import("@/pages/advertisements/AdvertisementForm"),
        ),
        permission: PERMISSIONS.ADVERTISEMENTS,
      },
      {
        path: ROUTE_PATHS.APP.HELP_SUPPORT.LIST,
        component: lazy(
          () => import("@/pages/help-supports/HelpSupportListPage"),
        ),
        permission: PERMISSIONS.HELP_SUPPORT,
      },
      {
        path: ROUTE_PATHS.APP.REPORTS.LIST,
        component: lazy(() => import("@/pages/reports/ReportListPage")),
        permission: PERMISSIONS.REPORTS,
      },
      {
        path: ROUTE_PATHS.APP.REPORTS.DETAILS,
        component: lazy(() => import("@/pages/reports/ReportDetailPage")),
        permission: PERMISSIONS.REPORTS,
      },
      {
        path: ROUTE_PATHS.APP.PHOTO_REVIEWS.LIST,
        component: lazy(
          () => import("@/pages/photo-reviews/PhotoReviewListPage"),
        ),
        permission: PERMISSIONS.USERS,
      },
      {
        path: ROUTE_PATHS.APP.PHOTO_REVIEWS.DETAILS,
        component: lazy(
          () => import("@/pages/photo-reviews/PhotoReviewDetailPage"),
        ),
        permission: PERMISSIONS.USERS,
      },
      {
        path: ROUTE_PATHS.APP.CONFIGS.LIST,
        component: lazy(() => import("@/pages/configs/ConfigListPage")),
        permission: PERMISSIONS.CONFIGS,
      },
      {
        path: ROUTE_PATHS.APP.CONFIGS.METADATA.LIST,
        component: lazy(() => import("@/pages/configs/MetadataListPage")),
        permission: PERMISSIONS.METADATA,
      },
      {
        path: ROUTE_PATHS.APP.CONFIGS.METADATA.CREATE,
        component: lazy(() => import("@/pages/configs/MetadataFormPage")),
        permission: PERMISSIONS.METADATA,
      },
      {
        path: ROUTE_PATHS.APP.AGENTS.LIST,
        component: lazy(() => import("@/pages/agents/AgentListPage")),
        permission: PERMISSIONS.AGENTS,
      },
      {
        path: ROUTE_PATHS.APP.AGENTS.CREATE,
        component: lazy(() => import("@/pages/agents/AgentFormPage")),
        permission: PERMISSIONS.AGENTS,
      },
      {
        path: ROUTE_PATHS.APP.AGENTS.UPDATE,
        component: lazy(() => import("@/pages/agents/AgentFormPage")),
        permission: PERMISSIONS.AGENTS,
      },
      {
        path: ROUTE_PATHS.APP.AGENTS.DETAILS,
        component: lazy(() => import("@/pages/agents/AgentDetailPage")),
        permission: PERMISSIONS.AGENTS,
      },
      {
        // Agent-portal page — gated by userType only, no admin permission.
        path: ROUTE_PATHS.APP.AGENTS.CUSTOMERS,
        component: lazy(() => import("@/pages/agents/AgentCustomersList")),
      },
      {
        // Agent-portal page — gated by userType only, no admin permission.
        path: ROUTE_PATHS.APP.AGENTS.REGISTER,
        component: lazy(
          () => import("@/pages/agents/register/RegisterCustomerPage"),
        ),
      },
      {
        path: ROUTE_PATHS.APP.PARTNER_REQUIREMENTS.LIST,
        component: lazy(
          () =>
            import("@/pages/partner-requirements/PartnerRequirementListPage"),
        ),
        permission: PERMISSIONS.PARTNER_REQUIREMENTS,
      },
      {
        path: ROUTE_PATHS.APP.AGENT_REQUESTS.LIST,
        component: lazy(
          () => import("@/pages/agent-requests/AgentRequestListPage"),
        ),
        permission: PERMISSIONS.AGENT_REQUESTS,
      },
    ],
  },
];

export default routes;
