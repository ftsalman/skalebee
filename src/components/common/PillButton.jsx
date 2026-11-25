import { Link } from "react-router-dom";
import { CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";

/**
 * The site-wide button: white pill with a yellow arrow pill on the left.
 * On hover the arrow pill slides to the right and the label slides left.
 * Styles live in App.css (.pill-btn).
 *
 *   <PillButton to="/#contact">Book a call</PillButton>          // router link
 *   <PillButton href="mailto:hi@x.com">Email us</PillButton>      // plain link
 *   <PillButton onClick={fn}>Send</PillButton>                    // <button>
 *   size="sm" for compact spots (navbar), block for full width.
 */
export const PillButton = ({ to, href, size = "md", block = false, className, children, ...props }) => {
  const classes = cn("pill-btn", size === "sm" && "pill-btn-sm", block && "pill-btn-block", className);
  const content = (
    <>
      <span className="pill-btn-icon" aria-hidden="true">
        <CaretRightIcon weight="bold" />
      </span>
      <span className="pill-btn-label">{children}</span>
    </>
  );

  if (to) return <Link to={to} className={classes} {...props}>{content}</Link>;
  if (href) return <a href={href} className={classes} {...props}>{content}</a>;
  return <button type="button" className={classes} {...props}>{content}</button>;
};
