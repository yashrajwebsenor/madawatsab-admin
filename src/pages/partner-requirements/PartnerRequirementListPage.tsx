import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import FindMatchesDialog from "@/components/dialogs/FindMatchesDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import { PartnerPreferenceStatus } from "@/types/enum";
import { PartnerPreferenceRequest } from "@/types/types";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type StatusFilter = "all" | PartnerPreferenceStatus;

const statusColor: Record<PartnerPreferenceStatus, "warning" | "success" | "default"> = {
  [PartnerPreferenceStatus.pending]: "warning",
  [PartnerPreferenceStatus.matched]: "success",
  [PartnerPreferenceStatus.closed]: "default",
};

const PartnerRequirementListPage = () => {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [matchesModal, setMatchesModal] = useState<any>({
    isOpen: false,
    data: null,
  });

  const queryClient = useQueryClient();
  const { page, setTotalPages, renderPagination } = usePagination();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["partner-requirements", page, status],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.PARTNER_REQUIREMENTS.LIST, {
        params: {
          page,
          limit: 10,
          ...(status !== "all" && { status }),
        },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as PartnerPreferenceRequest[];
    },
  });

  return (
    <div>
      <ListHeading
        title="Partner Requirements"
        description="Marriage requirements agents have gathered from their assigned customers. Find matches and send recommendations."
      />

      <Tabs
        aria-label="Status"
        color="primary"
        selectedKey={status}
        onSelectionChange={(key) => setStatus(key as StatusFilter)}
        className="mt-3"
      >
        <Tab key="all" title="All" />
        <Tab key={PartnerPreferenceStatus.pending} title="Pending" />
        <Tab key={PartnerPreferenceStatus.matched} title="Matched" />
        <Tab key={PartnerPreferenceStatus.closed} title="Closed" />
      </Tabs>

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Agent</TableColumn>
          <TableColumn>Requirement</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Sent At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent="No requirements found."
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
                <div className="flex flex-col">
                  <p className="text-sm">{item?.agentId?.fullName}</p>
                  <p className="text-xs text-default-500">
                    {item?.agentId?.mobile}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm max-w-xs line-clamp-2">
                  {item?.requirementText}
                </p>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={statusColor[item.status]}
                  className="capitalize"
                >
                  {item.status}
                </Chip>
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
                  onPress={() => setMatchesModal({ isOpen: true, data: item })}
                >
                  Find Matches
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {requests?.length > 0 && renderPagination()}

      {matchesModal.isOpen && (
        <FindMatchesDialog
          isOpen={matchesModal.isOpen}
          data={matchesModal.data}
          onClose={() => setMatchesModal({ isOpen: false, data: null })}
          refetch={() =>
            queryClient.invalidateQueries({ queryKey: ["partner-requirements"] })
          }
        />
      )}
    </div>
  );
};

export default PartnerRequirementListPage;
