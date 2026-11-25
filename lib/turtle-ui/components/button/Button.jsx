import PropTypes from "prop-types";
import { Button as ButtonPrimitives } from "@base-ui/react/button";

// Utils 

import { buttonVariants } from "./buttonVariants";
  
// Styles

import "./button.css";

export const Button = ({
  size = "default", 
  variant = "default",
  className = "",
  children = null,
  onClick = undefined,
  ref = null, 
  ...props
}) => (
  <ButtonPrimitives 
    ref={ref}
    className={buttonVariants({ size, variant, className })}
    onClick={onClick}
    type="button"
    role="button"
    {...props}
  >
    {children}
  </ButtonPrimitives>
);

Button.propTypes = {
  size: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  ref: PropTypes.any,
};
