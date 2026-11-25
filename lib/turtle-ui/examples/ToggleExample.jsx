import { Toggle } from "@turtle-ui/components";
import { useState } from "react";

export const ToggleExample = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <label className="flex items-center gap-2 text-sm font-normal text-neutral-950">
      <Toggle isChecked={isChecked} onCheckChange={setIsChecked} />
      Notifications
    </label>
  );
};
