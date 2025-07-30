import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { ObserverThought } from "../types/workflowRunTypes";
import { cn } from "@/util/utils";
import { BrainIcon } from "@/components/icons/BrainIcon";
import { useCallback } from "react";

type Props = {
  active: boolean;
  thought: ObserverThought;
  onClick: (thought: ObserverThought) => void;
};

function ThoughtCard({ thought, onClick, active }: Props) {
  const refCallback = useCallback((element: HTMLDivElement | null) => {
    if (element && active) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    // this should only run once at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        "space-y-3 rounded-md border border-border bg-card p-4 shadow-sm hover:shadow-md transition-all cursor-pointer",
        {
          "border-primary shadow-md": active,
        },
      )}
      onClick={() => {
        onClick(thought);
      }}
      ref={refCallback}
    >
      <div className="flex justify-between">
        <div className="flex gap-3">
          <BrainIcon className="size-6" />
          <span>Thought</span>
        </div>
        <div className="flex items-center gap-1 rounded-sm bg-muted px-2 py-1">
          <QuestionMarkIcon className="size-4" />
          <span className="text-xs">Decision</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        {thought.answer || thought.thought}
      </div>
    </div>
  );
}

export { ThoughtCard };
