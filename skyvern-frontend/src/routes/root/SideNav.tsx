import { NavLinkGroup } from "@/components/NavLinkGroup";
import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/util/utils";
import {
  Compass,
  History,
  Settings,
  Users,
  Zap,
} from "lucide-react";

function SideNav() {
  const { collapsed } = useSidebarStore();

  return (
    <nav
      className={cn("space-y-6", {
        "items-center": collapsed,
      })}
    >
      <NavLinkGroup
        title="Build"
        links={[
          {
            label: "Discover",
            to: "/discover",
            icon: <Compass className="h-5 w-5" />,
          },
          {
            label: "Workflows",
            to: "/workflows",
            icon: <Zap className="h-5 w-5" />,
          },
          {
            label: "History",
            to: "/history",
            icon: <History className="h-5 w-5" />,
          },
          {
            label: "CRM",
            to: "/crm",
            icon: <Users className="h-5 w-5" />,
          },
        ]}
      />
      <NavLinkGroup
        title={"General"}
        links={[
          {
            label: "Settings",
            to: "/settings",
            icon: <Settings className="h-5 w-5" />,
          },
        ]}
      />
    </nav>
  );
}

export { SideNav };
