import { DialogProps } from "@/types/types";
import { sendNotificationSchema } from "@/utils/validations.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  addToast,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { FiBell, FiSend, FiX } from "react-icons/fi";
import http from "@/api/http";
import ENDPOINTS from "@/api/endpoints";

const defaultValues = {
  title: "",
  body: "",
};

const SendNotificationDialog = ({ isOpen, onClose, data }: DialogProps) => {
  const userIds = data?.userIds || [];

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(sendNotificationSchema),
  });

  const onSubmit = handleSubmit(async (formData: any) => {
    await http.post(ENDPOINTS.NOTIFICATIONS.SEND, {
      ...formData,
      userId: userIds[0],
    });
    addToast({
      title: "Notification Sent",
      color: "success",
      description: `Your message has been broadcasted successfully`,
    });
    onClose();
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          },
        },
      }}
      classNames={{
        base: "bg-white dark:bg-zinc-900 shadow-2xl rounded-[32px]",
        header: "border-b border-default-100 py-6",
        body: "py-6",
        footer: "border-t border-default-100 py-4",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={onSubmit}>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 text-primary-600 p-2.5 rounded-2xl shadow-sm">
                  <FiBell size={24} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-default-900">
                    Send Notification
                  </h3>
                  <p className="text-xs font-medium text-default-500">
                    Broadcast a message to selected users
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Notification Title"
                      placeholder="Enter a catchy title..."
                      variant="bordered"
                      labelPlacement="outside"
                      isInvalid={!!errors.title}
                      errorMessage={errors.title?.message}
                      classNames={{
                        label: "text-default-700 font-semibold mb-1",
                        inputWrapper:
                          "h-12 rounded-xl border-default-200 hover:border-primary focus-within:!border-primary transition-colors",
                      }}
                    />
                  )}
                />

                <Controller
                  name="body"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Message Body"
                      placeholder="Write your notification message here..."
                      variant="bordered"
                      labelPlacement="outside"
                      minRows={4}
                      isInvalid={!!errors.body}
                      errorMessage={errors.body?.message}
                      classNames={{
                        label: "text-default-700 font-semibold mb-1",
                        inputWrapper:
                          "rounded-2xl border-default-200 hover:border-primary focus-within:!border-primary transition-colors py-3",
                      }}
                    />
                  )}
                />
              </div>
            </ModalBody>

            <ModalFooter className="gap-3">
              <Button
                variant="flat"
                onPress={onClose}
                startContent={<FiX />}
                className="bg-default-100 text-default-600 hover:bg-default-200 px-6 font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="shadow"
                isLoading={isSubmitting}
                startContent={!isSubmitting && <FiSend />}
                className="px-10 font-bold shadow-lg shadow-primary/20 bg-primary text-white"
              >
                Send Now
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SendNotificationDialog;
