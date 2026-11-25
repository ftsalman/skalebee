import { cn } from "@turtle-ui/utils";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/constants/constants";
import { hoverTo } from "@/hooks/useHoverMotion";

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
    <footer
      className={cn(
        // z-2: above the "Let's build yours" field that tucks under its corners
        "relative z-[2] bg-white px-[clamp(22px,4vw,80px)] text-[#6c6a80]",
        rounded && "rounded-b-[clamp(28px,3vw,48px)]",
      )}
    >
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-x-8 gap-y-3.5 border-t border-[#e3e2ea] pt-[30px] pb-[clamp(26px,2.4vw,34px)] max-sm:flex-col max-sm:items-start">
        <p className="m-0 flex flex-wrap gap-2.5 text-[17px] max-sm:text-[15px]">
          <span>Designed &amp; built by Skalebee</span>
          <span aria-hidden="true">·</span>
          <span>© {new Date().getFullYear()}</span>
        </p>
        <nav aria-label="Social and contact links">
          <ul className="m-0 flex list-none flex-wrap gap-x-[22px] gap-y-2 p-0 text-[17px] max-sm:text-[15px]">
            {links.map(({ label, href, external }) => (
              <li key={label}>
                {hasUrl(href) ? (
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    data-hover=""
                    {...hoverTo({ color: "#17171b", duration: 0.2 })}
                    className="relative inline-block rounded py-1 text-[#6c6a80] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-bee-yellow"
                  >
                    {label}
                    {/* Yellow underline that grows from the left on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-0.5 w-0 rounded-sm bg-bee-yellow"
                      {...hoverTo({ width: "100%", duration: 0.3, ease: "power3.out" })}
                    />
                  </a>
                ) : (
                  <span className="inline-block py-1 text-[#6c6a80]">{label}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};
