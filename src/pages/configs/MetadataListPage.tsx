import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import StatusChip from "@/components/shared/StatusChip";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { ActiveStatus } from "@/types/enum";
import { Metadata } from "@/types/types";
import CommonUtils from "@/utils/common.utils";
import {
  addToast,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useParams } from "react-router-dom";

const MetadataListPage = () => {
  const { type } = useParams();
  const [deleteModal, setDeleteModal] = useState<any>({
    isOpen: false,
    data: null,
  });

  const { page, setTotalPages, renderPagination } = usePagination();

  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [`metadata-${type}`, page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.METADATA.LIST(type!), {
        params: { page, limit: 10 },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as Metadata[];
    },
  });

  const handleDelete = async () => {
    try {
      await http.delete(ENDPOINTS.METADATA.DELETE(deleteModal?.data?._id));
      refetch();
      addToast({
        title: "Success",
        color: "success",
        description: `${CommonUtils.formatTitle(type as string)} deleted successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const metadata = data ?? [];

  return (
    <div>
      <ListHeading
        title={CommonUtils.formatTitle(type!)}
        description={`Manage the ${CommonUtils.formatTitle(type as string)}.`}
        createAction={ROUTE_PATHS.APP.CONFIGS.METADATA.CREATE.replace(
          ":type",
          type!,
        )}
      />

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {metadata?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <StatusChip
                  status={
                    item?.isActive ? ActiveStatus.active : ActiveStatus.inactive
                  }
                />
              </TableCell>
              <TableCell>
                <TableDate date={item?.createdAt} />
              </TableCell>
              <TableCell className="flex gap-3 justify-end">
                <Button
                  color="danger"
                  size="sm"
                  isIconOnly
                  variant="flat"
                  className="font-medium"
                  onPress={() => setDeleteModal({ data: item, isOpen: true })}
                >
                  <MdOutlineDeleteOutline />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {metadata?.length > 0 && renderPagination()}

      {deleteModal.isOpen && (
        <ConfirmationDialog
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ data: null, isOpen: false })}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default MetadataListPage;
