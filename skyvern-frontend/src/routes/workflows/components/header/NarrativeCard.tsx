type Props = {
  index: number;
  description: string;
};

function NarrativeCard({ index, description }: Props) {
  return (
    <div className="flex h-32 w-52 flex-col gap-3 rounded-xl bg-card p-4 border border-border shadow-sm hover:shadow-md transition-all hover:border-primary/30 cursor-pointer">
      <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
        {index}
      </div>
      <div className="text-sm text-foreground leading-relaxed">{description}</div>
    </div>
  );
}

export { NarrativeCard };
