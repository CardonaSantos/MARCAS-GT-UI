import { cva } from "class-variance-authority";

export const appDataTableShellVariants = cva(
  [
    "w-full",
    "min-w-0",
    "[font-family:var(--app-font-sans)]",
    "text-[hsl(var(--app-table-foreground))]",
  ],
  {
    variants: {
      variant: {
        plain: "bg-transparent",
        card: [
          "overflow-hidden",
          "border",
          "bg-[hsl(var(--app-table-bg))]",
          "border-[hsl(var(--app-table-border))]",
          "shadow-[var(--app-table-shadow)]",
        ],
        bordered: [
          "overflow-hidden",
          "border",
          "bg-transparent",
          "border-[hsl(var(--app-table-border))]",
        ],
      },
      radius: {
        none: "rounded-none",
        xs: "rounded-[var(--app-radius-xs)]",
        sm: "rounded-[var(--app-radius-sm)]",
        md: "rounded-[var(--app-radius-md)]",
        lg: "rounded-[var(--app-radius-lg)]",
      },
    },
    defaultVariants: {
      variant: "card",
      radius: "md",
    },
  },
);

export const appDataTableScrollVariants = cva([
  "relative",
  "w-full",
  "min-w-0",
  "overflow-auto",
  "overscroll-contain",
]);

export const appDataTableHeaderRowVariants = cva(
  [
    "grid",
    "min-w-full",
    "border-b",
    "border-[hsl(var(--app-table-border))]",
    "bg-[hsl(var(--app-table-header-bg))]",
    "text-[hsl(var(--app-table-header-foreground))]",
  ],
  {
    variants: {
      density: {
        xs: "min-h-[var(--app-table-header-height-xs)] text-[length:var(--app-table-font-xs)]",
        sm: "min-h-[var(--app-table-header-height-sm)] text-[length:var(--app-table-font-sm)]",
        md: "min-h-[var(--app-table-header-height-md)] text-[length:var(--app-table-font-md)]",
      },
      sticky: {
        true: "sticky top-0 z-20",
        false: "",
      },
    },
    defaultVariants: {
      density: "xs",
      sticky: true,
    },
  },
);

export const appDataTableRowVariants = cva(
  [
    "group/app-table-row",
    "grid",
    "min-w-full",
    "border-b",
    "border-[hsl(var(--app-table-border))]",
    "bg-[hsl(var(--app-table-row-bg))]",
    "text-[hsl(var(--app-table-foreground))]",
    "transition-colors",
    "duration-[var(--app-motion-duration-fast)]",
    "ease-[var(--app-motion-ease-standard)]",

    "[--app-table-cell-fg:var(--app-table-foreground)]",
    "[--app-table-cell-muted-fg:var(--app-muted-foreground)]",
    "[--app-table-cell-link-fg:var(--app-primary)]",

    "data-[state=selected]:!bg-[hsl(var(--app-table-row-selected-bg))]",
    "data-[state=selected]:!text-[hsl(var(--app-table-row-selected-foreground))]",
    "data-[state=selected]:[--app-table-cell-fg:var(--app-table-row-selected-foreground)]",
    "data-[state=selected]:[--app-table-cell-muted-fg:var(--app-table-row-selected-muted,var(--app-table-row-selected-foreground))]",
    "data-[state=selected]:[--app-table-cell-link-fg:var(--app-table-row-selected-link,var(--app-table-row-selected-foreground))]",
    "data-[state=selected]:[--app-table-pinned-bg:var(--app-table-row-selected-bg)]",
  ],
  {
    variants: {
      density: {
        xs: "min-h-[var(--app-table-row-height-xs)] text-[length:var(--app-table-font-xs)]",
        sm: "min-h-[var(--app-table-row-height-sm)] text-[length:var(--app-table-font-sm)]",
        md: "min-h-[var(--app-table-row-height-md)] text-[length:var(--app-table-font-md)]",
      },
      hoverable: {
        true: "hover:bg-[hsl(var(--app-table-row-hover-bg))]",
        false: "",
      },
      selected: {
        true: "",
        false: "",
      },
      clickable: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      density: "xs",
      hoverable: true,
      selected: false,
      clickable: false,
    },
  },
);

