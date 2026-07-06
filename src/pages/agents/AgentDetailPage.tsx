import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { User } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";

type SubscriptionFilter = "all" | "subscribed" | "unsubscribed";

// Last 12 months (including the current one) for the "Added In" filter,
// value in "YYYY-MM" form (matches the backend's `month` query param).
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - i);
  const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const label = d.toLocaleString("default", { month: "long", year: "numeric" });
  return { value, label };
});

interface AgentDetailResponse {
  agent: {
    _id: string;
    fullName: string;
    email: string;
    mobile: string;
    userId: string;
    referralCode?: string;
    address?: {
      cityName?: string;
      stateName?: string;
      countryName?: string;
    };
  };
  stats: { total: number; subscribed: number; unsubscribed: number };
  data: User[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <Card shadow="none" className="border border-divider">
    <CardBody className="py-4">
      <p className="text-xs text-default-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </CardBody>
  </Card>
);

const AgentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { page, setTotalPages, renderPagination } = usePagination();

  const [subscription, setSubscription] = useState<SubscriptionFilter>("all");
  const [month, setMonth] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["agent-detail", id, page, subscription, month],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.AGENTS.CUSTOMERS_OF(id!), {
        params: {
          page,
          limit: 10,
          ...(subscription !== "all" && { subscription }),
          ...(month && { month }),
        },
      });
      setTotalPages(res?.pagination?.totalPages);
      return res as AgentDetailResponse;
    },
    enabled: Boolean(id),
  });

  const agent = data?.agent;
  const stats = data?.stats;
  const users = data?.data ?? [];

  return (
    <div>
      <Button
        variant="light"
        size="sm"
        className="font-medium mb-3"
        startContent={<FiArrowLeft size={16} />}
        onPress={() => navigate(ROUTE_PATHS.APP.AGENTS.LIST)}
      >
        Back to Agents
      </Button>

      <Card shadow="none" className="border border-divider mb-4">
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="lg" color="primary" name={agent?.fullName} />
            <div>
              <p className="text-lg font-semibold">{agent?.fullName || "-"}</p>
              <p className="text-sm text-default-500">
                {agent?.email} · {agent?.mobile}
              </p>
              <p className="text-xs text-default-500">
                {CommonUtils.formatLocation({
                  city: agent?.address?.cityName ?? "",
                  state: agent?.address?.stateName ?? "",
                  country: agent?.address?.countryName ?? "",
                })}
              </p>
            </div>
          </div>
          {agent?.referralCode && (
            <Chip color="secondary" variant="flat" className="font-medium">
              Referral: {agent.referralCode}
            </Chip>
          )}
        </CardBody>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Customers Added" value={stats?.total ?? 0} />
        <StatCard label="Subscribed" value={stats?.subscribed ?? 0} />
        <StatCard label="Not Subscribed" value={stats?.unsubscribed ?? 0} />
      </div>

      <div className="grid gap-3 mt-4 sm:grid-cols-2">
        <Select
          label="Added In"
          labelPlacement="outside"
          placeholder="All time"
          selectedKeys={month ? new Set([month]) : new Set([])}
          onChange={(e) => setMonth(e.target.value || "")}
        >
          {monthOptions.map((m) => (
            <SelectItem key={m.value}>{m.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="Subscription"
          labelPlacement="outside"
          selectedKeys={new Set([subscription])}
          onChange={(e) =>
            setSubscription((e.target.value || "all") as SubscriptionFilter)
          }
        >
          <SelectItem key="all">All</SelectItem>
          <SelectItem key="subscribed">Subscribed</SelectItem>
          <SelectItem key="unsubscribed">Unsubscribed</SelectItem>
        </Select>
      </div>

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Gender / Status</TableColumn>
          <TableColumn>Location</TableColumn>
          <TableColumn>Subscription</TableColumn>
          <TableColumn>Added On</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No customers found."}
          loadingContent={<LoadingProgress />}
        >
          {users.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    color="primary"
                    name={item?.fullName}
                    src={item?.profilePhoto?.url}
                  />
                  <div>
                    <p className="font-medium text-sm">{item?.fullName}</p>
                    <p className="text-xs text-default-500">{item?.userId}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="text-sm capitalize">{item?.gender || "-"}</p>
                  <p className="text-xs text-default-500 capitalize">
                    {CommonUtils.formatTitle(item?.maritalStatus)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm">
                  {CommonUtils.formatLocation({
                    city: item?.address?.cityName,
                    state: item?.address?.stateName,
                    country: item?.address?.countryName,
                  })}
                </p>
              </TableCell>
              <TableCell>
                {item?.activeSubscription ? (
                  <div className="flex flex-col">
                    <p className="text-sm capitalize">
                      {CommonUtils.formatTitle(
                        item.activeSubscription.planType,
                      )}
                    </p>
                    <p className="text-xs text-default-500">
                      {CommonUtils.formatTitle(
                        item.activeSubscription.planDuration,
                      )}
                    </p>
                  </div>
                ) : (
                  <Chip size="sm" variant="flat">
                    No Plan
                  </Chip>
                )}
              </TableCell>
              <TableCell>
                <TableDate date={item?.createdAt} />
              </TableCell>
              <TableCell className="flex gap-2 justify-end">
                <Button
                  color="primary"
                  size="sm"
                  variant="flat"
                  as={Link}
                  to={ROUTE_PATHS.APP.USERS.DETAILS.replace(":id", item._id)}
                  className="font-medium"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users.length > 0 && renderPagination()}
    </div>
  );
};

export default AgentDetailPage;
