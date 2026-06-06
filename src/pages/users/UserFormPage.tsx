import FormHeading from "@/components/lib/FormHeading";
import PhotoUploadPlaceholder from "@/components/shared/PhotoUploadPlaceholder";
import Section from "@/components/shared/Section";
import { Gender, MetadataTypes, Sects } from "@/types/enum";
import CommonUtils from "@/utils/common.utils";
import { createUserSchema } from "@/utils/validations.utils";
import {
  addToast,
  Alert,
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FaRegUser } from "react-icons/fa6";
import { IoCameraOutline, IoClose } from "react-icons/io5";
import { LuGraduationCap } from "react-icons/lu";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import useCountryCityStates from "@/hooks/useCountryCityStates";
import { useEffect } from "react";
import { heights } from "@/configs/data";
import dayjs from "dayjs";
import http from "@/api/http";
import ENDPOINTS from "@/api/endpoints";
import { useNavigate } from "react-router-dom";
import ROUTE_PATHS from "@/routes/route-paths";
import MetadataDropdown from "@/components/shared/MetadataDropdown";

const defaultValues = {
  photos: [],
  isPrivate: false,
  mobile: "",
  fullName: "",
  dob: null,
  gender: "",
  country: "",
  state: "",
  city: "",
  sect: "",
  height: "",
  maslak: "",
  qualification: "",
  occupation: "",
  annualIncome: "",
  workSector: "",
  isOnboardingCompleted: true,
};

