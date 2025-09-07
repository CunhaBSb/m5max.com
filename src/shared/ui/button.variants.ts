import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        "outline-fire":
          "border-2 border-fire-orange/50 text-white bg-transparent hover:border-fire-orange hover:bg-fire-orange/15 hover:text-white shadow-lg hover:shadow-fire-orange/20 transition-all duration-300",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // M5 Max themed variants
        fire: "gradient-fire text-white shadow-fire hover:scale-105 transition-bounce font-semibold",
        tech: "gradient-tech text-white shadow-tech hover:shadow-lg transition-smooth",
        hero: "bg-fire-orange text-white shadow-fire hover:bg-fire-red hover:shadow-lg hover:scale-105 transition-bounce font-bold",
        whatsapp: "bg-green-500 text-white hover:bg-green-600 shadow-elegant transition-smooth",
        cta: "bg-fire-red text-white shadow-fire hover:bg-fire-orange hover:scale-105 transition-bounce font-semibold"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
