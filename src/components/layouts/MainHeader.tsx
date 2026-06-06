import useUserStore from "@/store/useUserStore";
import CommonUtils from "@/utils/common.utils";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  IoLogOutOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoMenu,
} from "react-icons/io5";
import useSidebarStore from "@/store/useSidebarStore";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useSidebarDrawer } from "@/contexts/SidebarDrawerContext";
import { useState } from "react";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import SearchRoutes from "../lib/SearchRoutes";

const MainHeader = () => {
  const { user } = useUserStore();
  const { onOpen } = useSidebarDrawer();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const [logoutModal, setLogoutModal] = useState(false);

  const handleLogout = () => {
    CommonUtils.logout();
  };

  return (
    <div className="h-[60px] flex gap-2 items-center justify-between px-4 bg-white border-b">
      <div className="flex gap-1 items-center w-full">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="sm:block hidden"
          onPress={toggleSidebar}
        >
          {isCollapsed ? (
            <GoSidebarExpand size={18} className="text-gray-700" />
          ) : (
            <GoSidebarCollapse size={18} className="text-gray-700" />
          )}
        </Button>
        <Button
          isIconOnly
          variant="light"
          className="lg:hidden"
          onPress={onOpen}
        >
          <IoMenu size={20} />
        </Button>

        <SearchRoutes />
      </div>

      <div className="flex items-center gap-4">
        <Button isIconOnly size="sm" variant="bordered">
          <MdOutlineNotificationsActive size={17} className="text-gray-600" />
        </Button>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button className="flex items-center text-left gap-2 outline-none">
              <Avatar
                size="sm"
                isBordered
                color="primary"
                src="https://i.pravatar.cc/300?u=u8840"
              />

              <div className="hidden md:block">
                <p className="text-sm font-semibold">{user?.fullName}</p>
                <div className="text-xs text-default-500">{user?.email}</div>
              </div>
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem
              key="profile"
              startContent={<IoPersonOutline size={18} />}
            >
              My Profile
            </DropdownItem>
            <DropdownItem
              key="settings"
              startContent={<IoSettingsOutline size={18} />}
            >
              Settings
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              className="text-danger"
              startContent={<IoLogOutOutline size={18} />}
              onPress={() => setLogoutModal(true)}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {logoutModal && (
        <ConfirmationDialog
          isOpen={logoutModal}
          onClose={() => setLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};

export default MainHeader;
