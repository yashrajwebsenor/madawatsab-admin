import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import ListHeading from "@/components/lib/ListHeading";
import LoadingProgress from "@/components/lib/LoadingProgress";
import usePagination from "@/hooks/usePagination";
import ROUTE_PATHS from "@/routes/route-paths";
import { PendingPhotoUser } from "@/types/types";
import {
  Avatar,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const PhotoReviewListPage = () => {
  const navigate = useNavigate();
  const { page, setTotalPages, renderPagination } = usePagination();

  const {
    data: users = [],
    isLoading,
  } = useQuery({
    queryKey: ["photo-review-users", page],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.PHOTO_REVIEWS.PENDING_USERS, {
        params: { page, limit: 10 },
      });
      setTotalPages(res?.pagination?.totalPages);
      return (res?.data || []) as PendingPhotoUser[];
    },
  });

  return (
    <div>
      <ListHeading
        title="Photo Reviews"
        description="Users with gallery photos awaiting review. Open a user to approve or reject their photos."
      />

      <Table shadow="none" className="mt-3">
        <TableHeader>
          <TableColumn>User</TableColumn>
          <TableColumn>Mobile</TableColumn>
          <TableColumn>Pending</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={"No photos pending review."}
          loadingContent={<LoadingProgress />}
        >
          {users?.map((item) => (
            <TableRow key={item.userId}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    color="primary"
                    name={item?.fullName || undefined}
                    src={item?.profilePhoto?.url}
                  />
                  <p className="font-medium text-sm">
                    {item?.fullName || "Unknown"}
                  </p>
                </div>
              </TableCell>
              <TableCell>{item?.mobile || "-"}</TableCell>
              <TableCell>
                <Chip size="sm" color="warning" variant="flat">
                  {item.pendingCount} pending
                </Chip>
              </TableCell>
              <TableCell className="flex items-center justify-end gap-3">
                <Button
                  color="primary"
                  size="sm"
                  variant="flat"
                  endContent={<FiArrowRight />}
                  onPress={() =>
                    navigate(
                      ROUTE_PATHS.APP.PHOTO_REVIEWS.DETAILS.replace(
                        ":userId",
                        item.userId,
                      ),
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

      {users?.length > 0 && renderPagination()}
    </div>
  );
};

export default PhotoReviewListPage;
