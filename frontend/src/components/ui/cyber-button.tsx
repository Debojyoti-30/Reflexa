import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cyberButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-semibold text-sm uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(186_100%_50%/0.6)] active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:shadow-[0_0_30px_hsl(270_91%_65%/0.6)] active:scale-95",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(186_100%_50%/0.4)]",
        ghost: "text-foreground hover:bg-muted hover:text-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:shadow-[0_0_30px_hsl(0_84%_60%/0.6)]",
        glow: "bg-gradient-cyber text-primary-foreground hover:animate-pulse-glow",
        game: "bg-neon-green text-primary-foreground font-bold text-lg hover:shadow-[0_0_40px_hsl(142_76%_52%/0.8)] active:scale-95",
      },
      size: {
        default: "h-12 px-6 py-3 rounded-lg",
        sm: "h-9 px-4 py-2 rounded-md text-xs",
        lg: "h-14 px-8 py-4 rounded-xl text-base",
        xl: "h-16 px-10 py-5 rounded-xl text-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cyberButtonVariants> {
  asChild?: boolean;
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(cyberButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
CyberButton.displayName = "CyberButton";

export { CyberButton, cyberButtonVariants };
