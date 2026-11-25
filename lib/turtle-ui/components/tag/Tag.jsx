import PropTypes from "prop-types";

// Utils

import { tagVariants } from "./tagVariants";

// Styles

import "./tag.css";

export const Tag = ({
  variant = "gray",
  size = "md",
  className = "",
  children = null,
  showDot = true,
  ...props
}) => (
  <div {...props} className={tagVariants({ size, variant, className })}>

    {showDot && (
      <div className="shrink-0 size-[6px] rounded-full tui-tag-dot"></div>
    )}

    {children}
  </div>
);

Tag.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  showDot: PropTypes.bool,
};
