import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import ViewPhotosDialog from "@/components/dialogs/ViewPhotosDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import StatusChip from "@/components/shared/StatusChip";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { ActiveStatus, AttachmentTypes } from "@/types/enum";
import { Advertisement } from "@/types/types";
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
import dayjs from "dayjs";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const AdvertisementListPage = () => {
  const [loading, setLoading] = useState(false);
  const { page, setTotalPages, renderPagination } = usePagination();
  const [viewBannerDialog, setViewBannerDialog] = useState<any>({
    isOpen: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState<any>({
    isOpen: false,
    data: null,
  });

  const {
    data: advertisements = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["advertisements", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.ADVERTISEMENTS.LIST, {
        params: {
          page,
          limit: 10,
        },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as Advertisement[];
    },
  });

  const handleDelete = async () => {
    try {
      setLoading(true);
      await http.delete(
        ENDPOINTS.ADVERTISEMENTS.DELETE(deleteModal?.data?._id),
      );
      refetch();
      addToast({
        title: "Success",
        color: "success",
        description: "Advertisement deleted successfully",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, isActive: boolean) => {
    try {
      setLoading(true);
      await http.put(ENDPOINTS.ADVERTISEMENTS.UPDATE_STATUS(id), {
        isActive,
      });
      refetch();
      addToast({
        title: "Success",
        color: "success",
        description: "Advertisement status updated successfully",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ListHeading
        title="Manage Advertisements"
        description="Add, edit, and manage all advertisements displayed across the platform."
        createLabel="Add Advertisement"
        createAction={ROUTE_PATHS.APP.ADVERTISEMENTS.CREATE}
      />

      <Table shadow="none">
        <TableHeader>
          <TableColumn>Advertisement</TableColumn>
          <TableColumn>Total Clicks</TableColumn>
          <TableColumn>Start Date</TableColumn>
          <TableColumn>End Date</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {advertisements?.map((item) => {
            const src =
              item?.banner?.type === AttachmentTypes.ad_video
                ? item?.banner?.thumbnailUrl
                : item?.banner?.url;

            return (
              <TableRow key={item._id}>
                <TableCell className="max-w-[250px] flex items-center gap-3">
                  <img
                    src={src}
                    alt={item?.title}
                    onClick={() =>
                      setViewBannerDialog({ data: item, isOpen: true })
                    }
                    className="w-[60px] rounded-md cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-sm">{item?.title}</p>
                    <p className="text-xs text-default-500 line-clamp-1">
                      {item?.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{item?.clicks}</TableCell>
                <TableCell>
                  {dayjs(item?.startDate).format("DD MMM YYYY")}
                </TableCell>
                <TableCell>
                  {dayjs(item?.endDate).format("DD MMM YYYY")}
                </TableCell>
                <TableCell>
                  <StatusChip
                    status={
                      item.isActive
                        ? ActiveStatus.active
                        : ActiveStatus.inactive
                    }
                  />
                </TableCell>
                <TableCell>
                  <TableDate date={item?.createdAt} />
                </TableCell>
                <TableCell className="flex items-center justify-end gap-3">
                  <Button
                    size="sm"
                    variant="flat"
                    isLoading={loading}
                    className="font-medium"
                    color={item.isActive ? "warning" : "success"}
                    onPress={() => handleUpdateStatus(item._id, !item.isActive)}
                  >
                    {item.isActive ? "Pause" : "Resume"}
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    as={Link}
                    isIconOnly
                    variant="flat"
                    className="font-medium"
                    to={ROUTE_PATHS.APP.ADVERTISEMENTS.UPDATE.replace(
                      ":id",
                      item._id,
                    )}
                  >
                    <FiEdit />
                  </Button>
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
            );
          })}
        </TableBody>
      </Table>

      {advertisements?.length > 0 && renderPagination()}

      {deleteModal.isOpen && (
        <ConfirmationDialog
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ data: null, isOpen: false })}
          onConfirm={handleDelete}
        />
      )}

      {viewBannerDialog.isOpen && (
        <ViewPhotosDialog
          isSingle
          isOpen={viewBannerDialog.isOpen}
          photos={[viewBannerDialog?.data?.banner]}
          onClose={() => setViewBannerDialog({ data: null, isOpen: false })}
        />
      )}
    </div>
  );
};

export default AdvertisementListPage;
