import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import LoadingProgress from "@/components/lib/LoadingProgress";
import { ReportStatus } from "@/types/enum";
import CommonUtils from "@/utils/common.utils";
import {
  Report,
  REPORT_STATUS_COLOR,
  REPORT_STATUS_LABEL,
} from "./report.types";
import {
  addToast,
  Avatar,
  Button,
  Chip,
  Image,
} from "@heroui/react";
import { useState } from "react";
import { FiArrowLeft, FiUnlock } from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const UserCard = ({
  label,
  user,
}: {
  label: string;
  user?: Report["reporterId"];
}) => (
  <div className="rounded-2xl border border-default-200 bg-content1 p-4">
    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-default-400">
      {label}
    </p>
    <div className="flex items-center gap-3">
      <Avatar
        size="md"
        color="primary"
        name={user?.fullName}
        src={user?.profilePhoto?.url}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {user?.fullName || "Unknown"}
        </p>
        <p className="text-xs text-default-500">{user?.mobile || "—"}</p>
        {user?.userId && (
          <p className="text-[11px] text-default-400">ID: {user.userId}</p>
        )}
      </div>
    </div>
  </div>
);

const ReportDetailPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const [acting, setActing] = useState<string | null>(null);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.REPORTS.DETAILS(id));
      return res as Report;
    },
    enabled: !!id,
  });

  const handleStatus = async (status: ReportStatus) => {
    try {
      setActing(status);
      await http.put(ENDPOINTS.REPORTS.UPDATE_STATUS(id), { status });
      addToast({ color: "success", title: `Marked ${CommonUtils.formatTitle(status)}` });
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setActing(null);
    }
  };

  const handleBan = async () => {
    try {
      setActing("ban");
      await http.put(ENDPOINTS.REPORTS.BAN_USER(id), {});
      addToast({
        color: "danger",
        title: "User banned",
        description: "The reported user can no longer access the app.",
      });
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setActing(null);
    }
  };

  const handleUnban = async () => {
    try {
      setActing("ban");
      await http.put(ENDPOINTS.REPORTS.UNBAN_USER(id), {});
      addToast({
        color: "success",
        title: "User unbanned",
        description: "The reported user can access the app again.",
      });
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setActing(null);
    }
  };

  if (isLoading) return <LoadingProgress />;
  if (!data) return null;

  const reported = data.reportedUserId;
  const attachments = data.attachments ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 rounded-2xl border border-default-200 bg-content1 p-4">
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          radius="full"
          aria-label="Back"
          onPress={() => navigate(-1)}
        >
          <FiArrowLeft size={18} />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Report</h1>
        <div className="ml-auto flex items-center gap-2">
          {reported?.isBanned && (
            <Chip size="sm" color="danger" variant="flat">
              User banned
            </Chip>
          )}
          <Chip size="sm" variant="flat" color={REPORT_STATUS_COLOR[data.status]}>
            {REPORT_STATUS_LABEL[data.status]}
          </Chip>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* LEFT — parties + meta */}
        <aside className="flex flex-col gap-4">
          <UserCard label="Reported user" user={reported} />
          <UserCard label="Reported by" user={data.reporterId} />
          <div className="rounded-2xl border border-default-200 bg-content1 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-default-400">
              Reason
            </p>
            <Chip variant="flat" color="warning">
              {CommonUtils.formatTitle(data.reason)}
            </Chip>
            <p className="mt-3 text-xs text-default-400">
              Filed {new Date(data.createdAt).toLocaleString()}
            </p>
          </div>
        </aside>

        {/* RIGHT — details + evidence + actions */}
        <main className="flex flex-col gap-6">
          <div className="rounded-2xl border border-default-200 bg-content1 p-5">
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Description
            </h3>
            <p className="whitespace-pre-wrap text-sm text-default-600">
              {data.description}
            </p>
          </div>

          <div className="rounded-2xl border border-default-200 bg-content1 p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Evidence ({attachments.length})
            </h3>
            {attachments.length === 0 ? (
              <p className="text-xs text-default-400">No evidence attached.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {attachments.map((a) => (
                  <div
                    key={a._id}
                    className="aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-default-200"
                  >
                    <Image
                      removeWrapper
                      src={a.url}
                      alt="evidence"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-default-200 bg-content1 p-5">
            {reported?.isBanned && (
              <p className="w-full text-xs text-default-500">
                User is banned — status is locked to “Banned”. Unban to change
                the report status.
              </p>
            )}
            <Button
              color="primary"
              variant="flat"
              isLoading={acting === ReportStatus.reviewed}
              isDisabled={!!acting || reported?.isBanned}
              onPress={() => handleStatus(ReportStatus.reviewed)}
            >
              Mark Reviewed
            </Button>
            <Button
              variant="flat"
              isLoading={acting === ReportStatus.dismissed}
              isDisabled={!!acting || reported?.isBanned}
              onPress={() => handleStatus(ReportStatus.dismissed)}
            >
              Dismiss
            </Button>
            {reported?.isBanned ? (
              <Button
                color="success"
                className="ml-auto"
                startContent={acting !== "ban" && <FiUnlock size={18} />}
                isLoading={acting === "ban"}
                isDisabled={!!acting}
                onPress={handleUnban}
              >
                Unban user
              </Button>
            ) : (
              <Button
                color="danger"
                className="ml-auto"
                startContent={acting !== "ban" && <MdBlock size={18} />}
                isLoading={acting === "ban"}
                isDisabled={!!acting}
                onPress={handleBan}
              >
                Ban user
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportDetailPage;
