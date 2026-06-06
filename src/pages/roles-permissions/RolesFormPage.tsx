import { addToast, Button, Card, Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BasicDetails from "./BasicDetails";
import PermissionsGroup from "./PermissionsGroup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { roleSchema } from "@/utils/validations.utils";
import { HiLockClosed } from "react-icons/hi2";
import http from "@/api/http";
import ENDPOINTS from "@/api/endpoints";
import ROUTE_PATHS from "@/routes/route-paths";
import FormHeading from "@/components/lib/FormHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";

const defaultValues = {
  name: "",
  description: "",
  permissions: [],
};

const RolesFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(
    searchParams?.get("defaultTab") || "0",
  );

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, resolver: yupResolver(roleSchema[activeTab]) });

  const getDetails = async () => {
    try {
      setLoading(true);
      const res = await http.get(ENDPOINTS.ROLES.DETAILS(id!));
      if (res?.data) {
        reset({
          name: res.data?.name,
          description: res.data?.description,
          permissions: res.data?.permissions,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      getDetails();
    }
  }, []);

  const onSubmit = async (data: typeof defaultValues) => {
    try {
      const res = isEditMode
        ? await http.put(ENDPOINTS.ROLES.UPDATE(id!), data)
        : await http.post(ENDPOINTS.ROLES.CREATE, data);
      if (isEditMode) {
        navigate(ROUTE_PATHS.APP.ROLES.LIST);
      } else {
        navigate(
          ROUTE_PATHS.APP.ROLES.UPDATE.replace(":id", res?.data?._id) +
            "?defaultTab=1",
        );
      }
      addToast({
        title: "Success",
        description: `Role ${isEditMode ? "updated" : "created"} successfully`,
        color: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <FormHeading
        title={isEditMode ? "Edit Role" : "Create Role"}
        description={
          isEditMode
            ? "Modify existing role permissions and accessibility settings."
            : "Define a new administrative role and assign specific system permissions."
        }
      />

      {loading ? (
        <LoadingProgress />
      ) : (
        <Card shadow="none" className="p-5 border">
          <Tabs
            className="mb-5"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key.toString())}
          >
            <Tab key="0" title="Basic Details" className="font-medium" />
            <Tab
              key="1"
              title={
                <div className="flex items-center gap-2">
                  <span>Permissions</span>
                  {!isEditMode && <HiLockClosed className="text-gray-400" />}
                </div>
              }
              isDisabled={!isEditMode}
              className="font-medium"
            />
          </Tabs>

          {activeTab === "0" && (
            <BasicDetails control={control} errors={errors} />
          )}
          {activeTab === "1" && (
            <PermissionsGroup
              errors={errors}
              control={control}
              setValue={setValue}
            />
          )}

          <div className="flex justify-end gap-3 mt-5">
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

export default RolesFormPage;
