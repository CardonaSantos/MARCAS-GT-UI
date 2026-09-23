import { cva } from "class-variance-authority";

export const appDropdownMenuContentVariants = cva(
  [
    "z-[120]",
    "min-w-[var(--app-dropdown-menu-min-width,12rem)]",
    "overflow-hidden",
    "border border-[hsl(var(--app-border))]",
    "bg-[hsl(var(--app-popover, var(--app-background)))]",
    "text-[hsl(var(--app-foreground))]",
    "shadow-lg",
    "backdrop-blur-sm",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-1",
    "data-[side=top]:slide-in-from-bottom-1",
    "data-[side=left]:slide-in-from-right-1",
    "data-[side=right]:slide-in-from-left-1",
  ],
  {
    variants: {
      size: {
        xs: "p-1 text-xs",
        sm: "p-1.5 text-xs",
        md: "p-2 text-sm",
      },
      radius: {
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },
      width: {
        auto: "min-w-[10rem]",
        sm: "min-w-[12rem]",
        md: "min-w-[15rem]",
        lg: "min-w-[18rem]",
      },
    },
    defaultVariants: {
      size: "xs",
      radius: "md",
      width: "sm",
    },
  },
);

export const appDropdownMenuItemVariants = cva(
  [
    "relative flex w-full select-none items-center gap-2",
    "rounded-[var(--app-radius-sm)] outline-none",
    "transition-colors",
    "cursor-pointer",
    "focus:bg-[hsl(var(--app-muted))]",
    "hover:bg-[hsl(var(--app-muted))]",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      size: {
        xs: "px-2 py-1.5 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
        sm: "px-2.5 py-2 text-xs [&_svg]:h-4 [&_svg]:w-4",
        md: "px-3 py-2 text-sm [&_svg]:h-4 [&_svg]:w-4",
      },
      tone: {
        default: "text-[hsl(var(--app-foreground))]",
        muted: "text-[hsl(var(--app-muted-foreground))]",
        primary:
          "text-[hsl(var(--app-primary))] focus:text-[hsl(var(--app-primary))]",
        success:
          "text-[hsl(var(--app-success))] focus:text-[hsl(var(--app-success))]",
        warning:
          "text-[hsl(var(--app-warning))] focus:text-[hsl(var(--app-warning))]",
        danger:
          "text-[hsl(var(--app-danger))] focus:text-[hsl(var(--app-danger))]",
      },
      inset: {
        true: "pl-7",
        false: "",
      },
    },
    defaultVariants: {
      size: "xs",
      tone: "default",
      inset: false,
    },
  },
);

export const appDropdownMenuLabelVariants = cva(
  "px-2 py-1.5 font-medium text-[hsl(var(--app-muted-foreground))]",
  {
    variants: {
      size: {
        xs: "text-[11px]",
        sm: "text-xs",
        md: "text-sm",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

export const appDropdownMenuSeparatorVariants = cva(
  "my-1 h-px bg-[hsl(var(--app-border))]",
);

export const appDropdownMenuShortcutVariants = cva(
  "ml-auto text-[10px] tracking-widest text-[hsl(var(--app-muted-foreground))]",
);
