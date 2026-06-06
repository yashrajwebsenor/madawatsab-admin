import React, { createContext, useContext, useMemo, useState } from "react";

interface SidebarDrawerContextType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}

const SidebarDrawerContext = createContext<
  SidebarDrawerContextType | undefined
>(undefined);

export const SidebarDrawerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onOpenChange = (open: boolean) => setIsOpen(open);

  const value = useMemo(
    () => ({
      isOpen,
      onOpen,
      onClose,
      onOpenChange,
    }),
    [isOpen],
  );

  return (
    <SidebarDrawerContext.Provider value={value}>
      {children}
    </SidebarDrawerContext.Provider>
  );
};

export const useSidebarDrawer = () => {
  const context = useContext(SidebarDrawerContext);
  if (context === undefined) {
    throw new Error(
      "useSidebarDrawer must be used within a SidebarDrawerProvider",
    );
  }
  return context;
};
