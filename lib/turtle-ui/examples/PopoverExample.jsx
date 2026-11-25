import { Button, Popover } from "@turtle-ui/components";

export const PopoverExample = () => {
  return (
    <Popover trigger={<Button>Notifications</Button>}>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">Notifications</p>
        <p className="text-sm text-neutral-600">
          You are all caught up. Good job!
        </p>
      </div>
    </Popover>
  );
};
