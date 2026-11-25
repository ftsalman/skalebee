export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  CONTACT: "/contact",
  TEAM: "/team",
  PRICING: "/pricing",
  FAQ: "/faq",
};

// Placeholder contact details - replace with your real ones
export const CONTACT_INFO = {
  email: "hello@yourdomain.com",
  phone: "+91 00000 00000",
  address: "Your office address, City",
};

// Replace "#" with your real profile URLs
export const SOCIAL_LINKS = [
  { name: "Instagram", icon: "Instagram", href: "#" },
  { name: "LinkedIn", icon: "Linkedin", href: "#" },
  { name: "YouTube", icon: "Youtube", href: "#" },
  { name: "X", icon: "X", href: "#" },
  { name: "WhatsApp", icon: "Whatsapp", href: "#" },
];

export const FOOTER_LINKS = [
  {
    title: "Company",
    links: [
      { label: "About", to: ROUTES.ABOUT },
      { label: "Our Team", to: ROUTES.TEAM },
      { label: "Pricing", to: ROUTES.PRICING },
      { label: "Contact", to: ROUTES.CONTACT },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Performance Ads", to: ROUTES.SERVICES },
      { label: "Creator Campaigns", to: ROUTES.SERVICES },
      { label: "Growth Strategy", to: ROUTES.SERVICES },
      { label: "FAQ", to: ROUTES.FAQ },
    ],
  },
];

// Main navbar links. Add `children` to show a dropdown.
export const NAV_LINKS = [
  { label: "Services", to: "/#services" },
  { label: "Work", to: "/#work" },
  { label: "About Us", to: "/#about" },
  { label: "FAQ", to: "/#faq" },
];
