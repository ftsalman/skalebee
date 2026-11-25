import PropTypes from "prop-types";
import { Tooltip as TooltipPrimitives } from "@base-ui/react";

import "./tooltip.css";

export const Tooltip = ({ children, label }) => {
  const ariaLabel = typeof label === "string" ? label : undefined;

  return (
    <TooltipPrimitives.Provider>
      <TooltipPrimitives.Root>
        <TooltipPrimitives.Trigger aria-label={ariaLabel} render={children} />
        <TooltipPrimitives.Portal>
          <TooltipPrimitives.Positioner sideOffset={11} className="z-50">
            <TooltipPrimitives.Popup className="tui-tooltip-popup">
              <TooltipPrimitives.Arrow className="tui-tooltip-arrow" />
              {label}
            </TooltipPrimitives.Popup>
          </TooltipPrimitives.Positioner>
        </TooltipPrimitives.Portal>
      </TooltipPrimitives.Root>
    </TooltipPrimitives.Provider>
  );
};

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  label: PropTypes.node.isRequired,
};

// 📚 Example:

// import { Button, Tooltip } from "@turtle-ui/components";

// export const ToolTipExample = () => {
//   return (
//     <Tooltip label="Bold">
//       <Button>Hover Me</Button>
//     </Tooltip>
//   );
// };
