import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import { DialogProps } from "@/types/types";
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
  data: { _id: string; fullName: string };
}

const SendRequirementDialog = ({ isOpen, onClose, data }: Props) => {
  const [requirementText, setRequirementText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!requirementText.trim()) return;

    try {
      setSubmitting(true);
      await http.post(ENDPOINTS.AGENTS.SEND_REQUIREMENT(data._id), {
        requirementText: requirementText.trim(),
      });
      addToast({
        title: "Sent",
        color: "success",
        description: "Requirement sent to the super admin",
      });
      setRequirementText("");
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" backdrop="blur">
      <ModalContent>
        <ModalHeader>
          Send {data?.fullName}'s Marriage Requirement
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-default-500">
            Call the customer, note their partner preference / marriage
            requirement, and describe it here for the super admin to match.
          </p>
          <Textarea
            minRows={6}
            placeholder="e.g. Looking for a match aged 25-30, based in Mumbai, working professional, Sunni sect..."
            value={requirementText}
            onValueChange={setRequirementText}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={submitting}
            isDisabled={!requirementText.trim()}
            onPress={handleSubmit}
          >
            Send to Super Admin
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendRequirementDialog;
