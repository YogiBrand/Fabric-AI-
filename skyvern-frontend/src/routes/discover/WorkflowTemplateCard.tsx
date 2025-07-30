type Props = {
  title: string;
  image: string;
  onClick: () => void;
};

function WorkflowTemplateCard({ title, image, onClick }: Props) {
  return (
    <div className="h-48 w-56 cursor-pointer rounded-xl transition-all hover:shadow-lg" onClick={onClick}>
      <div className="h-28 rounded-t-xl bg-card border border-border px-6 pt-6">
        <img src={image} alt={title} className="h-full w-full object-contain" />
      </div>
      <div className="h-20 space-y-1 rounded-b-xl bg-muted/50 border border-t-0 border-border p-3">
        <h1
          className="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-foreground"
          title={title}
        >
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">Template</p>
      </div>
    </div>
  );
}

export { WorkflowTemplateCard };
