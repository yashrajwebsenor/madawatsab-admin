import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import TableDate from "@/components/tables/TableDate";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { ReportStatus } from "@/types/enum";
import CommonUtils from "@/utils/common.utils";
import {
  Report,
  REPORT_STATUS_COLOR,
  REPORT_STATUS_LABEL,
} from "./report.types";
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
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const statusOptions = Object.values(ReportStatus).map((value) => ({
  label: REPORT_STATUS_LABEL[value as ReportStatus],
  value,
}));

const ReportListPage = () => {
  const navigate = useNavigate();
  const { page, setTotalPages, renderPagination } = usePagination();
  const [status, setStatus] = useState<string>("");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports", page, status],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.REPORTS.LIST, {
        params: { page, limit: 10, status: status || undefined },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as Report[];
    },
  });

  return (
    <div>
      <ListHeading
        title="Reports"
        description="User-filed reports against other users. Open a report to review evidence and act."
      />

      <div className="mt-4">
        <Tabs
          aria-label="Report status"
          color="primary"
          variant="underlined"
          selectedKey={status}
          onSelectionChange={(key) => setStatus(key as string)}
        >
          {[
            <Tab key="" title="All" />,
            ...statusOptions.map((s) => <Tab key={s.value} title={s.label} />),
          ]}
        </Tabs>
      </div>

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>Reported user</TableColumn>
          <TableColumn>Reporter</TableColumn>
          <TableColumn>Reason</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Created</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No reports found."}
          loadingContent={<LoadingProgress />}
        >
          {reports?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    color="danger"
                    name={item?.reportedUserId?.fullName}
                    src={item?.reportedUserId?.profilePhoto?.url}
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {item?.reportedUserId?.fullName || "Unknown"}
                    </p>
                    <p className="text-xs text-default-500">
                      {item?.reportedUserId?.mobile}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm">
                  {item?.reporterId?.fullName || "Unknown"}
                </p>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat">
                  {CommonUtils.formatTitle(item.reason)}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={REPORT_STATUS_COLOR[item.status]}
                >
                  {REPORT_STATUS_LABEL[item.status]}
                </Chip>
              </TableCell>
              <TableCell>
                <TableDate date={item.createdAt} />
              </TableCell>
              <TableCell className="flex items-center justify-end gap-3">
                <Button
                  color="primary"
                  size="sm"
                  variant="flat"
                  endContent={<FiArrowRight />}
                  onPress={() =>
                    navigate(
                      ROUTE_PATHS.APP.REPORTS.DETAILS.replace(":id", item._id),
                    )
                  }
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {reports?.length > 0 && renderPagination()}
    </div>
  );
};

export default ReportListPage;
