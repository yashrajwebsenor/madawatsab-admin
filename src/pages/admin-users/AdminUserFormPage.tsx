import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import FormHeading from "@/components/lib/FormHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import PasswordInput from "@/components/shared/PasswordInput";
import ROUTE_PATHS from "@/routes/route-paths";
import { Role } from "@/types/types";
import { adminUserSchema } from "@/utils/validations.utils";
import {
  addToast,
  Button,
  Card,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const defaultValues = {
  _id: "",
  fullName: "",
  email: "",
  roleId: "",
  mobile: "",
  password: "",
  confirmPassword: "",
};

const AdminUserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const isEdit = Boolean(id);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(adminUserSchema),
  });

  const getRoles = async () => {
    try {
      setLoading(true);
      const res = await http.get(ENDPOINTS.ROLES.OPTIONS);
      setRoles(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getDetails = async () => {
    try {
      setLoading(true);
      const res = await http.get(ENDPOINTS.ADMIN_USERS.DETAILS(id!));
      reset({
        _id: res?.data?._id,
        fullName: res?.data?.fullName,
        email: res?.data?.email,
        mobile: res?.data?.mobile,
        roleId: res?.data?.roleId?._id ?? res?.data?.roleId,
      } as any);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
    if (isEdit) {
      getDetails();
    }
  }, []);

  const onSubmit = async (data: any) => {
    const { _id, ...payload } = data;

    try {
      isEdit
        ? await http.put(ENDPOINTS.ADMIN_USERS.UPDATE(_id), payload)
        : await http.post(ENDPOINTS.ADMIN_USERS.CREATE, payload);

      navigate(ROUTE_PATHS.APP.ADMIN_USERS.LIST);

      addToast({
        title: "Success",
        color: "success",
        description: `Admin user ${isEdit ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <FormHeading
        title={`${isEdit ? "Edit" : "Create"} Admin User`}
        description={
          isEdit
            ? "Update profile details and system role for this administrative user."
            : "Register a new administrative user and assign them a system role."
        }
      />

      {loading ? (
        <LoadingProgress />
      ) : (
        <Card shadow="none" className="p-5">
          <div className="grid sm:grid-cols-2 gap-5">
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

                      if (field.type === "select") {
                        return (
                          <Select
                            {...inputProps}
                            label={field.label}
                            isInvalid={!!error}
                            selectedKeys={new Set([inputProps.value])}
                            labelPlacement="outside"
                            errorMessage={error?.message}
                            placeholder={field.placeholder}
                          >
                            {roles?.map((item) => (
                              <SelectItem key={item?._id}>
                                {item?.name}
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

export default AdminUserFormPage;

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
    name: "roleId",
    label: "Role",
    type: "select",
    placeholder: "Select role",
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
