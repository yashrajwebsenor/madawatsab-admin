import { addToast, Button, Form, Input } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/validations.utils";
import PasswordInput from "@/components/shared/PasswordInput";
import CONFIG from "@/configs/config";
import http from "@/api/http";
import ENDPOINTS from "@/api/endpoints";
import useUserStore from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";
import ROUTE_PATHS from "@/routes/route-paths";
import { UserTypes } from "@/types/enum";

const defaultValues = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: typeof defaultValues) => {
    try {
      const res = await http.post(ENDPOINTS.AUTH.LOGIN, data);
      if (res?.data) {
        addToast({
          title: "Login",
          color: "success",
          description: "Login successfully",
        });
        setUser(res?.data?.user);
        localStorage.setItem("token", res?.data?.accessToken);

        let redirection = ROUTE_PATHS.APP.DASHBOARD;

        if (res?.data?.user?.userType === UserTypes.agent) {
          redirection = ROUTE_PATHS.APP.AGENTS.CUSTOMERS;
        }

        navigate(redirection);
      }
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <div className="space-y-6">
      <img src="/assets/images/logo.png" alt="logo" className="h-10 w-auto" />
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Welcome to <span className="text-primary">{CONFIG.APP_NAME}</span>
        </h2>
        <p className="text-gray-500 text-xs mt-1">
          Please enter your credentials to login
        </p>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field) => {
          const fieldError =
            errors?.[field?.name as keyof typeof defaultValues]?.message;
          return (
            <Controller
              key={field.name}
              control={control}
              name={field.name as keyof typeof defaultValues}
              render={({ field: inputProps }) => {
                if (field.type === "password") {
                  return (
                    <PasswordInput
                      size="sm"
                      {...inputProps}
                      type={field.type}
                      label={field?.label}
                      labelPlacement="outside"
                      autoFocus={field.name === "email"}
                      placeholder={field.placeholder}
                      isInvalid={!!fieldError}
                      errorMessage={fieldError}
                      variant="bordered"
                      classNames={{
                        label: "text-xs font-semibold text-gray-700",
                        inputWrapper: "h-10 min-h-10",
                      }}
                    />
                  );
                }

                return (
                  <Input
                    size="sm"
                    {...inputProps}
                    type={field.type}
                    label={field?.label}
                    labelPlacement="outside"
                    autoFocus={field.name === "email"}
                    placeholder={field.placeholder}
                    isInvalid={!!fieldError}
                    errorMessage={fieldError}
                    variant="bordered"
                    classNames={{
                      label: "text-xs font-semibold text-gray-700",
                      inputWrapper: "h-10 min-h-10",
                    }}
                  />
                );
              }}
            />
          );
        })}

        <Button
          isLoading={isSubmitting}
          size="md"
          type="submit"
          color="primary"
          className="font-semibold w-full !mt-6 shadow-md hover:shadow-lg transition-shadow"
        >
          Login
        </Button>

        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="text-xs text-primary font-medium hover:underline"
          >
            Forgot password?
          </button>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;

const fields = [
  {
    name: "email",
    label: "Email Address",
    type: "text",
    placeholder: "Enter your email address",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
];
