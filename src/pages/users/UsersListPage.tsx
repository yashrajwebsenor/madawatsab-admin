import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import StatusChip from "@/components/shared/StatusChip";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { CompleteStatus } from "@/types/enum";
import { User } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Chip,
  Select,
  SelectItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MdBlock, MdVerified } from "react-icons/md";
import { FiUnlock } from "react-icons/fi";
import SendNotificationDialog from "@/components/dialogs/SendNotificationDialog";

type VerifiedFilter = "all" | "verified" | "unverified";
type SubscriptionFilter = "all" | "subscribed" | "unsubscribed";

// Last 12 months (including the current one) for the "Created In" filter,
// value in "YYYY-MM" form (matches the backend's `month` query param).
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - i);
  const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const label = d.toLocaleString("default", { month: "long", year: "numeric" });
  return { value, label };
});

const UsersListPage = () => {
  const [notificationModal, setNotificationModal] = useState<any>({
    isOpen: false,
    data: [],
  });

  const [verified, setVerified] = useState<VerifiedFilter>("all");
  const [subscription, setSubscription] = useState<SubscriptionFilter>("all");
  const [month, setMonth] = useState<string>("");
  const [cityQuery, setCityQuery] = useState("");
  const [cityId, setCityId] = useState<string>("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [banningId, setBanningId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { page, setTotalPages, renderPagination } = usePagination();

  const { data: cityOptions = [] } = useQuery({
    queryKey: ["users-city-search", cityQuery],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.CONFIGS.SEARCH_CITIES, {
        params: { name: cityQuery },
      });
      return (res || []) as { id: number; name: string; stateName?: string }[];
    },
    enabled: cityQuery.trim().length >= 2,
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", page, verified, subscription, month, cityId],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.USERS.LIST, {
        params: {
          page,
          limit: 10,
          ...(verified !== "all" && { verified }),
          ...(subscription !== "all" && { subscription }),
          ...(month && { month }),
          ...(cityId && { cityId }),
        },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as User[];
    },
  });

  const handleVerify = async (id: string) => {
    try {
      setVerifyingId(id);
      await http.put(ENDPOINTS.USERS.VERIFY(id), { isVerified: true });
      addToast({
        title: "Success",
        description: "User verified",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.log(error);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleToggleBan = async (id: string, nextBanned: boolean) => {
    try {
      setBanningId(id);
      await http.put(ENDPOINTS.USERS.BAN(id), { isBanned: nextBanned });
      addToast({
        title: "Success",
        description: nextBanned ? "User banned" : "User unbanned",
        color: nextBanned ? "danger" : "success",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.log(error);
    } finally {
      setBanningId(null);
    }
  };

  return (
    <div>
      <ListHeading
        title="Customer Management"
        description="Monitor customer activity, manage account statuses, and review detailed customer profiles."
        createLabel="Add Customer"
        createAction={ROUTE_PATHS.APP.USERS.CREATE}
      />

      <Tabs
        aria-label="Verification"
        color="primary"
        selectedKey={verified}
        onSelectionChange={(key) => setVerified(key as VerifiedFilter)}
        className="mt-3"
      >
        <Tab key="all" title="All" />
        <Tab key="verified" title="Verified" />
        <Tab key="unverified" title="Unverified" />
      </Tabs>

      <div className="grid gap-3 mt-3 sm:grid-cols-3">
        <Autocomplete
          label="City"
          labelPlacement="outside"
          placeholder="Search city"
          inputValue={cityQuery}
          onInputChange={setCityQuery}
          selectedKey={cityId}
          onSelectionChange={(key) => setCityId((key as string) ?? "")}
          allowsCustomValue={false}
        >
          {cityOptions.map((city) => (
            <AutocompleteItem key={String(city.id)} textValue={city.name}>
              {city.name}
              {city.stateName ? `, ${city.stateName}` : ""}
            </AutocompleteItem>
          ))}
        </Autocomplete>

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

        <Select
          label="Created In"
          labelPlacement="outside"
          placeholder="All time"
          selectedKeys={month ? new Set([month]) : new Set([])}
          onChange={(e) => setMonth(e.target.value || "")}
        >
          {monthOptions.map((m) => (
            <SelectItem key={m.value}>{m.label}</SelectItem>
          ))}
        </Select>
      </div>

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Gender / Status</TableColumn>
          <TableColumn>Location</TableColumn>
          <TableColumn>Work / Education</TableColumn>
          <TableColumn>Onboarding</TableColumn>
          <TableColumn>Agent</TableColumn>
          <TableColumn>Subscription</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {users?.map((item) => (
            <TableRow
              key={item._id}
              className="cursor-pointer hover:bg-default-100"
              onClick={() =>
                navigate(
                  ROUTE_PATHS.APP.USERS.DETAILS.replace(":id", item._id),
                )
              }
            >
              <TableCell>
                <div className="flex items-center gap-2 w-fit">
                  <Avatar
                    size="sm"
                    color="primary"
                    name={item?.fullName}
                    src={item?.profilePhoto?.url}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm hover:underline">
                        {item?.fullName}
                      </p>
                      {item?.isVerified && (
                        <MdVerified
                          className="text-primary shrink-0"
                          aria-label="Verified"
                        />
                      )}
                      {item?.isDeleted && (
                        <Chip color="danger" size="sm" variant="flat">
                          Deleted
                        </Chip>
                      )}
                      {item?.isBanned && (
                        <Chip color="danger" size="sm" variant="flat">
                          Banned
                        </Chip>
                      )}
                    </div>
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
                <div className="flex flex-col">
                  <p className="text-sm capitalize">
                    {item?.workSector || "-"}
                  </p>
                  <p className="text-xs text-default-500">
                    {item?.qualification || "-"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <StatusChip
                  status={
                    item?.isOnboardingCompleted
                      ? CompleteStatus.completed
                      : CompleteStatus.pending
                  }
                />
              </TableCell>
              <TableCell>
                {item?.assignedAgent ? (
                  <div className="flex flex-col">
                    <p className="text-sm">{item.assignedAgent.fullName}</p>
                    <p className="text-xs text-default-500">
                      {item.assignedAgent.mobile}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-default-500">-</p>
                )}
              </TableCell>
              <TableCell>
                {item?.activeSubscription ? (
                  <div className="flex flex-col">
                    <p className="text-sm capitalize">
                      {CommonUtils.formatTitle(item.activeSubscription.planType)}
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
              <TableCell
                className="flex gap-3 justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                {!item?.isVerified && !item?.isDeleted && (
                  <Button
                    color="primary"
                    size="sm"
                    variant="solid"
                    className="font-medium"
                    isLoading={verifyingId === item._id}
                    startContent={
                      verifyingId !== item._id && <MdVerified size={16} />
                    }
                    onPress={() => handleVerify(item._id)}
                  >
                    Verify
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="flat"
                  className="font-medium"
                  onPress={() =>
                    setNotificationModal({
                      isOpen: true,
                      data: [item?._id],
                    })
                  }
                >
                  Notify
                </Button>
                <Button
                  color={item?.isBanned ? "success" : "danger"}
                  size="sm"
                  variant="flat"
                  className="font-medium"
                  isLoading={banningId === item._id}
                  startContent={
                    banningId !== item._id &&
                    (item?.isBanned ? (
                      <FiUnlock size={16} />
                    ) : (
                      <MdBlock size={16} />
                    ))
                  }
                  onPress={() => handleToggleBan(item._id, !item?.isBanned)}
                >
                  {item?.isBanned ? "Unban" : "Ban"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users?.length > 0 && renderPagination()}

      {notificationModal.isOpen && (
        <SendNotificationDialog
          isOpen={notificationModal.isOpen}
          data={{ userIds: notificationModal.data }}
          onClose={() => setNotificationModal({ isOpen: false, data: [] })}
        />
      )}
    </div>
  );
};

export default UsersListPage;
