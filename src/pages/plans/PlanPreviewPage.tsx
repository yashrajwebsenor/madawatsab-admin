import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import BackButton from "@/components/lib/BackButton";
import LoadingProgress from "@/components/lib/LoadingProgress";
import ROUTE_PATHS from "@/routes/route-paths";
import { ActiveStatus } from "@/types/enum";
import { Plan } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import { getDurationLabel } from "@/configs/plan.config";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FiArrowRight, FiCheck, FiEdit } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

const PlanPreviewPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);

  const getDetails = async () => {
    try {
      setLoading(true);
      const res = await http.get(ENDPOINTS.PLANS.DETAILS(id!));
      setPlan(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  if (loading) return <LoadingProgress />;

  const status = plan?.isActive ? ActiveStatus.active : ActiveStatus.inactive;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <BackButton path={ROUTE_PATHS.APP.PLANS.LIST} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-default-900">
                {plan?.name || "Plan Preview"}
              </h1>
              {plan && (
                <>
                  <Chip
                    size="sm"
                    variant="flat"
                    color="secondary"
                    className="capitalize"
                  >
                    {CommonUtils.formatTitle(plan.type)}
                  </Chip>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={CommonUtils.getStatusColor(status)}
                  >
                    {CommonUtils.formatTitle(status)}
                  </Chip>
                </>
              )}
            </div>
            {plan?.tagline && (
              <p className="text-sm text-default-400">{plan.tagline}</p>
            )}
          </div>
        </div>

        {plan && (
          <Button
            color="primary"
            variant="flat"
            as={Link}
            startContent={<FiEdit />}
            to={ROUTE_PATHS.APP.PLANS.UPDATE.replace(":id", plan._id)}
          >
            Edit Plan
          </Button>
        )}
      </div>

      {plan && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {plan.pricing.map((price, index) => (
            <Card
              key={index}
              shadow="none"
              className={clsx(
                "border rounded-[2.5rem] p-6 bg-white",
                "hover:scale-[1.02] transition-transform duration-300",
              )}
            >
              <CardBody className="p-0 overflow-visible">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h2>
                  {price.badgeText && (
                    <Chip
                      variant="flat"
                      color="primary"
                      className="font-bold text-xs px-3 h-7 bg-primary/10 text-primary border-none uppercase"
                    >
                      {price.badgeText}
                    </Chip>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-bold text-gray-900">
                    ₹{price.discountedPrice}
                  </span>
                  <span className="text-gray-500 font-medium">
                    /{getDurationLabel(price.duration)}
                  </span>
                </div>
                {price.originalPrice > price.discountedPrice && (
                  <p className="text-sm text-default-400 line-through mb-7">
                    ₹{price.originalPrice}
                  </p>
                )}
                {!(price.originalPrice > price.discountedPrice) && (
                  <div className="mb-7" />
                )}

                <Button
                  color="primary"
                  size="lg"
                  isDisabled
                  className={clsx(
                    "w-full rounded-2xl font-bold text-white mb-10",
                    "bg-gradient-to-r from-primary to-primary/80",
                  )}
                  endContent={<FiArrowRight className="text-lg" />}
                >
                  Start with {plan.name}
                </Button>

                <p className="text-gray-500 font-medium mb-6 px-1">
                  {plan.name} plan includes :
                </p>

                <div className="space-y-4">
                  {price.contactViewLimit > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <FiCheck className="text-primary text-xs stroke-[3]" />
                      </div>
                      <span className="text-gray-600 text-[15px] leading-snug">
                        {price.contactViewLimit} contact views
                      </span>
                    </div>
                  )}

                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <FiCheck className="text-primary text-xs stroke-[3]" />
                      </div>
                      <span className="text-gray-600 text-[15px] leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanPreviewPage;
