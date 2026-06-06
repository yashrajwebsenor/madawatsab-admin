import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { Plan } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import {
  getDurationLabel,
  getEnabledCapabilities,
} from "@/configs/plan.config";
import { addToast, Button, Tooltip } from "@heroui/react";
import { useState } from "react";
import { FiEdit, FiEye } from "react-icons/fi";
import { IconType } from "react-icons";
import {
  MdAllInclusive,
  MdOutlineDeleteOutline,
  MdOutlineSubscriptions,
  MdOutlineVisibility,
  MdStarOutline,
  MdStars,
  MdSupportAgent,
  MdWorkspacePremium,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

/** Per-tier visual identity — gradient header, glow + icon. */
const tierStyle: Record<
  string,
  { gradient: string; glow: string; icon: IconType }
> = {
  basic: {
    gradient: "from-slate-500 to-slate-700",
    glow: "shadow-slate-500/30",
    icon: MdStarOutline,
  },
  silver: {
    gradient: "from-zinc-400 to-slate-600",
    glow: "shadow-zinc-500/30",
    icon: MdWorkspacePremium,
  },
  gold: {
    gradient: "from-amber-400 to-orange-500",
    glow: "shadow-amber-500/30",
    icon: MdStars,
  },
  assisted: {
    gradient: "from-fuchsia-500 to-purple-600",
    glow: "shadow-fuchsia-500/30",
    icon: MdSupportAgent,
  },
  unlimited: {
    gradient: "from-indigo-500 via-primary to-purple-600",
    glow: "shadow-primary/30",
    icon: MdAllInclusive,
  },
};

const getTier = (type: string) =>
  tierStyle[type] || {
    gradient: "from-primary to-primary-600",
    glow: "shadow-primary/30",
    icon: MdOutlineSubscriptions,
  };

const PlanListPage = () => {
  const { page, setTotalPages, renderPagination } = usePagination();
  const [deleteModal, setDeleteModal] = useState<any>({
    isOpen: false,
    data: null,
  });

  const {
    data: plans = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["plans", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.PLANS.LIST, {
        params: { page, limit: 10 },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as Plan[];
    },
  });

  const handleDelete = async () => {
    try {
      await http.delete(ENDPOINTS.PLANS.DELETE(deleteModal?.data?._id));
      refetch();
      addToast({
        title: "Success",
        color: "success",
        description: "Plan deleted successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ListHeading
        title="Subscription Plans"
        description="Manage subscription tiers — pricing per billing cycle, contact-view wallet top-ups and the capabilities each plan unlocks."
      />

      {isLoading ? (
        <LoadingProgress />
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-default-200 py-20 text-center">
          <MdOutlineSubscriptions className="text-4xl text-default-300" />
          <p className="text-default-500">No subscription plans found.</p>
          <p className="text-xs text-default-400">
            Plans are a fixed catalog created by the database seeder — run the
            plan seeder to populate them.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((item) => {
            const tier = getTier(item.type);
            const TierIcon = tier.icon;
            const capabilities = getEnabledCapabilities(item);
            const previewTo = ROUTE_PATHS.APP.PLANS.PREVIEW.replace(
              ":id",
              item._id,
            );
            const editTo = ROUTE_PATHS.APP.PLANS.UPDATE.replace(":id", item._id);

            return (
              <div
                key={item._id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-default-200 bg-content1 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-transparent"
              >
                {/* Gradient header */}
                <div
                  className={`relative overflow-hidden bg-gradient-to-br ${tier.gradient} p-5 text-white`}
                >
                  {/* decorative glow */}
                  <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-black/10 blur-2xl" />

                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-lg ${tier.glow} backdrop-blur-sm ring-1 ring-white/30`}
                      >
                        <TierIcon className="text-2xl" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold leading-tight">
                          {item.name}
                        </h3>
                        <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                          {CommonUtils.formatTitle(item.type)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${
                        item.isActive
                          ? "bg-white/25 text-white"
                          : "bg-black/20 text-white/80"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.isActive ? "bg-emerald-300" : "bg-amber-300"
                        }`}
                      />
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {item.tagline && (
                    <p className="relative mt-3 truncate text-xs text-white/80">
                      {item.tagline}
                    </p>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Pricing */}
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-default-400">
                    Billing & Contact Views
                  </p>
                  <div className="flex flex-col gap-2">
                    {item.pricing?.map((price, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-default-100 bg-default-50 px-3 py-2"
                      >
                        <span className="text-xs font-medium text-default-500">
                          {getDurationLabel(price.duration)}
                        </span>
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-default-900">
                              ₹{price.discountedPrice}
                            </span>
                            {price.originalPrice > price.discountedPrice && (
                              <span className="text-xs text-default-300 line-through">
                                ₹{price.originalPrice}
                              </span>
                            )}
                          </div>
                          <Tooltip content="Contact views granted" size="sm">
                            <span className="inline-flex items-center gap-1 rounded-md bg-secondary/10 px-1.5 py-0.5 text-[11px] font-semibold text-secondary">
                              <MdOutlineVisibility className="text-xs" />
                              {price.contactViewLimit}
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Capabilities */}
                  <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wider text-default-400">
                    Capabilities
                  </p>
                  {capabilities.length === 0 ? (
                    <span className="text-xs text-default-300">
                      No capabilities enabled
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {capabilities.map((cap) => (
                        <Tooltip key={cap.key} content={cap.description} size="sm">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-primary/5 px-2 py-1 text-xs font-medium text-primary ring-1 ring-primary/10">
                            <cap.icon className="text-sm" />
                            {cap.short}
                          </span>
                        </Tooltip>
                      ))}
                    </div>
                  )}

                  {item.features?.length > 0 && (
                    <p className="mt-3 text-xs text-default-400">
                      {item.features.length} highlight
                      {item.features.length > 1 ? "s" : ""} on plan card
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-auto flex items-center gap-2 pt-5">
                    <Button
                      as={Link}
                      to={previewTo}
                      size="sm"
                      variant="flat"
                      startContent={<FiEye />}
                      className="flex-1 font-medium"
                    >
                      Preview
                    </Button>
                    <Button
                      as={Link}
                      to={editTo}
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<FiEdit />}
                      className="flex-1 font-medium"
                    >
                      Edit
                    </Button>
                    <Tooltip content="Delete" size="sm" color="danger">
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() =>
                          setDeleteModal({ data: item, isOpen: true })
                        }
                      >
                        <MdOutlineDeleteOutline />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {plans?.length > 0 && renderPagination()}

      {deleteModal.isOpen && (
        <ConfirmationDialog
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ data: null, isOpen: false })}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default PlanListPage;
