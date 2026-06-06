import { navigations } from "@/configs/data";
import useUserStore from "@/store/useUserStore";
import { UserTypes } from "@/types/enum";
import { Input, Kbd } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const SearchRoutes = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const filteredNavigations = useMemo(() => {
    const currentUserType =
      user?.userType === UserTypes.agent ? UserTypes.agent : UserTypes.admin;

    const routes = (navigations as any)[currentUserType] || [];

    const getFlattenedRoutes = (
      items: any[],
      parentIcon: any = null,
    ): any[] => {
      return items.reduce((acc: any[], item: any) => {
        const currentIcon = item.icon || parentIcon;
        if (item.href) {
          acc.push({ ...item, icon: currentIcon });
        }
        if (item.type === "collapse" && item.child) {
          acc.push(...getFlattenedRoutes(item.child, currentIcon));
        }
        return acc;
      }, []);
    };

    const allRoutes = routes.flatMap((section: any) =>
      getFlattenedRoutes(section.child || []),
    );

    if (!query.trim()) return allRoutes;

    return allRoutes.filter((nav: any) =>
      nav.title.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, user?.userType]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, isOpen]);

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[400px] hidden sm:block"
    >
      <Input
        fullWidth
        value={query}
        ref={inputRef}
        color="primary"
        variant="bordered"
        placeholder="Search..."
        onFocus={() => setIsOpen(true)}
        onChange={(ev) => {
          setQuery(ev.target.value);
          setIsOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev < filteredNavigations.length - 1 ? prev + 1 : prev,
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          } else if (e.key === "Enter") {
            if (selectedIndex >= 0) {
              const nav = filteredNavigations[selectedIndex];
              navigate(nav.href);
              setQuery("");
              setIsOpen(false);
            }
          } else if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
          }
        }}
        startContent={<IoSearch size={20} className="text-default-500" />}
        endContent={
          <div className="flex items-center gap-1">
            {isOpen ? (
              <Kbd keys={["escape"]}>ESC</Kbd>
            ) : (
              <Kbd keys={["command", "shift"]}>F</Kbd>
            )}
          </div>
        }
      />

      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute w-full mt-2 bg-content1 border border-divider rounded-medium shadow-lg z-50 max-h-[300px] overflow-y-auto"
        >
          {filteredNavigations.length > 0 ? (
            filteredNavigations.map((nav: any, index: number) => (
              <Link
                to={nav.href}
                key={nav.title}
                className={`flex items-center gap-2 p-3 cursor-pointer text-sm transition-colors ${
                  index === selectedIndex
                    ? "bg-default-200"
                    : "hover:bg-default-100"
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                }}
              >
                {nav.icon && (
                  <nav.icon className="text-default-400" size={18} />
                )}
                {nav.title}
              </Link>
            ))
          ) : (
            <div className="p-4 text-default-400 text-small text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchRoutes;
