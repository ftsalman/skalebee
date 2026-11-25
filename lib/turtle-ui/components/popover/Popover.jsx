import PropTypes from "prop-types";
import { Popover as PopoverPrimitives } from "@base-ui/react/popover";

import "./popover.css";

import { cn } from "@turtle-ui/utils";

export const Popover = ({
  trigger,
  children,
  triggerClassName = "",
  positionerClassName = "",
  popoverClassName = "",
  sideOffset = 8,
  align = "center",
  side = "bottom",
  ...props
}) => (
  <PopoverPrimitives.Root {...props}>
    <PopoverPrimitives.Trigger
      render={trigger}
      className={triggerClassName}
    />

    <PopoverPrimitives.Portal>
      <PopoverPrimitives.Positioner
        className={cn("tui-popover-positioner", positionerClassName)}
        sideOffset={sideOffset}
        align={align}
        side={side}
      >
        <PopoverPrimitives.Popup
          className={cn("tui-popover-popup", popoverClassName)}
        >
          {children}
        </PopoverPrimitives.Popup>
      </PopoverPrimitives.Positioner>
    </PopoverPrimitives.Portal>
  </PopoverPrimitives.Root>
);

Popover.Close = PopoverPrimitives.Close;

Popover.propTypes = {
  trigger: PropTypes.node.isRequired,
  children: PropTypes.node,
  triggerClassName: PropTypes.string,
  positionerClassName: PropTypes.string,
  popoverClassName: PropTypes.string,
  sideOffset: PropTypes.number,
  align: PropTypes.oneOf(["start", "center", "end"]),
  side: PropTypes.oneOf(["top", "right", "bottom", "left", "inline-end", "inline-start"]),
};
