import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { User } from "@/types/types";
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
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const AgentListPage = () => {
  const navigate = useNavigate();
  const { page, setTotalPages, renderPagination } = usePagination();
  const [deleteModal, setDeleteModal] = useState<any>({
    isOpen: false,
    data: null,
  });

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["agents", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.AGENTS.LIST, {
        params: {
          page,
          limit: 10,
        },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as User[];
    },
  });

  const handleDelete = async () => {
    try {
      await http.delete(ENDPOINTS.AGENTS.DELETE(deleteModal?.data?._id));
      refetch();
      addToast({
        title: "Success",
        color: "success",
        description: "Agent deleted successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ListHeading
        title="Manage Agents"
        description="Manage your agents and administrative access to the platform."
        createLabel="Add Agent"
        createAction={ROUTE_PATHS.APP.AGENTS.CREATE}
      />

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>User</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Mobile</TableColumn>
          <TableColumn>Location</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {(data ?? [])?.map((item) => (
            <TableRow
              key={item._id}
              className="cursor-pointer hover:bg-default-100"
              onClick={() =>
                navigate(
                  ROUTE_PATHS.APP.AGENTS.DETAILS.replace(":id", item._id),
                )
              }
            >
              <TableCell>
                <p className="font-medium text-sm hover:underline">
                  {item?.fullName}
                </p>
                <p className="text-xs text-default-500 capitalize">
                  {item?.userId}
                </p>
              </TableCell>
              <TableCell>{item?.email}</TableCell>
              <TableCell>{item?.mobile}</TableCell>
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
                <TableDate date={item?.createdAt} />
              </TableCell>
              <TableCell
                className="flex items-center justify-end gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  color="primary"
                  size="sm"
                  as={Link}
                  isIconOnly
                  variant="flat"
                  className="font-medium"
                  to={ROUTE_PATHS.APP.AGENTS.UPDATE.replace(":id", item._id)}
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
          ))}
        </TableBody>
      </Table>

      {data && data?.length > 0 && renderPagination()}

      {deleteModal.isOpen && (
        <ConfirmationDialog
          onConfirm={handleDelete}
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ data: null, isOpen: false })}
        />
      )}
    </div>
  );
};

export default AgentListPage;
