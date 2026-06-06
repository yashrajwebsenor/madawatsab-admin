import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { Role } from "@/types/types";
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
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const RolesListPage = () => {
  const { page, setTotalPages, renderPagination } = usePagination();
  const [deleteModal, setDeleteModal] = useState<any>({
    isOpen: false,
    data: null,
  });

  const {
    data: roles = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["roles", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.ROLES.LIST, {
        params: { page, limit: 10 },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as Role[];
    },
  });

  const handleDelete = async () => {
    try {
      await http.delete(ENDPOINTS.ROLES.DELETE(deleteModal?.data?._id));
      refetch();
      addToast({
        title: "Success",
        color: "success",
        description: "Role deleted successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ListHeading
        title="Roles & Permissions"
        description="Manage system access levels and granular permissions for different administrative roles."
        createLabel="Add Role"
        createAction={ROUTE_PATHS.APP.ROLES.CREATE}
      />

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Role</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Total Permissions</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {roles?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {item.description?.length > 50
                  ? item.description.slice(0, 50) + "..."
                  : item.description}
              </TableCell>
              <TableCell>{item.permissions?.length}</TableCell>
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
                  to={ROUTE_PATHS.APP.ROLES.UPDATE.replace(":id", item._id)}
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

      {roles?.length > 0 && renderPagination()}

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

export default RolesListPage;
