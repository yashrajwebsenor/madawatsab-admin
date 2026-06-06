import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import DashboardStatsCard from "@/components/dashboard/DashboardStatsCard";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineUsers } from "react-icons/hi";
import {
  MdOutlineRealEstateAgent,
  MdOutlineSubscriptions,
} from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";

type DashboardStats = {
  totalUsers: number;
  activeUsersToday: number;
  totalAgents: number;
  totalConversions: number;
};

const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res: any = await http.get(ENDPOINTS.DASHBOARD.STATS);
      return res?.data as DashboardStats;
    },
  });

  const display = (value?: number) =>
    isLoading || value == null ? "—" : value.toLocaleString();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatsCard
          title="Total Users"
          value={display(stats?.totalUsers)}
          icon={TbUsersGroup}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />
        <DashboardStatsCard
          title="Active Users (Today)"
          value={display(stats?.activeUsersToday)}
          icon={HiOutlineUsers}
          iconColor="text-success"
          iconBg="bg-success/10"
        />
        <DashboardStatsCard
          title="Total Agents"
          value={display(stats?.totalAgents)}
          icon={MdOutlineRealEstateAgent}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
        <DashboardStatsCard
          title="Total Conversion"
          value={display(stats?.totalConversions)}
          icon={MdOutlineSubscriptions}
          iconColor="text-secondary"
          iconBg="bg-secondary/10"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
