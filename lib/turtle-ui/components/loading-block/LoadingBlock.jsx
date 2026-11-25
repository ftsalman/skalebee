import { cn } from "@turtle-ui/utils";

export const LoadingBlock = ({
  message = "Loading...",
  containerClassName = "",
  spanClass = ""
}) => {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-32 flex-col items-center justify-center gap-2 text-sm text-body",
        containerClassName,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-4 rounded-full border-2 border-gray-200 border-t-gray-600 motion-safe:animate-spin", spanClass)}
      />
      {message}
    </div>
  );
};
