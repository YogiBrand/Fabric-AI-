import { Logo } from "@/components/Logo";
import { LogoMinimized } from "@/components/LogoMinimized";
import { useSidebarStore } from "@/store/SidebarStore";
import { Link } from "react-router-dom";
import { SideNav } from "./SideNav";
import { cn } from "@/util/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  useCollapsedState?: boolean;
};

function SidebarContent({ useCollapsedState }: Props) {
  const { collapsed: collapsedState, setCollapsed } = useSidebarStore();
  const collapsed = useCollapsedState ? collapsedState : false;

  return (
    <div className="flex h-full flex-col px-4">
      <Link to={window.location.origin}>
        <div className="flex h-20 items-center justify-center border-b border-border">
          {collapsed ? <LogoMinimized /> : <Logo />}
        </div>
      </Link>
      <div className="flex-1 py-6">
        <SideNav />
      </div>
      <div className="border-t border-border py-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setCollapsed(!collapsed);
          }}
          className={cn(
            "w-full justify-center hover:bg-accent transition-colors",
            collapsed && "p-0"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

export { SidebarContent };
