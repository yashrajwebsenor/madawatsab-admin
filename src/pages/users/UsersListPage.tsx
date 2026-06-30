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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MdVerified } from "react-icons/md";
import SendNotificationDialog from "@/components/dialogs/SendNotificationDialog";

type VerifiedFilter = "all" | "verified" | "unverified";

const UsersListPage = () => {
  const [notificationModal, setNotificationModal] = useState<any>({
    isOpen: false,
    data: [],
  });

  const [verified, setVerified] = useState<VerifiedFilter>("all");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { page, setTotalPages, renderPagination } = usePagination();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", page, verified],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.USERS.LIST, {
        params: {
          page,
          limit: 10,
          ...(verified !== "all" && { verified }),
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
