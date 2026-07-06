import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import AssignAgentDialog from "@/components/dialogs/AssignAgentDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import { AgentRequest } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import {
  Avatar,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const AgentRequestListPage = () => {
  const [assignModal, setAssignModal] = useState<any>({
    isOpen: false,
    data: null,
  });

  const queryClient = useQueryClient();
  const { page, setTotalPages, renderPagination } = usePagination();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["agent-requests", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.AGENT_REQUESTS.LIST, {
        params: { page, limit: 10 },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as AgentRequest[];
    },
  });

  return (
    <div>
      <ListHeading
        title="Agent Requests"
        description="Users who paid to request an agent. Assign one based on their preferred pincode/gender."
      />

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Preferred Pincode</TableColumn>
          <TableColumn>Preferred Gender</TableColumn>
          <TableColumn>Requested At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent="No pending agent requests."
          loadingContent={<LoadingProgress />}
        >
          {requests?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
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
                      {item?.userId?.userId} · {item?.userId?.mobile}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm">{item?.pincode || "Any"}</p>
              </TableCell>
              <TableCell>
                {item?.preferredAgentGender ? (
                  <Chip size="sm" variant="flat" className="capitalize">
                    {CommonUtils.formatTitle(item.preferredAgentGender)}
                  </Chip>
                ) : (
                  <p className="text-sm text-default-500">Any</p>
                )}
              </TableCell>
              <TableCell>
                <TableDate date={item?.createdAt} />
              </TableCell>
              <TableCell className="flex justify-end">
                <Button
                  color="primary"
                  size="sm"
                  variant="flat"
                  className="font-medium"
                  onPress={() => setAssignModal({ isOpen: true, data: item })}
                >
                  Assign Agent
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {requests?.length > 0 && renderPagination()}

      {assignModal.isOpen && (
        <AssignAgentDialog
          isOpen={assignModal.isOpen}
          data={assignModal.data}
          onClose={() => setAssignModal({ isOpen: false, data: null })}
          refetch={() =>
            queryClient.invalidateQueries({ queryKey: ["agent-requests"] })
          }
        />
      )}
    </div>
  );
};

export default AgentRequestListPage;
