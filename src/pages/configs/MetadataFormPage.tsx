import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import FormHeading from "@/components/lib/FormHeading";
import ROUTE_PATHS from "@/routes/route-paths";
import CommonUtils from "@/utils/common.utils";
import { createMetadataSchema } from "@/utils/validations.utils";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Tooltip,
} from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FiPlus, FiSave, FiTrash2, FiType } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const defaultValues = {
  type: "",
  names: [{ value: "" }],
};

const MetadataFormPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const title = CommonUtils.formatTitle(type as string);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(createMetadataSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "names",
  });

  const onSubmit = handleSubmit(async (data: any) => {
    data.type = type!;
    data.names = data.names.map((ev: any) => ev.value);

    try {
      await http.post(ENDPOINTS.METADATA.BULK_CREATE, data);
      addToast({
        title: "Success",
        color: "success",
        description: `${title} added successfully`,
      });
      navigate(ROUTE_PATHS.APP.CONFIGS.METADATA.LIST.replace(":type", type!));
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <FormHeading
        title={`Configure ${title}`}
        description={`Manage the list of available ${title.toLowerCase()} options for the platform.`}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-xl">
          <CardHeader className="flex gap-3 px-6 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FiType size={20} />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold">{title} List</p>
              <p className="text-small text-default-500">
                Add one or multiple entries below
              </p>
            </div>
          </CardHeader>

          <Divider className="my-4 mx-6 w-auto" />

          <CardBody className="px-6 py-4 space-y-6">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-grow">
                      <Controller
                        control={control}
                        name={`names.${index}.value`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            autoFocus={index === 0}
                            variant="bordered"
                            labelPlacement="outside"
                            label={index === 0 ? title : ""}
                            placeholder={`Enter ${title.toLowerCase()} value...`}
                            isInvalid={!!(errors as any)?.names?.[index]?.value}
                            errorMessage={
                              (errors as any)?.names?.[index]?.value?.message
                            }
                            classNames={{
                              label: "font-semibold text-default-700",
                              inputWrapper:
                                "h-12 border-default-200 group-data-[focus=true]:border-primary",
                            }}
                          />
                        )}
                      />
                    </div>
                    {fields.length > 1 && (
                      <div className={index === 0 ? "pt-6" : "pt-0"}>
                        <Tooltip
                          content="Remove entry"
                          color="danger"
                          closeDelay={0}
                        >
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            radius="full"
                            onPress={() => remove(index)}
                            className="text-default-400 hover:text-danger"
                          >
                            <FiTrash2 size={18} />
                          </Button>
                        </Tooltip>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Button
              variant="flat"
              color="primary"
              startContent={<FiPlus />}
              onPress={() => append({ value: "" })}
              className="font-medium bg-primary/10 hover:bg-primary/20"
            >
              Add Another {title}
            </Button>
          </CardBody>

          <Divider className="my-2 mx-6 w-auto" />

          <CardFooter className="px-6 py-6 flex justify-end gap-3">
            <Button
              color="primary"
              className="font-bold px-10 shadow-lg shadow-primary/30"
              isLoading={isSubmitting}
              onPress={() => onSubmit()}
              startContent={!isSubmitting && <FiSave size={18} />}
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default MetadataFormPage;
