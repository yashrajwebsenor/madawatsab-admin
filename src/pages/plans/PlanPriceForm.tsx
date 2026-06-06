import { planDurationOptions } from "@/configs/data";
import { Button, Card, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useFieldArray } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const PlanPriceForm = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricing",
  });

  return (
    <Card shadow="none" className="p-5">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="font-semibold">Pricing & Contact Views</h2>
          <p className="text-sm text-default-400">
            One row per billing cycle. Contact views are added to the member's
            wallet on purchase.
          </p>
        </div>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<FiPlus size={18} />}
          onPress={() =>
            append({
              duration: "",
              originalPrice: "",
              discountedPrice: "",
              contactViewLimit: "",
              badgeText: "",
            })
          }
        >
          Add Billing Cycle
        </Button>
      </div>

      {(errors?.pricing?.root?.message || errors?.pricing?.message) && (
        <p className="text-sm text-danger mb-4">
          {errors?.pricing?.root?.message || errors?.pricing?.message}
        </p>
      )}

      <div className="grid gap-4">
        {fields?.map((field, index) => (
          <div
            key={field.id}
            className="relative rounded-medium border border-default-200 p-4"
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pr-12">
              <Controller
                name={`pricing.${index}.duration`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Billing Cycle"
                    labelPlacement="outside"
                    placeholder="Select cycle"
                    selectedKeys={new Set([field.value])}
                    isInvalid={!!errors?.pricing?.[index]?.duration}
                    errorMessage={errors?.pricing?.[index]?.duration?.message}
                  >
                    {planDurationOptions.map((item) => (
                      <SelectItem key={item.value}>{item.label}</SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name={`pricing.${index}.originalPrice`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Original Price"
                    labelPlacement="outside"
                    placeholder="3000"
                    type="number"
                    startContent={
                      <span className="text-default-400 text-sm">₹</span>
                    }
                    isInvalid={!!errors?.pricing?.[index]?.originalPrice}
                    errorMessage={
                      errors?.pricing?.[index]?.originalPrice?.message
                    }
                  />
                )}
              />

              <Controller
                name={`pricing.${index}.discountedPrice`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Discounted Price"
                    labelPlacement="outside"
                    placeholder="1675"
                    type="number"
                    startContent={
                      <span className="text-default-400 text-sm">₹</span>
                    }
                    isInvalid={!!errors?.pricing?.[index]?.discountedPrice}
                    errorMessage={
                      errors?.pricing?.[index]?.discountedPrice?.message
                    }
                  />
                )}
              />

              <Controller
                name={`pricing.${index}.contactViewLimit`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Contact Views"
                    labelPlacement="outside"
                    placeholder="30"
                    type="number"
                    description="Views added to wallet on purchase (0 for none)."
                    isInvalid={!!errors?.pricing?.[index]?.contactViewLimit}
                    errorMessage={
                      errors?.pricing?.[index]?.contactViewLimit?.message
                    }
                  />
                )}
              />

              <Controller
                name={`pricing.${index}.badgeText`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Badge Text"
                    labelPlacement="outside"
                    placeholder="Recommended"
                    description="Optional highlight tag on the plan card."
                    isInvalid={!!errors?.pricing?.[index]?.badgeText}
                    errorMessage={errors?.pricing?.[index]?.badgeText?.message}
                  />
                )}
              />
            </div>

            {fields.length > 1 && (
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="flat"
                className="absolute top-4 right-4"
                onPress={() => remove(index)}
              >
                <FiTrash2 size={16} />
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PlanPriceForm;
