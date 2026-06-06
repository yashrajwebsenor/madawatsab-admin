import FormHeading from "@/components/lib/FormHeading";
import { ActiveStatus, PlanDurationTypes } from "@/types/enum";
import { useNavigate, useParams } from "react-router-dom";
import PlanBasicForm from "./PlanBasicForm";
import PlanFeaturesForm from "./PlanFeaturesForm";
import PlanPriceForm from "./PlanPriceForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { planSchema } from "@/utils/validations.utils";
import { addToast, Button } from "@heroui/react";
import http from "@/api/http";
import ENDPOINTS from "@/api/endpoints";
import { useEffect, useState } from "react";
import LoadingProgress from "@/components/lib/LoadingProgress";
import ROUTE_PATHS from "@/routes/route-paths";

const defaultValues = {
  name: "",
  type: "",
  tagline: "",
  features: [""],
  hasAdvancedFilters: false,
  canMessage: true,
  canBlock: false,
  hasProfileBoost: false,
  hasRelationshipManager: false,
  isActive: ActiveStatus.active,
  pricing: [
    {
      duration: PlanDurationTypes.quarterly,
      originalPrice: "",
      discountedPrice: "",
      contactViewLimit: "",
      badgeText: "",
    },
  ],
};

const PlanFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(planSchema),
  });

  const getDetails = async () => {
    try {
      setLoading(true);
      const res = await http.get(ENDPOINTS.PLANS.DETAILS(id!));
      reset({
        name: res?.data?.name,
        type: res?.data?.type,
        tagline: res?.data?.tagline,
        features: res?.data?.features?.length ? res.data.features : [""],
        hasAdvancedFilters: res?.data?.hasAdvancedFilters,
        canMessage: res?.data?.canMessage,
        canBlock: res?.data?.canBlock,
        hasProfileBoost: res?.data?.hasProfileBoost,
        hasRelationshipManager: res?.data?.hasRelationshipManager,
        pricing: res?.data?.pricing,
        isActive: res?.data?.isActive
          ? ActiveStatus.active
          : ActiveStatus.inactive,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formattedPayload = {
        ...data,
        features: data?.features?.filter((f: string) => f?.trim()),
        // Empty badge text is valid (no badge); store it as null, not "".
        pricing: data?.pricing?.map((p: any) => ({
          ...p,
          badgeText: p?.badgeText?.trim() ? p.badgeText.trim() : null,
        })),
        isActive: data?.isActive === ActiveStatus.active,
      };
      const res = await http.put(ENDPOINTS.PLANS.UPDATE(id!), formattedPayload);

      addToast({
        title: "Success",
        description: "Plan updated successfully",
        color: "success",
      });

      navigate(ROUTE_PATHS.APP.PLANS.PREVIEW.replace(":id", res?.data?._id));
    } catch (error) {
      console.log(error);
    }
  }, (formErrors) => {
    // Surface the first available error so validation failures are never silent.
    const findFirstMessage = (node: any): string | undefined => {
      if (!node) return undefined;
      if (typeof node?.message === "string") return node.message;
      if (Array.isArray(node)) {
        for (const item of node) {
          const msg = findFirstMessage(item);
          if (msg) return msg;
        }
        return undefined;
      }
      if (typeof node === "object") {
        for (const key of Object.keys(node)) {
          const msg = findFirstMessage(node[key]);
          if (msg) return msg;
        }
      }
      return undefined;
    };

    addToast({
      title: "Validation error",
      description:
        findFirstMessage(formErrors) || "Please fix the highlighted fields.",
      color: "danger",
    });
  });

  return (
    <div>
      <FormHeading
        title="Edit Plan"
        description="Update this tier's pricing, billing cycles, features and capabilities. Plan type is fixed."
        backPath={ROUTE_PATHS.APP.PLANS.LIST}
      />

      {loading ? (
        <LoadingProgress />
      ) : (
        <div className="grid gap-5">
          <PlanBasicForm control={control} errors={errors} lockType />
          <PlanFeaturesForm control={control} errors={errors} />
          <PlanPriceForm control={control} errors={errors} />
          <div className="sticky -bottom-6 z-20 -mx-3 -mb-6 flex items-center justify-end gap-3 border-t border-default-200 bg-background/90 px-4 pb-6 pt-3 backdrop-blur">
            {isDirty && (
              <span className="text-sm text-default-400">Unsaved changes</span>
            )}
            <Button
              color="primary"
              className="font-medium"
              isDisabled={!isDirty}
              isLoading={isSubmitting}
              onPress={() => onSubmit()}
            >
              Save Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanFormPage;
