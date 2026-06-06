import useSidebarStore from "@/store/useSidebarStore";
import SidebarContent from "./SidebarContent";

const MainSidebar = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <aside
      className={`hidden lg:block bg-[#05050f] h-full border-r border-white/5 transition-all duration-300 ease-in-out ${
        isCollapsed ? "min-w-[70px] w-[70px]" : "min-w-[270px] w-[270px]"
      }`}
    >
      <SidebarContent />
    </aside>
  );
};

export default MainSidebar;
