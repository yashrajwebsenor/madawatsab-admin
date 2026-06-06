import { Button, Card, Input } from "@heroui/react";
import { Controller, useFieldArray } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const PlanFeaturesForm = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  return (
    <Card shadow="none" className="p-5">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="font-semibold">Features</h2>
          <p className="text-sm text-default-400">
            Marketing bullet points shown on the plan card. One line per
            feature.
          </p>
        </div>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<FiPlus size={18} />}
          onPress={() => append("")}
        >
          Add Feature
        </Button>
      </div>

      <div className="grid gap-3">
        {fields?.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <Controller
              name={`features.${index}`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Send unlimited messages"
                  isInvalid={!!errors?.features?.[index]}
                  errorMessage={errors?.features?.[index]?.message}
                  startContent={
                    <span className="text-default-400 text-sm">
                      {index + 1}.
                    </span>
                  }
                />
              )}
            />
            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant="flat"
              className="mt-0.5 shrink-0 h-10 w-10"
              onPress={() => remove(index)}
            >
              <FiTrash2 size={16} />
            </Button>
          </div>
        ))}

        {typeof errors?.features?.message === "string" && (
          <p className="text-tiny text-danger">{errors.features.message}</p>
        )}
      </div>
    </Card>
  );
};

export default PlanFeaturesForm;
