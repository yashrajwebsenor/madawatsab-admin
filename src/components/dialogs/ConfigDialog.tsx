import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import CONFIG from "@/configs/config";
import { ConfigValueTypes, SpinSegmentType } from "@/types/enum";
import { Config, DialogProps, SpinWheelSegment } from "@/types/types";
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
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface Props extends DialogProps {
  config: Config;
  refresh: () => void;
}

const SEGMENT_COUNT = 6;

const parseSegments = (raw: string): SpinWheelSegment[] => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const ConfigDialog = ({ isOpen, onClose, config, refresh }: Props) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(config.value);
  const isSegmentsConfig = config.valueType === ConfigValueTypes.json;
  const [segments, setSegments] = useState<SpinWheelSegment[]>(() =>
    isSegmentsConfig ? parseSegments(config.value) : [],
  );

  const commitSegments = (next: SpinWheelSegment[]) => {
    setSegments(next);
    setValue(JSON.stringify(next));
  };

  const updateSegment = (index: number, patch: Partial<SpinWheelSegment>) => {
    commitSegments(
      segments.map((seg, i) => (i === index ? { ...seg, ...patch } : seg)),
    );
  };

  const moveSegment = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= segments.length) return;
    const next = [...segments];
    [next[index], next[target]] = [next[target], next[index]];
    commitSegments(next);
  };

  const segmentsValid =
    !isSegmentsConfig ||
    (segments.length === SEGMENT_COUNT &&
      segments.some((s) => Number(s.probability) > 0) &&
      segments.every(
        (s) =>
          s.type === SpinSegmentType.free_entry ||
          (Number.isFinite(Number(s.amount)) && Number(s.amount) > 0),
      ));

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      size={isSegmentsConfig ? "3xl" : "lg"}
      placement="center"
      scrollBehavior="inside"
    >
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

              {config.valueType === ConfigValueTypes.boolean && (
                <div className="flex flex-col gap-2">
                  <Switch
                    isSelected={value === "true"}
                    onValueChange={(checked) =>
                      setValue(checked ? "true" : "false")
                    }
                  >
                    {value === "true" ? "Enabled" : "Disabled"}
                  </Switch>
                  {config.description && (
                    <p className="text-xs text-gray-500">
                      {config.description}
                    </p>
                  )}
                </div>
              )}

              {isSegmentsConfig && (
                <div className="flex flex-col gap-3">
                  {config.description && (
                    <p className="text-xs text-gray-500">
                      {config.description}
                    </p>
                  )}

                  {segments.length !== SEGMENT_COUNT && (
                    <Alert color="danger" title="Invalid data">
                      <p className="text-xs mt-1">
                        Expected exactly {SEGMENT_COUNT} segments, found{" "}
                        {segments.length}.
                      </p>
                    </Alert>
                  )}

                  {segments.map((segment, index) => (
                    <div
                      key={index}
                      className="flex items-end gap-2 border border-gray-200 rounded-xl p-3"
                    >
                      <div className="flex flex-col items-center justify-center gap-1 mr-1">
                        <span className="text-xs text-gray-400 font-medium">
                          #{index + 1}
                        </span>
                        <div className="flex flex-col">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            isDisabled={index === 0}
                            onPress={() => moveSegment(index, -1)}
                          >
                            <MdKeyboardArrowUp />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            isDisabled={index === segments.length - 1}
                            onPress={() => moveSegment(index, 1)}
                          >
                            <MdKeyboardArrowDown />
                          </Button>
                        </div>
                      </div>

                      <Input
                        size="sm"
                        label="Label"
                        labelPlacement="outside"
                        value={segment.label}
                        onChange={(ev) =>
                          updateSegment(index, { label: ev.target.value })
                        }
                        className="max-w-[140px]"
                      />

                      <Select
                        size="sm"
                        label="Type"
                        labelPlacement="outside"
                        selectedKeys={new Set([segment.type])}
                        onChange={(ev) => {
                          const type = ev.target.value as SpinSegmentType;
                          updateSegment(index, {
                            type,
                            amount:
                              type === SpinSegmentType.free_entry
                                ? 0
                                : segment.amount || 1,
                          });
                        }}
                        className="max-w-[150px]"
                        disallowEmptySelection
                      >
                        <SelectItem key={SpinSegmentType.discount}>
                          Rupee Discount
                        </SelectItem>
                        <SelectItem key={SpinSegmentType.free_entry}>
                          Free Entry
                        </SelectItem>
                      </Select>

                      <Input
                        size="sm"
                        type="number"
                        label="Amount (Rs.)"
                        labelPlacement="outside"
                        value={String(segment.amount)}
                        isDisabled={segment.type === SpinSegmentType.free_entry}
                        onChange={(ev) =>
                          updateSegment(index, {
                            amount: Number(ev.target.value),
                          })
                        }
                        onWheel={(ev) => ev.currentTarget.blur()}
                        className="max-w-[110px]"
                      />

                      <Input
                        size="sm"
                        type="number"
                        label="Probability"
                        labelPlacement="outside"
                        value={String(segment.probability)}
                        onChange={(ev) =>
                          updateSegment(index, {
                            probability: Number(ev.target.value),
                          })
                        }
                        onWheel={(ev) => ev.currentTarget.blur()}
                        className="max-w-[110px]"
                      />
                    </div>
                  ))}

                  <p className="text-xs text-gray-500">
                    Probabilities are relative weights (they don't need to sum
                    to 100) — a segment with weight 20 is twice as likely as
                    one with weight 10.
                  </p>
                </div>
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
                disabled={
                  value === config.value || !value?.trim() || !segmentsValid
                }
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
