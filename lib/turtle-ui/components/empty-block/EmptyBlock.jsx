import { Button } from "@turtle-ui/components";
import { cn } from "@turtle-ui/utils";

export const EmptyBlock = ({
  title = "We’re working on this",
  descp = "This resource is currently being prepared. In the meantime, explore other available resources.",
  showIcon = true,
  onBtnClick = undefined,
  btnLabel = "",
  containerClassName = "",
  imgClassName = "",
  headClassName = "",
  descpClassName = "",
  buttonClassName = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center max-w-[500px] text-center p-4",
        containerClassName
      )}
    >
      {showIcon && (
        <img
          src="/svgs/crane-illustration.svg"
          alt=""
          className={cn("shrink-0 w-[100px]", imgClassName)}
        />
      )}

      {title && (
        <h4
          className={cn(
            "mt-4 text-[16px] font-semibold text-gray-800",
            headClassName
          )}
        >
          {title}
        </h4>
      )}

      {descp && (
        <p className={cn("mt-1 text-sm text-gray-400", descpClassName)}>{descp}</p>
      )}

      {onBtnClick && (
        <Button
          onClick={onBtnClick}
          className={cn("mt-4", buttonClassName)}
          variant="secondary"
        >
          {btnLabel}
        </Button>
      )}
    </div>
  );
};
