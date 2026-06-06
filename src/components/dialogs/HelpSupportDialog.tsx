import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import { HelpSupportStatus } from "@/types/enum";
import { DialogProps, HelpSupport } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useState } from "react";

interface Props extends DialogProps {
  refetch: () => void;
  ticket: HelpSupport;
}

const HelpSupportDialog = ({ isOpen, onClose, refetch, ticket }: Props) => {
  const [loading, setLoading] = useState(false);
  const [adminResponse, setAdminResponse] = useState(ticket.adminResponse || "");

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      await http.put(ENDPOINTS.HELP_SUPPORT.UPDATE_STATUS(ticket._id), {
        adminResponse,
        status: HelpSupportStatus.resolved,
      });
      refetch();
      onClose();
      addToast({
        title: "Success",
        color: "success",
        description: "Status has been updated",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Something went wrong",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        {(handleClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {CommonUtils.formatTitle(ticket?.type)}
            </ModalHeader>
            <ModalBody className="gap-4">
              <div>
                <p className="text-sm font-medium text-default-500 mb-1">
                  Description
                </p>
                <p className="text-sm text-default-700">{ticket?.description}</p>
              </div>

              {ticket.status === HelpSupportStatus.pending && (
                <Textarea
                  label="Admin Response"
                  placeholder="Enter your response (optional)"
                  value={adminResponse}
                  onValueChange={setAdminResponse}
                  variant="bordered"
                  labelPlacement="outside"
                />
              )}

              {ticket.status === HelpSupportStatus.resolved &&
                ticket.adminResponse && (
                  <div>
                    <p className="text-sm font-medium text-default-500 mb-1">
                      Admin Response
                    </p>
                    <p className="text-sm text-default-700">
                      {ticket.adminResponse}
                    </p>
                  </div>
                )}
            </ModalBody>
            <ModalFooter>
              <Button size="sm" variant="light" onPress={handleClose}>
                Cancel
              </Button>
              {ticket.status === HelpSupportStatus.pending && (
                <Button
                  size="sm"
                  color="success"
                  isLoading={loading}
                  onPress={handleUpdateStatus}
                  className="text-white font-medium"
                >
                  Resolved
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default HelpSupportDialog;
