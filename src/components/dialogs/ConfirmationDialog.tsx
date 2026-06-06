import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { DialogProps } from "@/types/types";

interface Props extends DialogProps {
  onConfirm: () => void;
}

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        {(handleClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirmation
            </ModalHeader>
            <ModalBody>Are you sure you want to proceed?</ModalBody>
            <ModalFooter>
              <Button size="sm" variant="light" onPress={handleClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                color="danger"
                onPress={() => {
                  onConfirm();
                  handleClose();
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationDialog;
