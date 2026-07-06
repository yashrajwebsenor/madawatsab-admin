import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import FormHeading from "@/components/lib/FormHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import PasswordInput from "@/components/shared/PasswordInput";
import useCountryCityStates from "@/hooks/useCountryCityStates";
import ROUTE_PATHS from "@/routes/route-paths";
import { Gender } from "@/types/enum";
import CommonUtils from "@/utils/common.utils";
import { agentSchema } from "@/utils/validations.utils";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const defaultValues = {
  _id: "",
  fullName: "",
  email: "",
  mobile: "",
  referralCode: "",
  country: "",
  state: "",
  city: "",
  gender: "",
  password: "",
  confirmPassword: "",
};

const AgentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    countries,
    states,
    cities,
    fetchCountries,
    fetchStates,
    fetchCities,
  } = useCountryCityStates();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(agentSchema),
  });

  const watchedValues = useWatch({ control });

  const isEdit = Boolean(id);

  const getDetails = async () => {
    try {
      setLoading(true);

      const res = await http.get(ENDPOINTS.USERS.DETAILS(id!));

      const data = res.data;

      setValue("_id", data._id);
      setValue("fullName", data.fullName);
      setValue("email", data.email);
      setValue("mobile", data.mobile);
      setValue("referralCode", data.referralCode);
      setValue("country", data.address.countryId);
      setValue("state", data.address.stateId);
      setValue("city", data.address.cityId);
      setValue("gender", data.gender);

      if (data.address?.countryId) {
        await fetchStates(data.address?.countryId);
      }

      if (data.address?.countryId && data.address?.stateId) {
        await fetchCities(data.address?.countryId, data.address?.stateId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();

    if (isEdit) {
      getDetails();
    }
  }, []);

  const onSubmit = async (data: typeof defaultValues) => {
    const { _id, ...rest } = data;
    const payload = {
      ...rest,
      country: Number(data.country),
      state: Number(data.state),
      city: Number(data.city),
    };

    try {
      isEdit
        ? await http.put(ENDPOINTS.AGENTS.UPDATE(_id), payload)
        : await http.post(ENDPOINTS.AGENTS.CREATE, payload);

      navigate(ROUTE_PATHS.APP.AGENTS.LIST);

      addToast({
        title: "Success",
        color: "success",
        description: `Agent ${isEdit ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <FormHeading
        title={`${isEdit ? "Edit" : "Create"} Agent`}
        description={
          isEdit
            ? "Update profile details for this agent."
            : "Register a new agent."
        }
      />

      {loading ? (
        <LoadingProgress />
      ) : (
        <Card shadow="none" className="p-5">
          <div className="grid items-center sm:grid-cols-3 gap-5">
            {fields
              .filter((f) => (isEdit ? f.type !== "password" : true))
              .map((field) => {
                const error = (errors as any)?.[field?.name];

                return (
                  <Controller
                    key={field?.name}
                    control={control}
                    name={(field as any).name}
                    render={({ field: inputProps }) => {
                      if (field.type === "password") {
                        return (
                          <PasswordInput
                            {...inputProps}
                            label={field.label}
                            isInvalid={!!error}
                            labelPlacement="outside"
                            errorMessage={error?.message}
                            placeholder={field.placeholder}
                            generatePassword={field.name === "password"}
                          />
                        );
                      }

                      if (field.type === "autocomplete") {
                        const optionsMap = {
                          country: countries,
                          state: states,
                          city: cities,
                        };

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
                              } else if (field.name === "state") {
                                setValue("city", "");
                                if (val)
                                  fetchCities(watchedValues?.country!, val);
                              }
                            }}
                          >
                            {(
                              optionsMap[
                                field.name as keyof typeof optionsMap
                              ] ?? []
                            ).map((item: any) => (
                              <AutocompleteItem
                                key={item.id}
                                textValue={item.name}
                              >
                                {item.name}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                        );
                      }

                      if (field.type === "select") {
                        return (
                          <Select
                            label={field.label}
                            labelPlacement="outside"
                            placeholder={field.placeholder}
                            isInvalid={!!error}
                            errorMessage={error?.message}
                            selectedKeys={new Set([inputProps.value])}
                            onChange={(key) => {
                              inputProps.onChange(key);
                            }}
                          >
                            {Object.values(Gender).map((item) => (
                              <SelectItem key={item}>
                                {CommonUtils.formatTitle(item)}
                              </SelectItem>
                            ))}
                          </Select>
                        );
                      }

                      return (
                        <Input
                          {...inputProps}
                          type={field.type}
                          label={field.label}
                          isInvalid={!!error}
                          labelPlacement="outside"
                          errorMessage={error?.message}
                          placeholder={field.placeholder}
                        />
                      );
                    }}
                  />
                );
              })}
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              color="primary"
              className="font-medium"
              isLoading={isSubmitting}
              onPress={() => handleSubmit(onSubmit)()}
            >
              Save
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AgentFormPage;

const fields = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Enter full name",
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter email",
  },
  {
    name: "mobile",
    label: "Mobile Number",
    type: "number",
    placeholder: "Enter mobile number",
  },
  {
    name: "referralCode",
    label: "Referral Code",
    type: "text",
    placeholder: "Enter unique referral code",
  },
  {
    name: "country",
    label: "Country",
    type: "autocomplete",
    placeholder: "Select country",
  },
  {
    name: "state",
    label: "State",
    type: "autocomplete",
    placeholder: "Select state",
  },
  {
    name: "city",
    label: "City",
    type: "autocomplete",
    placeholder: "Select city",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    placeholder: "Select Gender",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Enter confirm password",
  },
];
