import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ConfigDialog from "@/components/dialogs/ConfigDialog";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import { Config } from "@/types/types";
import {
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

const ConfigListPage = () => {
  const { page, setTotalPages, renderPagination } = usePagination();
  const [editModal, setEditModal] = useState<any>({
    isOpen: false,
    config: null,
  });

  const {
    data: configs = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["configs", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.CONFIGS.LIST, {
        params: {
          page,
          limit: 10,
        },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as Config[];
    },
  });

  return (
    <div>
      <ListHeading
        title="Manage Configs"
        description="Manage various settings and configurations of the application."
      />

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Setting</TableColumn>
          <TableColumn>Value</TableColumn>
          <TableColumn>Updated At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {configs?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <p className="font-medium">{item.title}</p>
                <p className="line-clamp-1 text-xs text-gray-500">
                  {item.description}
                </p>
              </TableCell>
              <TableCell>{item.value}</TableCell>
              <TableCell>
                <TableDate date={item?.updatedAt} />
              </TableCell>
              <TableCell className="flex items-center justify-end gap-3">
                <Button
                  color="primary"
                  size="sm"
                  isIconOnly
                  variant="flat"
                  className="font-medium"
                  onPress={() =>
                    setEditModal({
                      isOpen: true,
                      config: item,
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

      {configs?.length > 0 && renderPagination()}

      {editModal.config && (
        <ConfigDialog
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, config: null })}
          config={editModal.config}
          refresh={refetch}
        />
      )}
    </div>
  );
};

export default ConfigListPage;
