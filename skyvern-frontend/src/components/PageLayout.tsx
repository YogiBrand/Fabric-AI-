import { Outlet } from "react-router-dom";
import { cn } from "@/util/utils";

type Props = {
  className?: string;
};

function PageLayout({ className }: Props = {}) {
  return (
    <div className={cn("h-full overflow-hidden flex flex-col", className)}>
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export { PageLayout };
