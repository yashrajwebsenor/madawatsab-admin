import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { User } from "@/types/types";
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
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const AgentCustomersList = () => {
  const { page, setTotalPages, renderPagination } = usePagination();

  const { data, isLoading } = useQuery({
    queryKey: ["agent-customers", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.AGENTS.USERS_LIST, {
        params: {
          page,
          limit: 10,
        },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as User[];
    },
  });

  const users = data ?? [];

  return (
    <div>
      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Gender / Status</TableColumn>
          <TableColumn>Sect / Community</TableColumn>
          <TableColumn>Location</TableColumn>
          <TableColumn>Work / Education</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No records found."}
          loadingContent={<LoadingProgress />}
        >
          {users?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    color="primary"
                    name={item?.fullName}
                    src={item?.photos?.[0]?.url}
                  />
                  <div>
                    <p className="font-medium text-sm">{item?.fullName}</p>
                    <p className="text-xs text-default-500">{item?.userId}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="text-sm capitalize">{item?.gender || "-"}</p>
                  <p className="text-xs text-default-500 capitalize">
                    {CommonUtils.formatTitle(item?.maritalStatus)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col capitalize">
                  <p className="text-sm border-b border-divider pb-0.5 w-fit">
                    {item?.sect || "-"}
                  </p>
                  <p className="text-xs text-default-500">
                    {item?.community || "-"}
                  </p>
                </div>
              </TableCell>
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
                <div className="flex flex-col">
                  <p className="text-sm capitalize">
                    {item?.workSector || "-"}
                  </p>
                  <p className="text-xs text-default-500">
                    {item?.qualification || "-"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <TableDate date={item?.createdAt} />
              </TableCell>
              <TableCell className="flex justify-end">
                <Button
                  color="primary"
                  size="sm"
                  variant="flat"
                  as={Link}
                  to={ROUTE_PATHS.APP.USERS.DETAILS.replace(":id", item._id)}
                  className="font-medium"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users?.length > 0 && renderPagination()}
    </div>
  );
};

export default AgentCustomersList;
