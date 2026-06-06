import { Drawer, DrawerContent } from "@heroui/react";
import { useSidebarDrawer } from "@/contexts/SidebarDrawerContext";
import SidebarContent from "../layouts/SidebarContent";

const SidebarDrawer = () => {
  const { isOpen, onOpenChange, onClose } = useSidebarDrawer();

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="left"
      size="xs"
      hideCloseButton
      classNames={{
        base: "max-w-[280px]",
      }}
    >
      <DrawerContent>
        {() => <SidebarContent onItemClick={onClose} />}
      </DrawerContent>
    </Drawer>
  );
};

export default SidebarDrawer;
