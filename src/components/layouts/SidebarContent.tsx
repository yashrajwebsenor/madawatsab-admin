import { useState, useEffect } from "react";
import useSidebarStore from "@/store/useSidebarStore";
import clsx from "clsx";
import CONFIG from "@/configs/config";
import { navigations } from "@/configs/data";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@heroui/react";
import useUserStore from "@/store/useUserStore";
import CommonUtils from "@/utils/common.utils";
import { UserTypes } from "@/types/enum";
import { FiChevronDown } from "react-icons/fi";
import usePermission from "@/hooks/usePermission";

const SidebarItem = ({
  nav,
  pathname,
  isCollapsed,
  onItemClick,
}: {
  nav: any;
  pathname: string;
  isCollapsed: boolean;
  onItemClick?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = nav.icon;
  const isCollapse = nav.type === "collapse";

  const hasActiveChild =
    isCollapse && nav.child?.some((child: any) => child.href === pathname);
  const isActive = nav.href === pathname || hasActiveChild;

  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  const itemContent = (
    <div
      className={clsx(
        "group relative flex items-center rounded-xl font-medium text-[14px] transition-all duration-300 overflow-hidden cursor-pointer",
        isCollapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
        isActive
          ? "text-white"
          : "hover:text-white text-gray-400 hover:bg-white/5",
      )}
      onClick={() => {
        if (isCollapse && !isCollapsed) {
          setIsOpen(!isOpen);
        } else if (!isCollapse) {
          onItemClick?.();
        }
      }}
    >
      {(isActive || (isCollapse && hasActiveChild)) && (
        <motion.div
          layoutId="active-nav"
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-transparent border-l-2 border-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <Icon
        size={20}
        className={clsx(
          "relative z-10 transition-colors shrink-0",
          isActive ? "text-blue-400" : "group-hover:text-blue-400",
        )}
      />
      {!isCollapsed && (
        <>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 whitespace-nowrap flex-1"
          >
            {nav.title}
          </motion.span>
          {isCollapse && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              className="relative z-10"
            >
              <FiChevronDown size={16} />
            </motion.div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      <Tooltip
        content={nav.title}
        placement="right"
        isDisabled={!isCollapsed}
        closeDelay={0}
        offset={15}
        className="font-medium"
      >
        {isCollapse ? (
          itemContent
        ) : (
          <Link to={nav.href} onClick={onItemClick}>
            {itemContent}
          </Link>
        )}
      </Tooltip>

      <AnimatePresence>
        {isCollapse && isOpen && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex flex-col gap-1 ml-4 mt-1 border-l border-white/5 pl-2"
          >
            {nav.child.map((child: any, idx: number) => {
              const isChildActive = child.href === pathname;
              return (
                <Link
                  key={idx}
                  to={child.href}
                  onClick={onItemClick}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-[13px] transition-all duration-200",
                    isChildActive
                      ? "text-blue-400 bg-blue-400/5 font-semibold"
                      : "text-gray-300 hover:text-gray-300 hover:bg-white/5",
                  )}
                >
                  {child.title}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const { user } = useUserStore();
  const { pathname } = useLocation();
  const { isCollapsed } = useSidebarStore();
  const { can } = usePermission();

  const currentUserType =
    user?.userType === UserTypes.agent ? UserTypes.agent : UserTypes.admin;
  const userNavigations = (navigations as any)[currentUserType] || [];

  // Gate each tab by its required permission. Sections with no visible
  // children are dropped entirely. Items without a `permission` are always
  // shown (e.g. agent tabs gated only by userType).
  const visibleNavigations = userNavigations
    .map((section: any) => ({
      ...section,
      child: (section.child || []).filter((nav: any) => can(nav.permission)),
    }))
    .filter((section: any) => section.child.length > 0);

  return (
    <aside className="bg-transparent w-full h-full flex flex-col text-gray-300">
      <div
        className={clsx(
          "h-[90px] px-4 flex items-center shrink-0 transition-all duration-300",
          isCollapsed ? "justify-center" : "px-8",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center relative shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <img src="/assets/images/logo.png" className="w-[25px]" />
            {!isCollapsed && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#05050f]" />
            )}
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h1 className="text-white font-bold tracking-widest text-lg leading-none uppercase">
                {CONFIG.APP_NAME}
              </h1>
              <p className="text-[10px] text-gray-500 tracking-[0.2em] mt-1 uppercase font-medium">
                {CommonUtils.formatTitle(user?.userType!)} Portal
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        {visibleNavigations.map((section: any, idx: number) => (
          <div key={idx} className="mb-5">
            {section.child?.length > 0 && (
              <h3
                className={clsx(
                  "px-4 text-[11px] font-bold tracking-[0.2em] text-gray-500 mb-1 uppercase transition-all duration-300",
                  isCollapsed
                    ? "opacity-0 h-0 mb-0 overflow-hidden"
                    : "opacity-100",
                )}
              >
                {section.section}
              </h3>
            )}

            <div className="grid gap-1">
              {section.child.map((nav: any, i: number) => (
                <SidebarItem
                  key={i}
                  nav={nav}
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  onItemClick={onItemClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/5 mt-auto">
        <div
          className={clsx(
            "bg-white/5 rounded-2xl flex items-center transition-all duration-300",
            isCollapsed ? "p-2 justify-center" : "p-3 gap-3",
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
            A
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-semibold text-white truncate">
                {user?.userType === UserTypes.agent ? "Agent" : "Admin"}
              </p>
              {user?.userType !== UserTypes.agent && (
                <p className="text-[10px] text-gray-500 truncate">
                  {user?.userType === UserTypes.super_admin
                    ? "Super Admin"
                    : CommonUtils.formatTitle(user?.roleId?.name!)}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarContent;
