import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import LoadingProgress from "@/components/lib/LoadingProgress";
import { AttachmentStatus } from "@/types/enum";
import { ReviewPhoto, UserPhotosReview } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import { addToast, Avatar, Button, Chip, Image, Spinner } from "@heroui/react";
import { useMemo, useState } from "react";
import { FiArrowLeft, FiCheck, FiClock, FiImage, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

/** Uniform photo frame — normalizes arbitrary upload aspect ratios. */
const PhotoFrame = ({
  url,
  alt,
  children,
}: {
  url: string;
  alt: string;
  children?: React.ReactNode;
}) => (
  <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-default-100 ring-1 ring-default-200">
    <Image
      removeWrapper
      src={url}
      alt={alt}
      className="z-0 h-full w-full object-cover"
    />
    {children}
  </div>
);

const SectionLabel = ({
  icon,
  title,
  count,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  accent?: "warning";
}) => (
  <div className="mb-4 flex items-center gap-2">
    <span
      className={
        accent === "warning" ? "text-warning-500" : "text-default-400"
      }
    >
      {icon}
    </span>
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    <span className="rounded-full bg-default-100 px-2 py-0.5 text-xs font-medium text-default-500">
      {count}
    </span>
  </div>
);

const PhotoReviewDetailPage = () => {
  const navigate = useNavigate();
  const { userId = "" } = useParams();
  const [actingId, setActingId] = useState<string | null>(null);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["photo-review-user", userId],
    queryFn: async () => {
      const res: any = await http.get(
        ENDPOINTS.PHOTO_REVIEWS.USER_PHOTOS(userId),
      );
      return res as UserPhotosReview;
    },
    enabled: !!userId,
  });

  const { pending, approved } = useMemo(() => {
    const photos = data?.photos ?? [];
    return {
      pending: photos.filter((p) => p.status === AttachmentStatus.pending),
      approved: photos.filter((p) => p.status === AttachmentStatus.approved),
    };
  }, [data]);

  const handleApprove = async (id: string) => {
    try {
      setActingId(id);
      await http.put(ENDPOINTS.PHOTO_REVIEWS.UPDATE_STATUS(id), {
        status: AttachmentStatus.approved,
      });
      addToast({
        title: "Approved",
        color: "success",
        description: "Photo is now visible to other users.",
      });
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActingId(id);
      await http.delete(ENDPOINTS.ATTACHMENTS.DELETE(id));
      addToast({
        title: "Rejected",
        color: "default",
        description: "Photo has been removed.",
      });
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setActingId(null);
    }
  };

  if (isLoading) return <LoadingProgress />;

  const user = data?.user;

  return (
    <div className="mx-auto max-w-6xl">
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

        <Avatar
          size="lg"
          color="primary"
          name={user?.fullName}
          src={user?.profilePhoto?.url}
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-semibold text-foreground">
              {user?.fullName || "Unknown user"}
            </h1>
            {user?.gender && (
              <Chip size="sm" variant="flat" className="capitalize">
                {CommonUtils.formatTitle(user.gender)}
              </Chip>
            )}
          </div>
          <p className="text-sm text-default-500">{user?.mobile || "—"}</p>
        </div>

        <Chip
          size="sm"
          variant="flat"
          color={pending.length ? "warning" : "success"}
          className="ml-auto shrink-0"
        >
          {pending.length
            ? `${pending.length} pending review`
            : "All reviewed"}
        </Chip>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* LEFT — already live (calm, reference) */}
        <aside className="rounded-2xl border border-default-200 bg-content1 p-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-default-400">
            Currently live
          </p>
          <p className="mb-5 text-xs text-default-400">
            Visible to other users.
          </p>

          {/* Profile photo */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Profile photo
              </span>
              <span className="text-[10px] uppercase tracking-wide text-default-400">
                Not reviewed
              </span>
            </div>
            {user?.profilePhoto?.url ? (
              <div className="w-32">
                <PhotoFrame url={user.profilePhoto.url} alt="Profile photo" />
              </div>
            ) : (
              <div className="flex h-40 w-32 items-center justify-center rounded-xl bg-default-100 text-default-300">
                <FiImage size={22} />
              </div>
            )}
          </div>

          {/* Approved */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Approved
            </span>
            <span className="rounded-full bg-default-100 px-2 py-0.5 text-xs font-medium text-default-500">
              {approved.length}
            </span>
          </div>
          {approved.length === 0 ? (
            <p className="text-xs text-default-400">No approved photos yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {approved.map((photo: ReviewPhoto) => (
                <PhotoFrame key={photo._id} url={photo.url} alt="Approved photo" />
              ))}
            </div>
          )}
        </aside>

        {/* RIGHT — pending (primary action area) */}
        <main className="rounded-2xl border border-warning-200 bg-warning-50/40 p-5">
          <SectionLabel
            icon={<FiClock size={16} />}
            title="Pending review"
            count={pending.length}
            accent="warning"
          />

          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-default-200 bg-content1 py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600">
                <FiCheck size={22} />
              </div>
              <p className="text-sm font-medium text-foreground">All caught up</p>
              <p className="mt-1 text-xs text-default-400">
                No photos waiting for review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {pending.map((photo: ReviewPhoto) => {
                const busy = actingId === photo._id;
                return (
                  <div
                    key={photo._id}
                    className="overflow-hidden rounded-xl border border-default-200 bg-content1 shadow-sm"
                  >
                    <PhotoFrame url={photo.url} alt="Pending photo">
                      {busy && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                          <Spinner size="sm" color="white" />
                        </div>
                      )}
                    </PhotoFrame>
                    <div className="flex gap-2 p-2.5">
                      <Button
                        fullWidth
                        size="sm"
                        color="success"
                        variant="solid"
                        isDisabled={busy}
                        startContent={<FiCheck size={15} />}
                        onPress={() => handleApprove(photo._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="flat"
                        aria-label="Reject and delete"
                        isDisabled={busy}
                        onPress={() => handleReject(photo._id)}
                      >
                        <FiX size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PhotoReviewDetailPage;
