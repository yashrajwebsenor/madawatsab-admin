import { Card, CardBody } from "@heroui/react";
import { IconType } from "react-icons";

type Props = {
  title: string;
  value: string | number;
  icon: IconType;
  iconColor?: string;
  iconBg?: string;
};

const DashboardStatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
}: Props) => {
  return (
    <Card className="border-none shadow-sm bg-content1">
      <CardBody className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-small text-default-500 font-medium">{title}</p>
            <h4 className="text-2xl font-bold tracking-tight">{value}</h4>
          </div>
          <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
            <Icon size={24} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default DashboardStatsCard;
