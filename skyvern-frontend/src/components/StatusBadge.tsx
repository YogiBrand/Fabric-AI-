import { Status } from "@/api/types";
import { Badge } from "./ui/badge";
import { cn } from "@/util/utils";

type Props = {
  status: Status;
};

function StatusBadge({ status }: Props) {
  const statusText = status === "timed_out" ? "timed out" : status;

  return (
    <Badge
      className={cn("flex h-7 w-24 justify-center font-medium", {
        "bg-success text-success-foreground hover:bg-success/90":
          status === Status.Completed,
        "bg-warning text-warning-foreground hover:bg-warning/90":
          status === Status.Terminated,
        "bg-muted text-muted-foreground hover:bg-muted/90":
          status === Status.Created,
        "bg-destructive text-destructive-foreground hover:bg-destructive/90":
          status === Status.Failed ||
          status === Status.Canceled ||
          status === Status.TimedOut,
        "bg-primary text-primary-foreground hover:bg-primary/90":
          status === Status.Running || status === Status.Queued,
      })}
    >
      {statusText}
    </Badge>
  );
}

export { StatusBadge };
