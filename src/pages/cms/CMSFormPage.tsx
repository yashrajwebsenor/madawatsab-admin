import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import FormHeading from "@/components/lib/FormHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import ROUTE_PATHS from "@/routes/route-paths";
import { cmsSchema } from "@/utils/validations.utils";
import { addToast, Button, Card, Input } from "@heroui/react";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const defaultValues = {
  name: "",
  content: "",
};

const CMSFormPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(cmsSchema),
  });

  const getDetails = async () => {
    try {
      setLoading(true);
      const res = await http.get(ENDPOINTS.CMS.DETAILS(slug!));
      if (res?.data) {
        reset({
          name: res?.data?.name,
          slug: res?.data?.slug,
          content: res?.data?.content,
        } as any);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await http.put(ENDPOINTS.CMS.UPDATE(slug!), data);
      navigate(ROUTE_PATHS.APP.CMS.LIST);
      addToast({
        title: "Success",
        description: "CMS updated successfully",
        color: "success",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div>
      <FormHeading
        title="Update CMS"
        description="Edit the content and styling of your system's dynamic pages."
      />

      {loading ? (
        <LoadingProgress />
      ) : (
        <Card shadow="none" className="grid gap-5 p-5">
          <div className="grid sm:grid-cols-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Name"
                  labelPlacement="outside"
                  isInvalid={!!errors?.name}
                  placeholder="Terms & Conditions"
                  errorMessage={errors.name?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  {...field}
                  label="Content"
                  placeholder="Enter your content"
                  isInvalid={!!errors?.content}
                  errorMessage={errors.content?.message}
                />
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              isLoading={isSubmitting}
              color="primary"
              onPress={() => onSubmit()}
            >
              Save
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CMSFormPage;
