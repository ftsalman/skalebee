import { CONTACT_INFO, SOCIAL_LINKS } from "@/constants/constants";
import "./footer.css";

// A real link only when there is a URL; "#" placeholders show as plain text (no dead links).
const hasUrl = (href) => href && href !== "#";

/**
 * Minimal footer: a divider, then "built by" + year on the left and links on the right.
 *   rounded: round the bottom corners so the dark "Let's build yours" field that follows on the
 *            home page shows behind them.
 */
export const Footer = ({ rounded = false }) => {
  const links = [
    ...SOCIAL_LINKS.map((s) => ({ label: s.name, href: s.href, external: true })),
    { label: "Email", href: `mailto:${CONTACT_INFO.email}` },
  ];
  return (
    <footer className={`site-footer${rounded ? " is-rounded" : ""}`}>
      <div className="site-footer-inner">
        <p className="site-footer-credit">
          <span>Designed &amp; built by Skalebee</span>
          <span aria-hidden="true">·</span>
          <span>© {new Date().getFullYear()}</span>
        </p>
        <nav aria-label="Social and contact links">
          <ul className="site-footer-links">
            {links.map(({ label, href, external }) => (
              <li key={label}>
                {hasUrl(href) ? (
                  <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {label}
                  </a>
                ) : (
                  <span>{label}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};
