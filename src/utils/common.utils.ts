import ROUTE_PATHS from "@/routes/route-paths";
import useUserStore from "@/store/useUserStore";
import {
  ActiveStatus,
  AgentRequestStatus,
  CompleteStatus,
  HelpSupportStatus,
} from "@/types/enum";

type FormatLocationParams = {
  city: string;
  state: string;
  country: string;
};

class CommonUtils {
  static logout() {
    localStorage.clear();
    useUserStore.getState().clearUser();
    window.location.replace(ROUTE_PATHS.AUTH.LOGIN);
  }

  static getStatusColor(status: string) {
    switch (status) {
      case ActiveStatus.active:
      case CompleteStatus.completed:
      case HelpSupportStatus.resolved:
      case AgentRequestStatus.accepted:
        return "success";

      case ActiveStatus.inactive:
      case CompleteStatus.pending:
      case AgentRequestStatus.pending:
        return "warning";

      case AgentRequestStatus.rejected:
        return "danger";
      default:
        return "default";
    }
  }

  static formatTitle(key: string) {
    if (!key) return "";
    return key
      ?.replace(/([A-Z])/g, " $1")
      ?.replace(/[_-]+/g, " ")
      ?.trim()
      ?.split(/\s+/)
      ?.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      ?.join(" ");
  }

  static formatLocation({ city, state, country }: FormatLocationParams) {
    return [city, state, country]
      ?.filter(Boolean)
      ?.map((el) => el.trim())
      ?.join(", ");
  }
}

export default CommonUtils;
