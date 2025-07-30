import { Handle, NodeProps, Position, useEdges } from "@xyflow/react";
import type { NodeAdderNode } from "./types";
import { PlusIcon } from "@radix-ui/react-icons";
import { useWorkflowPanelStore } from "@/store/WorkflowPanelStore";
import { Button } from "@/components/ui/button";

function NodeAdderNode({ id, parentId }: NodeProps<NodeAdderNode>) {
  const edges = useEdges();
  const setWorkflowPanelState = useWorkflowPanelStore(
    (state) => state.setWorkflowPanelState,
  );

  return (
    <div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="opacity-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        className="opacity-0"
      />
      <Button
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={() => {
          const previous = edges.find((edge) => edge.target === id)?.source;
          setWorkflowPanelState({
            active: true,
            content: "nodeLibrary",
            data: {
              previous: previous ?? null,
              next: id,
              parent: parentId,
              connectingEdgeType: "default",
            },
          });
        }}
      >
        <PlusIcon className="h-6 w-6" />
      </Button>
    </div>
  );
}

export { NodeAdderNode };
