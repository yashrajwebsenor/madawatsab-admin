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
  Avatar,
  Button,
  Chip,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@heroui/react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SendNotificationDialog from "@/components/dialogs/SendNotificationDialog";

type AccountStatus = "active" | "deleted" | "all";

const UsersListPage = () => {
  const [notificationModal, setNotificationModal] = useState<any>({
    isOpen: false,
    data: [],
  });

  const [status, setStatus] = useState<AccountStatus>("active");

  const { page, setTotalPages, renderPagination } = usePagination();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", page, status],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.USERS.LIST, {
        params: { page, limit: 10, status },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as User[];
    },
  });

  return (
    <div>
      <ListHeading
        title="Customer Management"
        description="Monitor customer activity, manage account statuses, and review detailed customer profiles."
        createLabel="Add Customer"
        createAction={ROUTE_PATHS.APP.USERS.CREATE}
      />

      <Tabs
        aria-label="Account status"
        selectedKey={status}
        onSelectionChange={(key) => setStatus(key as AccountStatus)}
        className="mt-3"
      >
        <Tab key="active" title="Active" />
        <Tab key="deleted" title="Deleted" />
        <Tab key="all" title="All" />
      </Tabs>

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Gender / Status</TableColumn>
          <TableColumn>Location</TableColumn>
          <TableColumn>Work / Education</TableColumn>
          <TableColumn>Onboarding</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {users?.map((item) => (
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
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{item?.fullName}</p>
                      {item?.isDeleted && (
                        <Chip color="danger" size="sm" variant="flat">
                          Deleted
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
                <TableDate date={item?.createdAt} />
              </TableCell>
              <TableCell className="flex gap-3 justify-end">
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
