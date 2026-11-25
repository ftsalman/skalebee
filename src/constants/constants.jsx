export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  CONTACT: "/contact",
  TEAM: "/team",
  PRICING: "/pricing",
  FAQ: "/faq",
};

// From skalebee.com
export const CONTACT_INFO = {
  email: "hello@skalebee.com",
  phone: "+91 90378 37100",
  whatsapp: "+91 98466 56915",
  whatsappUrl: "https://wa.me/919846656915",
  company: "Sharaco Technologies Pvt Ltd",
  address: "Sharaco Technologies Pvt Ltd, Mele Pattambi, Pattambi, Palakkad, Kerala 679303",
  offices: ["Pattambi, Kerala, India", "Dubai, United Arab Emirates"],
};

// Shown in the footer. skalebee.com lists WhatsApp only; add more as { name, href } with full URLs
// (e.g. { name: "Instagram", href: "https://instagram.com/..." }). Entries with "#" show as plain text.
export const SOCIAL_LINKS = [
  { name: "WhatsApp", icon: "Whatsapp", href: "https://wa.me/919846656915" },
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
