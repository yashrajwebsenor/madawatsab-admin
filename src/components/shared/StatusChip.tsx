import { Chip } from "@heroui/react";
import CommonUtils from "@/utils/common.utils";

const StatusChip = ({ status }: { status: string }) => {
  return (
    <Chip size="sm" variant="flat" color={CommonUtils.getStatusColor(status)}>
      {CommonUtils.formatTitle(status)}
    </Chip>
  );
};

export default StatusChip;
