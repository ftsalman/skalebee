import { Fragment, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  CaretDownIcon,
  HandbagSimpleIcon,
  ListIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { Drawer } from "@turtle-ui/components";
import { cn } from "@turtle-ui/utils";
import { NAV_LINKS, ROUTES } from "@/constants/constants";

const ACTIVE_COLOR = "text-[#FFD400]";

const linkClass = ({ isActive }) =>
  cn(
    "text-[17px] font-medium uppercase tracking-tight transition-colors",
    isActive ? ACTIVE_COLOR : "text-white hover:text-[#FFD400]",
  );

/* ---------- Logo ---------- */
// Light (white text) version of /public/svgs/logo-horizontal.svg for the dark navbar
const Logo = () => (
  <Link to={ROUTES.HOME} className="flex shrink-0 items-center">
    <img
      src="/svgs/logo-horizontal-light.svg"
      alt="Skalebee"
      width="494"
      height="100"
      className="h-9 w-auto sm:h-10 lg:h-12"
    />
  </Link>
);

/* ---------- Dropdown (desktop) ---------- */
const DropdownItem = ({ item }) => {
  const { pathname } = useLocation();
  const isActive = item.children.some((c) => c.to === pathname);

  return (
    <div className="group relative">
      <button
        type="button"
        className={cn(
          "flex items-center gap-1.5 text-[17px] font-medium uppercase tracking-tight transition-colors",
          isActive ? ACTIVE_COLOR : "text-white hover:text-[#FFD400]",
        )}
        aria-haspopup="true"
      >
        {item.label}
        <CaretDownIcon
          size={16}
          weight="bold"
          className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
        />
      </button>

      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-5 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul className="min-w-52 overflow-hidden rounded-2xl bg-white p-2 shadow-overlay">
          {item.children.map((child) => (
            <li key={child.to}>
              <NavLink
                to={child.to}
                className={({ isActive: childActive }) =>
                  cn(
                    "block rounded-xl px-4 py-2.5 text-[15px] font-medium transition-colors",
                    childActive
                      ? "bg-[#FFD400] text-black"
                      : "text-headings hover:bg-gray-100",
                  )
                }
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ---------- Cart ---------- */
const CartButton = ({ count, className, badgeClassName }) => (
  <Link
    to="/cart"
    aria-label={`Cart, ${count} items`}
    className={cn("relative inline-flex text-black", className)}
  >
    <HandbagSimpleIcon size={30} weight="bold" />
    <span
      className={cn(
        "absolute -right-2.5 -top-2.5 flex size-6 items-center justify-center rounded-full bg-black text-[13px] font-bold text-white ring-2 ring-white/70",
        badgeClassName,
      )}
    >
      {count}
    </span>
  </Link>
);

/* ---------- Book a call ---------- */
const BookCallButton = ({ className, onClick }) => (
  <Link
    to={ROUTES.CONTACT}
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center gap-2.5 rounded-full bg-linear-to-b from-[#3D3D3D] to-[#0F0F0F] px-7 py-4 text-[17px] font-bold uppercase tracking-tight text-white shadow-[0_6px_14px_rgba(0,0,0,0.3)] hover:text-[#FFD400] transition-transform hover:-translate-y-0.5",
      className,
    )}
  >
    <PhoneIcon size={18} weight="bold" className="text-[#FFD400]" />
    Book a Call
  </Link>
);

/* ---------- Navbar ---------- */
export const NavbarYellow = ({ cartCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="relative z-40 overflow-visible bg-linear-to-r from-[#050505] via-[#111111] to-[#1C1C1C]">
      {/* Yellow slanted panel on the right (desktop) */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[30%] 2xl:w-[27.5%] bg-linear-to-br from-[#FFE14D] via-[#FFD400] to-[#FFC300] [clip-path:polygon(1.6%_0,100%_0,100%_100%,0_100%)] lg:block"
      />

      <div className="relative mx-auto flex h-20 max-w-[1640px] items-center justify-between px-5 sm:px-8 lg:h-[117px] lg:px-10 2xl:px-[134px]">
        <Logo />

        {/* Desktop links */}
        <nav className="ml-10 mr-auto hidden items-center lg:flex 2xl:ml-[76px]">
          {NAV_LINKS.map((item, i) => (
            <Fragment key={item.label}>
              {i > 0 && (
                <span className="mx-3 text-[10px] text-white/60 xl:mx-4 2xl:mx-[26px]">
                  /
                </span>
              )}
              {item.children ? (
                <DropdownItem item={item} />
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === ROUTES.HOME}
                  className={linkClass}
                >
                  {item.label}
                </NavLink>
              )}
            </Fragment>
          ))}
        </nav>

        {/* Right actions (desktop) */}
        <div className="hidden items-center gap-7 lg:flex 2xl:gap-9">
          <CartButton count={cartCount} />
          <BookCallButton />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-5 lg:hidden">
          <CartButton
            count={cartCount}
            className="text-white"
            badgeClassName="bg-[#FFD400] text-black ring-black"
          />
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
            className="rounded-lg p-1.5 text-white hover:bg-white/10"
          >
            <ListIcon size={28} weight="bold" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <Drawer isOpen={isMenuOpen} onToggle={setIsMenuOpen}>
        <Drawer.Header head="Menu" onClose={closeMenu} />
        <Drawer.Body>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((item) =>
              item.children ? (
                <div key={item.label} className="mt-2">
                  <p className="px-3 pb-1 text-sm font-semibold uppercase text-gray-400">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <MobileLink
                      key={child.to}
                      item={child}
                      onClick={closeMenu}
                    />
                  ))}
                </div>
              ) : (
                <MobileLink key={item.to} item={item} onClick={closeMenu} />
              ),
            )}
          </nav>
        </Drawer.Body>
        <Drawer.Footer>
          <BookCallButton className="w-full" onClick={closeMenu} />
        </Drawer.Footer>
      </Drawer>
    </header>
  );
};

const MobileLink = ({ item, onClick }) => (
  <NavLink
    to={item.to}
    end={item.to === ROUTES.HOME}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "rounded-xl px-3 py-2.5 text-lg font-medium uppercase transition-colors",
        isActive
          ? "bg-[#FFD400] text-black"
          : "text-headings hover:bg-gray-100",
      )
    }
  >
    {item.label}
  </NavLink>
);
