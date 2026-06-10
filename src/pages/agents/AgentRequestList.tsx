import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import AgentRequestDialog from "@/components/dialogs/AgentRequestDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { AgentRequestStatus } from "@/types/enum";
import { AgentRequest } from "@/types/types";
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

const AgentRequestList = () => {
  const [status, setStatus] = useState(AgentRequestStatus.pending);
  const [dialog, setDialog] = useState<any>({
    isOpen: false,
    data: null,
    status: "",
  });

  const { page, setTotalPages, renderPagination } = usePagination();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["agent-requests", page, status],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.AGENTS.REQUESTS, {
        params: {
          page,
          status,
          limit: 10,
        },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as AgentRequest[];
    },
  });

  const columns = [
    { key: "customer", label: "Customer" },
    { key: "gender", label: "Gender" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    ...(status === AgentRequestStatus.pending
      ? [{ key: "actions", label: "Actions", align: "end" }]
      : []),
  ];

  return (
    <div>
      <ListHeading
        title="My Requests"
        description="Manage and track the customers requests."
      />

      <Tabs
        size="sm"
        selectedKey={status}
        onSelectionChange={(key) => setStatus(key as AgentRequestStatus)}
      >
        {Object.values(AgentRequestStatus).map((status) => (
          <Tab key={status} title={CommonUtils.formatTitle(status)} />
        ))}
      </Tabs>

      <Table shadow="none" className="mt-3">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={(column.align as "start" | "center" | "end") || "start"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {(data ?? []).map((item) => (
            <TableRow key={item._id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.key === "customer" && (
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="sm"
                        color="primary"
                        name={item?.userId?.fullName}
                        src={item?.userId?.profilePhoto?.url}
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {item?.userId?.fullName}
                        </p>
                        <p className="text-xs text-default-500">
                          {item?.userId?.mobile}
                        </p>
                      </div>
                    </div>
                  )}

                  {column.key === "gender" &&
                    CommonUtils.formatTitle(item?.userId?.gender)}

                  {column.key === "status" && (
                    <Chip
                      size="sm"
                      variant="flat"
                      color={CommonUtils.getStatusColor(item?.status)}
                    >
                      {CommonUtils.formatTitle(item?.status)}
                    </Chip>
                  )}

                  {column.key === "createdAt" && (
                    <TableDate date={item?.createdAt} />
                  )}

                  {column.key === "actions" && (
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        size="sm"
                        as={Link}
                        variant="flat"
                        color="primary"
                        className="font-medium"
                        to={ROUTE_PATHS.APP.USERS.DETAILS.replace(
                          ":id",
                          item?.userId?._id,
                        )}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="success"
                        onPress={() =>
                          setDialog({
                            isOpen: true,
                            data: item,
                            status: AgentRequestStatus.accepted,
                          })
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() =>
                          setDialog({
                            isOpen: true,
                            data: item,
                            status: AgentRequestStatus.rejected,
                          })
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(data ?? [])?.length > 0 && renderPagination()}

      {dialog.isOpen && (
        <AgentRequestDialog
          refetch={refetch}
          data={dialog.data}
          isOpen={dialog.isOpen}
          status={dialog.status}
          onClose={() => setDialog({ isOpen: false, data: null, status: "" })}
        />
      )}
    </div>
  );
};

export default AgentRequestList;
