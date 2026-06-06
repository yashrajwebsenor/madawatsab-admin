import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import LoadingProgress from "@/components/lib/LoadingProgress";
import { Checkbox, Divider } from "@heroui/react";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

const PermissionsGroup = ({ control, errors, setValue }: any) => {
  const [loading, setLoading] = useState(false);
  const [allPermissions, setAllPermissions] = useState<any>([]);

  const { permissions } = useWatch({ control });

  const getAllPermissions = async () => {
    try {
      setLoading(true);
      const res = await http.get(ENDPOINTS.PERMISSIONS.ALL);
      if (res?.data) {
        setAllPermissions(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPermissions();
  }, []);

  const handlePermissionChange = (permission: any, checked: boolean) => {
    if (checked) {
      setValue("permissions", [...permissions, permission?.value]);
    } else {
      setValue(
        "permissions",
        permissions.filter((value: string) => value !== permission?.value),
      );
    }
  };

  return loading ? (
    <LoadingProgress />
  ) : (
    <div>
      {allPermissions?.length > 0 ? (
        <div>
          <p className="font-semibold">Module Access</p>
          <Divider className="my-3" />
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            {allPermissions?.map((permission: any) => {
              const isSelected = permissions?.includes(permission?.value);

              return (
                <Checkbox
                  key={permission?._id}
                  isSelected={isSelected}
                  onChange={(ev) =>
                    handlePermissionChange(permission, ev.target.checked)
                  }
                >
                  <p className="text-sm">{permission?.name}</p>
                  <p className="text-xs text-default-400">
                    {permission?.value}
                  </p>
                </Checkbox>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-700">No permissions yet!</p>
      )}

      {errors && (
        <p className="text-xs text-danger my-5">
          {errors?.permissions?.message}
        </p>
      )}
    </div>
  );
};

export default PermissionsGroup;