export const appDataTableCellVariants = cva(
  [
    "flex",
    "min-w-0",
    "items-center",
    "border-r",
    "border-[hsl(var(--app-table-border))]",
    "last:border-r-0",
  ],
  {
    variants: {
      density: {
        xs: "px-[var(--app-table-cell-px-xs)] py-[var(--app-table-cell-py-xs)]",
        sm: "px-[var(--app-table-cell-px-sm)] py-[var(--app-table-cell-py-sm)]",
        md: "px-[var(--app-table-cell-px-md)] py-[var(--app-table-cell-py-md)]",
      },
      align: {
        left: "justify-start text-left",
        center: "justify-center text-center",
        right: "justify-end text-right",
      },
      truncate: {
        true: "[&>*]:min-w-0 [&>*]:truncate",
        false: "",
      },
      pinned: {
        false: "",
        left: [
          "sticky z-10",
          "bg-[hsl(var(--app-table-pinned-bg))]",
          "shadow-[var(--app-table-pinned-shadow-left)]",
        ],
        right: [
          "sticky z-10",
          "bg-[hsl(var(--app-table-pinned-bg))]",
          "shadow-[var(--app-table-pinned-shadow-right)]",
        ],
      },
      header: {
        true: "font-medium uppercase tracking-[0.02em]",
        false: "",
      },
    },
    defaultVariants: {
      density: "xs",
      align: "left",
      truncate: true,
      pinned: false,
      header: false,
    },
  },
);

export const appDataTableToolbarVariants = cva([
  "flex",
  "w-full",
  "min-w-0",
  "flex-col",
  "gap-[var(--app-table-toolbar-gap)]",
  "border-b",
  "border-[hsl(var(--app-table-border))]",
  "p-2",
  "sm:flex-row",
  "sm:items-center",
  "sm:justify-between",
]);

export const appDataTableFooterVariants = cva([
  "flex",
  "w-full",
  "min-w-0",
  "flex-col",
  "gap-[var(--app-table-pagination-gap)]",
  "border-t",
  "border-[hsl(var(--app-table-border))]",
  "p-2",
  "sm:flex-row",
  "sm:items-center",
  "sm:justify-between",
]);

export const appTableMenuContentVariants = cva([
  "z-50",
  "min-w-44",
  "rounded-[var(--app-radius-md)]",
  "border",
  "border-[hsl(var(--app-table-menu-border))]",
  "bg-[hsl(var(--app-table-menu-bg))]",
  "p-1",
  "text-[hsl(var(--app-table-menu-foreground))]",
  "shadow-lg",
  "animate-[app-scale-in_var(--app-motion-duration-fast)_var(--app-motion-ease-out)]",
]);

export const appTableMenuItemVariants = cva(
  [
    "flex",
    "w-full",
    "cursor-pointer",
    "select-none",
    "items-center",
    "gap-2",
    "rounded-[var(--app-radius-sm)]",
    "px-2",
    "py-1.5",
    "text-xs",
    "outline-none",
    "transition-colors",
    "hover:bg-[hsl(var(--app-table-menu-hover-bg))]",
    "focus:bg-[hsl(var(--app-table-menu-hover-bg))]",
    "data-[disabled]:pointer-events-none",
    "data-[disabled]:opacity-50",
  ],
  {
    variants: {
      tone: {
        default: "",
        danger: "text-[hsl(var(--app-danger))]",
        warning: "text-[hsl(var(--app-warning))]",
        success: "text-[hsl(var(--app-success))]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export const appTableBulkActionsVariants = cva([
  "flex",
  "w-full",
  "min-w-0",
  "flex-col",
  "gap-2",
  "border-b",
  "border-[hsl(var(--app-table-bulk-border))]",
  "bg-[hsl(var(--app-table-bulk-bg))]",
  "px-2",
  "py-2",
  "text-xs",
  "text-[hsl(var(--app-table-bulk-foreground))]",
  "sm:flex-row",
  "sm:items-center",
  "sm:justify-between",
]);

export const appTableMobileCardsVariants = cva([
  "grid",
  "gap-2",
  "p-2",
  "md:hidden",
]);

export const appTableMobileCardVariants = cva([
  "rounded-[var(--app-radius-md)]",
  "border",
  "border-[hsl(var(--app-table-card-row-border))]",
  "bg-[hsl(var(--app-table-card-row-bg))]",
  "p-3",
]);
