import { cva } from "class-variance-authority";

export const buttonVariants = cva("tui-btn", {
  variants: {
    variant: {
      default: "tui-btn-primary",
      primary: "tui-btn-primary",
      secondary: "tui-btn-secondary",
      "secondary-2": "tui-btn-secondary-2",
      tertiary: "tui-btn-tertiary",
      success: "tui-btn-success",
      danger: "tui-btn-danger",
    },
    size: {
      default: "tui-btn-md",
      xs: "tui-btn-xs",
      base: "tui-btn-base",
      sm: "tui-btn-sm",
      md: "tui-btn-md",
      lg: "tui-btn-lg",
      xl: "tui-btn-xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
