import { planCapabilities } from "@/configs/plan.config";
import { ActiveStatus, PlanTypes } from "@/types/enum";
import CommonUtils from "@/utils/common.utils";
import { Card, Input, Select, SelectItem, Switch } from "@heroui/react";
import { Controller } from "react-hook-form";

const PlanBasicForm = ({ control, errors, lockType }: any) => {
  return (
    <Card shadow="none" className="p-5">
      <h2 className="font-semibold mb-1">Plan Details</h2>
      <p className="text-sm text-default-400 mb-5">
        Name, type and tagline shown to members on the pricing page.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Plan Name"
              placeholder="Basic"
              labelPlacement="outside"
              isInvalid={!!errors?.name}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Plan Type"
              labelPlacement="outside"
              selectedKeys={new Set([field.value])}
              isInvalid={!!errors?.type}
              placeholder="Select plan type"
              errorMessage={errors.type?.message}
              isDisabled={lockType}
            >
              {Object.values(PlanTypes).map((item) => (
                <SelectItem key={item}>
                  {CommonUtils.formatTitle(item)}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="tagline"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Tagline"
              placeholder="Messages Only"
              labelPlacement="outside"
              isInvalid={!!errors?.tagline}
              errorMessage={errors.tagline?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <Select
              {...field}
              label="Status"
              labelPlacement="outside"
              placeholder="Select status"
              isInvalid={!!errors?.isActive}
              selectedKeys={new Set([field.value])}
              errorMessage={errors.isActive?.message}
            >
              {Object.values(ActiveStatus).map((item) => (
                <SelectItem key={item}>
                  {CommonUtils.formatTitle(item)}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-1">Capabilities</h3>
        <p className="text-sm text-default-400 mb-4">
          What members on this plan are allowed to do. These are enforced by the
          backend.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {planCapabilities.map((cap) => (
            <Controller
              key={cap.key}
              control={control}
              name={cap.key}
              render={({ field }) => (
                <div
                  className="flex items-start justify-between gap-3 rounded-medium border border-default-200 p-3"
                >
                  <div className="flex items-start gap-3">
                    <cap.icon className="text-xl text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-default-800">
                        {cap.label}
                      </p>
                      <p className="text-xs text-default-400">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    size="sm"
                    isSelected={!!field.value}
                    onValueChange={field.onChange}
                  />
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PlanBasicForm;
