import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import HelpSupportDialog from "@/components/dialogs/HelpSupportDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import StatusChip from "@/components/shared/StatusChip";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import { HelpSupport } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import {
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

const HelpSupportListPage = () => {
  const { page, setTotalPages, renderPagination } = usePagination();
  const [ticketModal, setTicketModal] = useState<any>({
    isOpen: false,
    ticket: null,
  });

  const {
    data: tickets = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["help-support", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.HELP_SUPPORT.LIST, {
        params: {
          page,
          limit: 10,
        },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as HelpSupport[];
    },
  });

  return (
    <div>
      <ListHeading
        title="Help Support"
        description="Manage user queries and support requests."
      />

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>User</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn>Updated At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {tickets?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    color="primary"
                    name={item?.user?.fullName}
                    src={item?.user?.profilePhoto?.url}
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {item?.user?.fullName}
                    </p>
                    <p className="text-xs text-default-500">
                      {item?.user?.mobile}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{CommonUtils.formatTitle(item.type)}</TableCell>
              <TableCell>
                <StatusChip status={item.status} />
              </TableCell>
              <TableCell>
                <TableDate date={item.createdAt} />
              </TableCell>
              <TableCell>
                <TableDate date={item.updatedAt} />
              </TableCell>
              <TableCell className="flex items-center justify-end gap-3">
                <Button
                  color="primary"
                  size="sm"
                  isIconOnly
                  variant="flat"
                  className="font-medium"
                  onPress={() =>
                    setTicketModal({
                      isOpen: true,
                      ticket: item,
                    })
                  }
                >
                  <FiEdit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {tickets?.length > 0 && renderPagination()}

      {ticketModal.isOpen && (
        <HelpSupportDialog
          refetch={refetch}
          isOpen={ticketModal.isOpen}
          ticket={ticketModal.ticket}
          onClose={() => setTicketModal({ isOpen: false, ticket: null })}
        />
      )}
    </div>
  );
};

export default HelpSupportListPage;
