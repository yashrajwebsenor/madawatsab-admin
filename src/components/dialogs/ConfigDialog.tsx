import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import CONFIG from "@/configs/config";
import { ConfigValueTypes } from "@/types/enum";
import { Config, DialogProps } from "@/types/types";
import {
  addToast,
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";

interface Props extends DialogProps {
  config: Config;
  refresh: () => void;
}

const ConfigDialog = ({ isOpen, onClose, config, refresh }: Props) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(config.value);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await http.put(ENDPOINTS.CONFIGS.UPDATE(config._id), {
        ...config,
        value,
      });
      refresh();
      onClose();
      addToast({
        title: "Success",
        color: "success",
        description: `${config.title} updated successfully`,
      });
    } catch (error) {
      addToast({
        title: "Error",
        color: "danger",
        description: `Failed to update ${config.key}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="lg">
      <ModalContent>
        {(handleClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {config.title}
            </ModalHeader>
            <ModalBody>
              {(config.valueType === ConfigValueTypes.text ||
                config.valueType === ConfigValueTypes.number) && (
                <Input
                  size="sm"
                  autoFocus
                  value={value}
                  variant="underlined"
                  type={config.valueType}
                  description={config.description}
                  onChange={(ev) => setValue(ev.target.value)}
                />
              )}

              <Alert color="warning" title="Important" className="items-start">
                <p className="text-xs font-medium mt-1">
                  Changes impact {CONFIG.APP_NAME} app behavior—verify values
                  before saving.
                </p>
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button size="sm" variant="light" onPress={handleClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                color="primary"
                isLoading={loading}
                onPress={handleUpdate}
                disabled={value === config.value || !value?.trim()}
                className="text-white font-medium disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfigDialog;
