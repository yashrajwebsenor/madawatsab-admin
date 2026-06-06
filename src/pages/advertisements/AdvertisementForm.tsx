import FormHeading from "@/components/lib/FormHeading";
import { advertisementSchema } from "@/utils/validations.utils";
import {
  addToast,
  Button,
  Card,
  DatePicker,
  Input,
  Textarea,
} from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import http from "@/api/http";
import ENDPOINTS from "@/api/endpoints";
import dayjs from "dayjs";
import ROUTE_PATHS from "@/routes/route-paths";
import { useEffect, useState } from "react";
import LoadingProgress from "@/components/lib/LoadingProgress";
import FileUploader from "@/components/shared/FileUploader";

const defaultValues = {
  title: "",
  description: "",
  ctaText: "",
  ctaUrl: "",
  targetGendersInput: "",
  targetCityIdsInput: "",
  startDate: null,
  endDate: null,
  banner: null,
};

const AdvertisementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(id);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(advertisementSchema),
  });

  const getDetails = async () => {
    try {
      setLoading(true);
      const res = await http.get(ENDPOINTS.ADVERTISEMENTS.DETAILS(id!));
      if (res.data) {
        reset({
          title: res.data.title,
          description: res.data.description,
          ctaText: res.data.ctaText,
          ctaUrl: res.data.ctaUrl,
          targetGendersInput: (res.data.targetGenders || []).join(", "),
          targetCityIdsInput: (res.data.targetCityIds || []).join(", "),
          banner: res.data.banner?.url,
          startDate: parseDate(dayjs(res.data.startDate).format("YYYY-MM-DD")),
          endDate: parseDate(dayjs(res.data.endDate).format("YYYY-MM-DD")),
        } as any);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      getDetails();
    }
  }, []);

  const onSubmit = async (data: any) => {
    const payload = new FormData();
    const {
      targetGendersInput,
      targetCityIdsInput,
      ...rest
    } = data as typeof defaultValues;

    if (typeof rest.banner === "string") {
      delete (rest as any).banner;
    }

    for (const key in rest) {
      const value = (rest as any)[key];
      if (value) {
        if (key === "startDate" || key === "endDate") {
          payload.append(key, dayjs(value).toISOString());
        } else {
          payload.append(key, value);
        }
      }
    }

    const targetGenders = (targetGendersInput || "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    const targetCityIds = (targetCityIdsInput || "")
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isInteger(item) && item > 0);

    if (targetGenders.length > 0) {
      payload.append("targetGenders", targetGenders.join(","));
    }

    if (targetCityIds.length > 0) {
      payload.append("targetCityIds", targetCityIds.join(","));
    }

    try {
      if (isEdit) {
        await http.put(ENDPOINTS.ADVERTISEMENTS.UPDATE(id!), payload);
      } else {
        await http.post(ENDPOINTS.ADVERTISEMENTS.CREATE, payload);
      }
      navigate(ROUTE_PATHS.APP.ADVERTISEMENTS.LIST);
      addToast({
        title: "Success",
        color: "success",
        description: "Advertisement created successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <FormHeading
        title={`${isEdit ? "Edit" : "Create"} Advertisement`}
        description={
          isEdit
            ? "Update details for the selected advertisement."
            : "Add a new advertisement with promotional content."
        }
      />

      {loading ? (
        <LoadingProgress />
      ) : (
        <div className="space-y-5">
          <Card shadow="none" className="p-5">
            <h2 className="font-semibold mb-5">Basic Details</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {fields.map((field) => {
                const name = field.name as keyof typeof defaultValues;
                const error = errors?.[name];

                return (
                  <Controller
                    key={name}
                    name={name}
                    control={control}
                    render={({ field: inputProps }) => {
                      if (field.type === "date") {
                        return (
                          <DatePicker
                            {...inputProps}
                            value={inputProps.value as any}
                            label={field.label}
                            showMonthAndYearPickers
                            isInvalid={!!error}
                            labelPlacement="outside"
                            errorMessage={error?.message}
                            minValue={today(getLocalTimeZone())}
                          />
                        );
                      }

                      return (
                        <Input
                          {...inputProps}
                          type={field.type}
                          label={field.label}
                          isInvalid={!!error}
                          labelPlacement="outside"
                          value={inputProps.value ?? ""}
                          errorMessage={error?.message}
                          placeholder={field.placeholder}
                        />
                      );
                    }}
                  />
                );
              })}
            </div>

            <div className="mt-5 grid sm:grid-cols-3">
              <Controller
                control={control}
                name="description"
                render={({ field: inputProps }) => (
                  <Textarea
                    type="text"
                    minRows={8}
                    {...inputProps}
                    className="col-span-2"
                    label="Description"
                    labelPlacement="outside"
                    isInvalid={!!errors.description}
                    placeholder="Enter description"
                    value={inputProps.value ?? ""}
                    errorMessage={errors.description?.message}
                  />
                )}
              />
            </div>
          </Card>

          <Card shadow="none" className="p-5">
            <h2 className="font-semibold mb-5">Banner</h2>
            <Controller
              control={control}
              name="banner"
              render={({ field, fieldState }) => (
                <div>
                  <FileUploader
                    type="media"
                    canRemove={!isEdit}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-danger mt-2 ml-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </Card>

          <div className="flex justify-end">
            <Button
              color="primary"
              className="font-medium"
              isLoading={isSubmitting}
              onPress={() => handleSubmit(onSubmit)()}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementForm;

const fields = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter title",
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    placeholder: "Enter start date",
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    placeholder: "Enter end date",
  },
  {
    name: "ctaText",
    label: "CTA Text",
    type: "text",
    placeholder: "Enter CTA text",
  },
  {
    name: "ctaUrl",
    label: "CTA URL",
    type: "text",
    placeholder: "Enter CTA URL",
  },
  {
    name: "targetGendersInput",
    label: "Target Genders",
    type: "text",
    placeholder: "male, female",
  },
  {
    name: "targetCityIdsInput",
    label: "Target City IDs",
    type: "text",
    placeholder: "101, 102",
  },
];
