import { Input, Textarea } from "@heroui/react";
import { Controller } from "react-hook-form";

const BasicDetails = ({ control, errors }: any) => {
  return (
    <div className="grid gap-5 sm:max-w-lg">
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            autoFocus
            {...field}
            label="Name"
            labelPlacement="outside"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            placeholder="Enter role name"
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Textarea
            {...field}
            minRows={8}
            label="Description"
            labelPlacement="outside"
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
            placeholder="Enter role description"
          />
        )}
      />
    </div>
  );
};

export default BasicDetails;
