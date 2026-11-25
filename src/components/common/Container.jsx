import { cn } from "@turtle-ui/utils";

// Centers content with the same side padding as the navbar
export const Container = ({ className, children, ...props }) => (
  <div
    className={cn(
      "mx-auto w-full max-w-[1640px] px-5 sm:px-8 lg:px-10 2xl:px-[134px]",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
