import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 font-medium",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md",
        disabled:
          "bg-muted text-muted-foreground opacity-50 pointer-events-none cursor-not-allowed",
        outline:
          "border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all",
        tertiary:
          "bg-primary/10 text-primary hover:bg-primary/15 transition-all",
        ghost: "hover:bg-muted hover:text-foreground transition-all",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export { buttonVariants };