const UserFormPage = () => {
  const navigate = useNavigate();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(createUserSchema),
  });

  const {
    countries,
    states,
    cities,
    fetchCountries,
    fetchStates,
    fetchCities,
  } = useCountryCityStates();

  const watchedValues = useWatch({ control });

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleChooseFile = async (file: File) => {
    const temp: any = [...(watchedValues?.photos ?? [])];
    temp.push({
      _id: "",
      url: file,
    });
    setValue("photos", temp);
  };

  const handleDelete = (i: number) => {
    const updated = watchedValues?.photos?.filter(
      (_, index: number) => index !== i,
    );
    setValue("photos", updated ?? []);
  };

  const onSubmit = handleSubmit(async (data: any) => {
    const payload = new FormData();

    for (const key in data) {
      const value = data[key];
      if (key === "photos") continue;
      if (value) {
        if (key === "dob") {
          payload.append(key, dayjs(value).toISOString());
        } else {
          payload.append(key, value);
        }
      }
    }

    data?.photos?.forEach((item: any) => {
      if (!item?._id) payload.append("photos", item.url);
    });

    try {
      await http.post(ENDPOINTS.USERS.CREATE, payload);
      addToast({
        title: "Success",
        color: "success",
        description: "Customer created successfully",
      });
      navigate(ROUTE_PATHS.APP.USERS.LIST);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <FormHeading
        title={`Create Customer`}
        description={"Create customer profile and manage account preferences."}
      />

      <div className="flex flex-col gap-7">
        <Section
          title="1. Profile Photo"
          icon={<IoCameraOutline size={20} className="text-primary" />}
          description="Customer's photo will be visible after admin verification."
          extra={
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">
                Profile Private
              </span>
              <Switch
                size="sm"
                color="primary"
                aria-label="Profile Private Toggle"
                isSelected={watchedValues?.isPrivate}
                onValueChange={(value) => setValue("isPrivate", value)}
              />
            </div>
          }
        >
          <div className="grid sm:grid-cols-4 gap-5">
            {watchedValues?.photos?.map((item: any, i: number) => (
              <div
                key={i}
                className="relative group overflow-hidden rounded-lg w-full aspect-[4/5] bg-gray-100"
              >
                <img
                  alt={`Profile photo ${i + 1}`}
                  src={URL.createObjectURL(item.url)}
                  className="w-full h-full object-cover rounded-lg"
                />

                {(watchedValues?.photos ?? []).length > 1 && (
                  <Button
                    isIconOnly
                    size="sm"
                    radius="full"
                    variant="flat"
                    color="danger"
                    onPress={() => handleDelete(i)}
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IoClose size={18} />
                  </Button>
                )}
              </div>
            ))}

            {(watchedValues?.photos ?? []).length < 5 && (
              <div className="w-full h-[300px]">
                <PhotoUploadPlaceholder onChange={handleChooseFile} />
              </div>
            )}
          </div>

          <Alert
            variant="flat"
            title="Profile Photo Tip"
            className="items-start mt-3"
            color={
              !watchedValues?.photos?.length && errors?.photos?.message
                ? "danger"
                : "primary"
            }
            description={
              (!watchedValues?.photos?.length && errors?.photos?.message) ||
              "The first photo in customer's list will be customer's main profile photo."
            }
          />
        </Section>

        <Section
          title="2. Personal Information"
          description="Basic details for customer profile."
          icon={<FaRegUser size={20} className="text-primary" />}
        >
          <div className="grid items-center sm:grid-cols-3 gap-4 w-full">
            {fields.personal.map((field) => {
              const name = field.name as keyof typeof watchedValues;
              const value = watchedValues?.[name] as any;
              const error = errors[name];

              return (
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field: inputProps }) => {
                    if (field.component === "metadata") {
                      return (
                        <MetadataDropdown
                          isInvalid={!!error}
                          label={field.label}
                          labelPlacement="outside"
                          placeholder={field.placeholder}
                          metadataType={field.metadataType!}
                          errorMessage={error?.message}
                          selectedKey={
                            inputProps.value ? String(inputProps.value) : ""
                          }
                          onSelectionChange={(key) => inputProps.onChange(key)}
                        />
                      );
                    }

                    if (field.type === "date") {
                      return (
                        <DatePicker
                          {...field}
                          label={field.label}
                          labelPlacement="outside"
                          isInvalid={!!error}
                          errorMessage={error?.message}
                          value={value ? parseDate(value) : null}
                          onChange={(date) =>
                            inputProps.onChange(date ? date.toString() : null)
                          }
                          maxValue={today(getLocalTimeZone()).subtract({
                            years: 18,
                          })}
                        />
                      );
                    }

                    if (field.type === "select") {
                      return (
                        <Select
                          label={field.label}
                          isInvalid={!!error}
                          labelPlacement="outside"
                          errorMessage={error?.message}
                          placeholder={field.placeholder}
                          selectedKeys={
                            new Set([inputProps.value?.toString() ?? ""])
                          }
                          onChange={(e) => inputProps.onChange(e.target.value)}
                        >
                          {(field?.options ?? [])?.map((item) => (
                            <SelectItem key={item.key}>{item.title}</SelectItem>
                          ))}
                        </Select>
                      );
                    }

                    if (field.type === "autocomplete") {
                      const options = {
                        country: countries,
                        state: states,
                        city: cities,
                      } as any;

                      return (
                        <Autocomplete
                          label={field.label}
                          labelPlacement="outside"
                          placeholder={field.placeholder}
                          isInvalid={!!error}
                          errorMessage={error?.message}
                          selectedKey={
                            inputProps.value ? String(inputProps.value) : ""
                          }
                          onSelectionChange={(key) => {
                            const val = key as string;
                            inputProps.onChange(val);
                            if (field.name === "country") {
                              setValue("state", "");
                              setValue("city", "");
                              if (val) fetchStates(val);
                            }
                            if (field.name === "state") {
                              setValue("city", "");
                              if (val) fetchCities(watchedValues.country!, val);
                            }
                          }}
                        >
                          {(options?.[field.name] ?? [])?.map((item: any) => (
                            <AutocompleteItem key={item.id}>
                              {item.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      );
                    }

                    return (
                      <Input
                        {...inputProps}
                        type={field.type}
                        isInvalid={!!error}
                        label={field.label}
                        labelPlacement="outside"
                        errorMessage={error?.message}
                        placeholder={field.placeholder}
                        value={inputProps.value?.toString()}
                        onChange={(e) => inputProps.onChange(e.target.value)}
                      />
                    );
                  }}
                />
              );
            })}
          </div>
        </Section>

        <Section
          icon={<LuGraduationCap size={20} className="text-primary" />}
          title="3. Education & Profession"
          description="Academic and career background."
        >
          <div className="grid items-center sm:grid-cols-3 gap-4 w-full">
            {fields.education.map((field) => {
              const name = field.name as keyof typeof watchedValues;
              const error = errors[name];

              return (
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field: inputProps }) => {
                    if (field.component === "metadata") {
                      return (
                        <MetadataDropdown
                          isInvalid={!!error}
                          label={field.label}
                          labelPlacement="outside"
                          placeholder={field.placeholder}
                          metadataType={field.metadataType!}
                          errorMessage={error?.message}
                          selectedKey={
                            inputProps.value ? String(inputProps.value) : ""
                          }
                          onSelectionChange={(key) => inputProps.onChange(key)}
                        />
                      );
                    }

                    return (
                      <Input
                        {...inputProps}
                        label={field.label}
                        isInvalid={!!error}
                        labelPlacement="outside"
                        errorMessage={error?.message}
                        placeholder={field.placeholder}
                        value={inputProps.value?.toString()}
                        onChange={(e) => inputProps.onChange(e.target.value)}
                      />
                    );
                  }}
                />
              );
            })}
          </div>
        </Section>
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          color="primary"
          isLoading={isSubmitting}
          onPress={() => onSubmit()}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default UserFormPage;

const fields = {
  personal: [
    {
      name: "fullName",
      label: "FULL NAME",
      type: "text",
      placeholder: "Enter your full name",
    },
    {
      name: "mobile",
      label: "MOBILE NUMBER",
      type: "number",
      placeholder: "Enter your mobile number",
    },
    {
      name: "dob",
      label: "DATE OF BIRTH",
      type: "date",
      placeholder: "dd/mm/yyyy",
    },
    {
      name: "country",
      label: "COUNTRY",
      type: "autocomplete",
    },
    {
      name: "state",
      label: "STATE",
      type: "autocomplete",
    },
    {
      name: "city",
      label: "CITY",
      type: "autocomplete",
    },
    {
      name: "height",
      label: "HEIGHT",
      type: "select",
      placeholder: "5 feet 5 inches",
      options: heights,
    },
    {
      name: "gender",
      label: "GENDER",
      type: "select",
      options: Object.values(Gender).map((item) => ({
        key: item,
        title: CommonUtils.formatTitle(item),
      })),
    },
    {
      name: "sect",
      label: "SECT",
      type: "select",
      options: Object.values(Sects).map((item) => ({
        key: item,
        title: CommonUtils.formatTitle(item),
      })),
    },
    {
      name: "maslak",
      label: "CASTE (OPTIONAL)",
      component: "metadata",
      metadataType: MetadataTypes.caste,
    },
  ],
  education: [
    {
      name: "qualification",
      label: "EDUCATION LEVEL",
      placeholder: "Enter your highest education",
      component: "metadata",
      metadataType: MetadataTypes.qualification,
    },
    {
      name: "occupation",
      label: "OCCUPATION",
      placeholder: "Enter your occupation",
      component: "metadata",
      metadataType: MetadataTypes.occupation,
    },
    {
      name: "annualIncome",
      label: "ANNUAL INCOME",
      component: "metadata",
      metadataType: MetadataTypes.annual_income,
    },
    {
      name: "workSector",
      label: "WORK SECTOR",
      component: "metadata",
      metadataType: MetadataTypes.employed_in,
    },
  ],
};
