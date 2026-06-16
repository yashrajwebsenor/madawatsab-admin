import { ReportReason, ReportStatus } from "@/types/enum";

export interface ReportUser {
  _id: string;
  fullName?: string;
  mobile?: string;
  userId?: string;
  isBanned?: boolean;
  profilePhoto?: { url?: string };
}

export interface ReportAttachment {
  _id: string;
  url: string;
}

export interface Report {
  _id: string;
  reporterId: ReportUser;
  reportedUserId: ReportUser;
  reason: ReportReason;
  description: string;
  attachments?: ReportAttachment[];
  status: ReportStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export const REPORT_STATUS_COLOR: Record<
  ReportStatus,
  "warning" | "primary" | "default" | "danger"
> = {
  [ReportStatus.pending]: "warning",
  [ReportStatus.reviewed]: "primary",
  [ReportStatus.dismissed]: "default",
  [ReportStatus.action_taken]: "danger",
};

// Display labels. `action_taken` reads as "Banned" since it only ever means the
// reported user is currently banned.
export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  [ReportStatus.pending]: "Pending",
  [ReportStatus.reviewed]: "Reviewed",
  [ReportStatus.dismissed]: "Dismissed",
  [ReportStatus.action_taken]: "Banned",
};
