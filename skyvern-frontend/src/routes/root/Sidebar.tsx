import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/util/utils";
import { SidebarContent } from "./SidebarContent";

function Sidebar() {
  const collapsed = useSidebarStore((state) => state.collapsed);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-card/95 backdrop-blur-sm border-r border-border/50 transition-all duration-300 lg:block hidden z-40 shadow-xl",
        collapsed ? "w-18" : "w-60"
      )}
    >
      <div className="h-full flex flex-col">
        <SidebarContent useCollapsedState />
      </div>
    </aside>
  );
}

export { Sidebar };
