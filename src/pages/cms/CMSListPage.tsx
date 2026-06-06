import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { CMS } from "@/types/types";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const CMSListPage = () => {
  const { page, setTotalPages, renderPagination } = usePagination();

  const { data: cms = [], isLoading } = useQuery({
    queryKey: ["cms", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.CMS.LIST, {
        params: {
          page,
          limit: 10,
        },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as CMS[];
    },
  });

  return (
    <div>
      <ListHeading
        title="CMS Management"
        description="Edit and manage static pages, terms of service, and privacy policies."
      />

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Cms</TableColumn>
          <TableColumn>Slug</TableColumn>
          <TableColumn>Updated At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {cms?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.slug}</TableCell>
              <TableCell>
                <TableDate date={item?.updatedAt} />
              </TableCell>
              <TableCell className="flex items-center justify-end gap-3">
                <Button
                  color="primary"
                  size="sm"
                  as={Link}
                  isIconOnly
                  variant="flat"
                  className="font-medium"
                  to={ROUTE_PATHS.APP.CMS.UPDATE.replace(":slug", item.slug)}
                >
                  <FiEdit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {cms?.length > 0 && renderPagination()}
    </div>
  );
};

export default CMSListPage;
