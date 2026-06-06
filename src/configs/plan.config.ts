import { PlanDurationTypes } from "@/types/enum";
import { Plan } from "@/types/types";
import { IconType } from "react-icons";
import {
  MdChatBubbleOutline,
  MdBlock,
  MdTrendingUp,
  MdSupportAgent,
  MdTune,
} from "react-icons/md";

/** Capability flags on a Plan, with display metadata. Reused by the plan list,
 *  form (toggles) and preview so the labels stay in one place. */
export type PlanCapabilityKey =
  | "canMessage"
  | "hasAdvancedFilters"
  | "canBlock"
  | "hasProfileBoost"
  | "hasRelationshipManager";

export const planCapabilities: {
  key: PlanCapabilityKey;
  label: string;
  short: string;
  description: string;
  icon: IconType;
}[] = [
  {
    key: "canMessage",
    label: "Send Messages",
    short: "Chat",
    description: "Members on this plan can start chats and send messages.",
    icon: MdChatBubbleOutline,
  },
  {
    key: "hasAdvancedFilters",
    label: "Advanced Filters",
    short: "Filters",
    description:
      "Unlocks advanced search (by user ID, city, education, income, etc.).",
    icon: MdTune,
  },
  {
    key: "canBlock",
    label: "Block Users",
    short: "Block",
    description: "Members can block other users.",
    icon: MdBlock,
  },
  {
    key: "hasProfileBoost",
    label: "Profile Visibility Boost",
    short: "Boost",
    description: "Increases the member's visibility in discovery.",
    icon: MdTrendingUp,
  },
  {
    key: "hasRelationshipManager",
    label: "Relationship Manager",
    short: "Manager",
    description: "A dedicated relationship manager is assigned (handled by admin).",
    icon: MdSupportAgent,
  },
];

const durationLabels: Record<string, string> = {
  [PlanDurationTypes.quarterly]: "3 Months",
  [PlanDurationTypes.half_yearly]: "6 Months",
  [PlanDurationTypes.unlimited]: "Unlimited",
};

const durationShortLabels: Record<string, string> = {
  [PlanDurationTypes.quarterly]: "3M",
  [PlanDurationTypes.half_yearly]: "6M",
  [PlanDurationTypes.unlimited]: "Lifetime",
};

export const getDurationLabel = (duration?: string) =>
  (duration && durationLabels[duration]) || duration || "—";

export const getDurationShortLabel = (duration?: string) =>
  (duration && durationShortLabels[duration]) || duration || "—";

/** The capability keys that are enabled on a plan. */
export const getEnabledCapabilities = (plan: Plan) =>
  planCapabilities.filter((cap) => plan[cap.key]);
