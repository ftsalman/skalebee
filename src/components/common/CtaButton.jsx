import { PillButton } from "./PillButton";

// Kept for older imports: every CTA now uses the shared pill button style.
// `variant` from the old API is accepted but no longer changes the look.
export const CtaButton = ({ to = "/contact", className, children, ...props }) => {
  const rest = { ...props };
  delete rest.variant;
  return (
    <PillButton to={to} className={className} {...rest}>
      {children}
    </PillButton>
  );
};
