import { cn } from "@/util/utils";
import { NavLink, useSearchParams } from "react-router-dom";

type Option = {
  label: string;
  to: string;
};

type Props = {
  options: Option[];
};

function SwitchBarNavigation({ options }: Props) {
  const [searchParams] = useSearchParams();

  return (
    <div className="flex w-fit gap-2 rounded-sm border border-border p-2 bg-card">
      {options.map((option) => {
        return (
          <NavLink
            to={`${option.to}?${searchParams.toString()}`}
            replace
            key={option.to}
            className={({ isActive }) => {
              return cn(
                "cursor-pointer rounded-sm px-3 py-2 text-foreground transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
              );
            }}
          >
            {option.label}
          </NavLink>
        );
      })}
    </div>
  );
}

export { SwitchBarNavigation };
