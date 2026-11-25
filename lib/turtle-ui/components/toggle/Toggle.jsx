import { Switch } from "@base-ui/react";
import PropTypes from "prop-types";

import "./toggle.css";
import { cn } from "@turtle-ui/utils";

export const Toggle = ({
  defaultChecked = false,
  isChecked = false,
  onCheckChange = () => {},
  className = "",
  thumbClassName = "",
}) => (
  <Switch.Root
    defaultChecked={defaultChecked}
    checked={isChecked}
    onCheckedChange={onCheckChange}
    className={cn("tui-toggle", className)}
  >
    <Switch.Thumb className={cn("tui-toggle-thumb", thumbClassName)} />
  </Switch.Root>
);

Toggle.propTypes = {
  defaultChecked: PropTypes.bool,
  isChecked: PropTypes.bool,
  onCheckChange: PropTypes.func,
  className: PropTypes.string,
  thumbClassName: PropTypes.string,
};

// 📚 Example:

// import { Toggle } from "@turtle-ui/components";
// import { useState } from "react";

// export const ToggleExample = () => {
//   const [isChecked, setIsChecked] = useState(false);

//   return (
//     <label className="flex items-center gap-2 text-sm font-normal text-neutral-950">
//       <Toggle isChecked={isChecked} onCheckChange={setIsChecked} />
//       Notifications
//     </label>
//   );
// };
