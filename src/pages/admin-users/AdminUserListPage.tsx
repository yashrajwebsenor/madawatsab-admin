import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { User } from "@/types/types";
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
import { Link } from "react-router-dom";

const AdminUserListPage = () => {
  const { page, setTotalPages, renderPagination } = usePagination();
  const [deleteModal, setDeleteModal] = useState<any>({
    isOpen: false,
    data: null,
  });

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.ADMIN_USERS.LIST, {
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
      await http.delete(ENDPOINTS.ADMIN_USERS.DELETE(deleteModal?.data?._id));
      refetch();
      addToast({
        title: "Success",
        color: "success",
        description: "Admin deleted successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ListHeading
        title="Admin Users"
        description="Manage your team members and administrative access to the platform."
        createLabel="Add Admin"
        createAction={ROUTE_PATHS.APP.ADMIN_USERS.CREATE}
      />

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>User</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Mobile</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {(data ?? [])?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <p className="font-medium text-sm">{item?.fullName}</p>
                <p className="text-xs text-default-500">{item?.roleId?.name}</p>
              </TableCell>
              <TableCell>{item?.email}</TableCell>
              <TableCell>{item?.mobile}</TableCell>
              <TableCell>
                <TableDate date={item?.createdAt} />
              </TableCell>
              <TableCell className="flex items-center justify-end gap-3">
                <Button
                  color="primary"
                  size="sm"
                  as={Link}
                  isIconOnly
                  variant="flat"
                  className="font-medium"
                  to={ROUTE_PATHS.APP.ADMIN_USERS.UPDATE.replace(
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
          ))}
        </TableBody>
      </Table>

      {data && data?.length > 0 && renderPagination()}

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

export default AdminUserListPage;
