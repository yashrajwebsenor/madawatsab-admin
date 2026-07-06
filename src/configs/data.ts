import ROUTE_PATHS from "@/routes/route-paths";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineCategory,
  MdOutlineDashboard,
  MdOutlineFavorite,
  MdOutlinePhotoLibrary,
  MdOutlineRealEstateAgent,
  MdOutlineReportProblem,
  MdOutlineSubscriptions,
} from "react-icons/md";
import { GrConfigure, GrUserAdmin } from "react-icons/gr";
import { TbUsersGroup } from "react-icons/tb";
import { MetadataTypes, PlanDurationTypes, UserTypes } from "@/types/enum";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { BiSupport } from "react-icons/bi";
import CommonUtils from "@/utils/common.utils";
import { PERMISSIONS } from "@/configs/permissions";

export const navigations = {
  [UserTypes.admin]: [
    {
      section: "Main",
      child: [
        {
          title: "Dashboard",
          href: ROUTE_PATHS.APP.DASHBOARD,
          icon: MdOutlineDashboard,
          type: "item",
          permission: PERMISSIONS.DASHBOARD,
        },
        {
          title: "Admin Users",
          href: ROUTE_PATHS.APP.ADMIN_USERS.LIST,
          icon: MdOutlineAdminPanelSettings,
          type: "item",
          permission: PERMISSIONS.ADMIN_USERS,
        },
        {
          title: "Roles & Permissions",
          href: ROUTE_PATHS.APP.ROLES.LIST,
          icon: GrUserAdmin,
          type: "item",
          permission: PERMISSIONS.ROLES,
        },
        {
          title: "Manage Agents",
          href: ROUTE_PATHS.APP.AGENTS.LIST,
          icon: MdOutlineRealEstateAgent,
          type: "item",
          permission: PERMISSIONS.AGENTS,
        },
        {
          title: "Customer Management",
          href: ROUTE_PATHS.APP.USERS.LIST,
          icon: TbUsersGroup,
          type: "item",
          permission: PERMISSIONS.USERS,
        },
        {
          title: "Photo Reviews",
          href: ROUTE_PATHS.APP.PHOTO_REVIEWS.LIST,
          icon: MdOutlinePhotoLibrary,
          type: "item",
          permission: PERMISSIONS.USERS,
        },
        {
          title: "Partner Requirements",
          href: ROUTE_PATHS.APP.PARTNER_REQUIREMENTS.LIST,
          icon: MdOutlineFavorite,
          type: "item",
          permission: PERMISSIONS.PARTNER_REQUIREMENTS,
        },
        {
          title: "Agent Requests",
          href: ROUTE_PATHS.APP.AGENT_REQUESTS.LIST,
          icon: MdOutlineRealEstateAgent,
          type: "item",
          permission: PERMISSIONS.AGENT_REQUESTS,
        },
        {
          title: "Subscription Plans",
          href: ROUTE_PATHS.APP.PLANS.LIST,
          icon: MdOutlineSubscriptions,
          type: "item",
          permission: PERMISSIONS.PLANS,
        },
        {
          title: "Advertisements",
          href: ROUTE_PATHS.APP.ADVERTISEMENTS.LIST,
          icon: HiOutlineSpeakerphone,
          type: "item",
          permission: PERMISSIONS.ADVERTISEMENTS,
        },
        {
          title: "Help & Support",
          href: ROUTE_PATHS.APP.HELP_SUPPORT.LIST,
          icon: BiSupport,
          type: "item",
          permission: PERMISSIONS.HELP_SUPPORT,
        },
        {
          title: "Reports",
          href: ROUTE_PATHS.APP.REPORTS.LIST,
          icon: MdOutlineReportProblem,
          type: "item",
          permission: PERMISSIONS.REPORTS,
        },
      ],
    },
    {
      section: "Settings",
      child: [
        {
          title: "Metadata",
          type: "collapse",
          icon: MdOutlineCategory,
          permission: PERMISSIONS.METADATA,
          child: Object.values(MetadataTypes).map((item) => ({
            title: CommonUtils.formatTitle(item),
            href: ROUTE_PATHS.APP.CONFIGS.METADATA.LIST.replace(":type", item),
            type: "item",
            permission: PERMISSIONS.METADATA,
          })),
        },
        {
          title: "CMS Management",
          href: ROUTE_PATHS.APP.CMS.LIST,
          icon: IoSettingsOutline,
          type: "item",
          permission: PERMISSIONS.CMS,
        },
        {
          title: "Manage Configs",
          href: ROUTE_PATHS.APP.CONFIGS.LIST,
          icon: GrConfigure,
          type: "item",
          permission: PERMISSIONS.CONFIGS,
        },
      ],
    },
  ],
  [UserTypes.agent]: [
    {
      section: "Main",
      child: [
        {
          title: "Register Customer",
          href: ROUTE_PATHS.APP.AGENTS.REGISTER,
          icon: MdOutlineRealEstateAgent,
          type: "item",
        },
        {
          title: "My Customers",
          href: ROUTE_PATHS.APP.AGENTS.CUSTOMERS,
          icon: TbUsersGroup,
          type: "item",
        },
      ],
    },
  ],
};

export const planDurationOptions = [
  {
    label: "3 Months",
    value: PlanDurationTypes.quarterly,
  },
  {
    label: "6 Months",
    value: PlanDurationTypes.half_yearly,
  },
  {
    label: "Unlimited",
    value: PlanDurationTypes.unlimited,
  },
];

export const heights = [
  { title: "137 cm (4'6\")", key: 137 },
  { title: "140 cm (4'7\")", key: 140 },
  { title: "142 cm (4'8\")", key: 142 },
  { title: "145 cm (4'9\")", key: 145 },
  { title: "147 cm (4'10\")", key: 147 },
  { title: "150 cm (4'11\")", key: 150 },
  { title: "152 cm (5'0\")", key: 152 },
  { title: "155 cm (5'1\")", key: 155 },
  { title: "157 cm (5'2\")", key: 157 },
  { title: "160 cm (5'3\")", key: 160 },
  { title: "163 cm (5'4\")", key: 163 },
  { title: "165 cm (5'5\")", key: 165 },
  { title: "168 cm (5'6\")", key: 168 },
  { title: "170 cm (5'7\")", key: 170 },
  { title: "173 cm (5'8\")", key: 173 },
  { title: "175 cm (5'9\")", key: 175 },
  { title: "178 cm (5'10\")", key: 178 },
  { title: "180 cm (5'11\")", key: 180 },
  { title: "183 cm (6'0\")", key: 183 },
  { title: "185 cm (6'1\")", key: 185 },
  { title: "188 cm (6'2\")", key: 188 },
  { title: "191 cm (6'3\")", key: 191 },
  { title: "193 cm (6'4\")", key: 193 },
  { title: "196 cm (6'5\")", key: 196 },
  { title: "198 cm (6'6\")", key: 198 },
  { title: "201 cm (6'7\")", key: 201 },
  { title: "203 cm (6'8\")", key: 203 },
  { title: "206 cm (6'9\")", key: 206 },
  { title: "208 cm (6'10\")", key: 208 },
  { title: "211 cm (6'11\")", key: 211 },
  { title: "213 cm (7'0\")", key: 213 },
];
