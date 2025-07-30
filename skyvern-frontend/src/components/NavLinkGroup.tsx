import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/util/utils";
import { NavLink, useMatches } from "react-router-dom";
import { Badge } from "./ui/badge";

type Props = {
  title: string;
  links: Array<{
    label: string;
    to: string;
    newTab?: boolean;
    disabled?: boolean;
    beta?: boolean;
    icon?: React.ReactNode;
  }>;
};

function NavLinkGroup({ title, links }: Props) {
  const { collapsed } = useSidebarStore();
  const matches = useMatches();
  const groupIsActive = matches.some((match) => {
    const inputs = links.map((link) => link.to);
    return inputs.includes(match.pathname);
  });

  return (
    <div
      className={cn("flex flex-col", {
        "items-center": collapsed,
      })}
    >
      <div
        className={cn("mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", {
          "text-center": collapsed,
          "px-3": !collapsed,
        })}
      >
        {!collapsed && title}
      </div>
      <div className="space-y-1">
        {links.map((link) => {
          return (
            <NavLink
              key={link.to}
              to={link.to}
              target={link.newTab ? "_blank" : undefined}
              rel={link.newTab ? "noopener noreferrer" : undefined}
              className={({ isActive }) => {
                return cn(
                  "flex items-center rounded-lg px-3 py-2 text-foreground transition-all hover:bg-accent hover:text-accent-foreground",
                  {
                    "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary": isActive,
                    "justify-center": collapsed,
                  },
                );
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex-shrink-0",
                    collapsed && "mx-auto"
                  )}>
                    {link.icon}
                  </span>
                  {!collapsed && (
                    <span className="font-medium">{link.label}</span>
                  )}
                </div>
                {!collapsed && link.beta && (
                  <Badge
                    className="ml-2 bg-primary/10 text-primary hover:bg-primary/10"
                    variant="secondary"
                  >
                    Beta
                  </Badge>
                )}
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export { NavLinkGroup };
