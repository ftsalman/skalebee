// All home page copy lives here so it can be edited without touching the layout.
// Content follows skalebee.com (services, journey, founder, clients, FAQs, contact details).
// Keep claims factual: only add numbers, results or testimonials you can back up.

export const HERO = {
  // Round image above the name. Leave empty to show the Skalebee mark.
  avatar: "/imgs/brand/shakkeer.webp",
  name: "Skalebee",
  status: "Free growth audit",
  // Two headline lines (the SEO build also reads this). "{...}" tokens are ignored.
  titleLines: [
    ["Digital", "marketing", "agency"],
    ["in", "Dubai", "&", "India"],
  ],
  description:
    "We bring you customers from Google, Instagram, Facebook and WhatsApp, and help you close them. SEO, ads, social media, websites, online stores and WhatsApp automation, all under one roof.",
  primaryCta: "Get a free growth audit",
  secondaryCta: "Chat on WhatsApp",
  since: "Digital marketing · Dubai, UAE & India",
};

// Hero side walls: "work" tiles on two walls that run into the screen.
// Tiles are spread over the columns automatically; add as many as you like.
// Simplest: { kind: "photo", image: "/imgs/...jpg" }  or  { kind: "video", video: "/videos/...mp4", poster: "..." }
// Mockups (built from your photos): ad, insta, phone, site, dashboard, chat, search, stat
export const HERO_WALL = [
  // Work samples (files in /public/imgs/hero). Add more as { kind: "photo", image: "/imgs/hero/....jpg" }
  { kind: "photo", image: "/imgs/hero/work-1.jpg" },
  { kind: "photo", image: "/imgs/hero/work-2.jpg" },
  { kind: "stat", stat: "24/7", label: "Instant WhatsApp replies", tag: "Automation", theme: "yellow" },
  { kind: "photo", image: "/imgs/hero/work-3.jpg" },
  { kind: "photo", image: "/imgs/hero/work-4.jpg" },
  { kind: "photo", image: "/imgs/hero/work-5.jpg" },
  { kind: "stat", stat: "UAE + India", label: "Two markets, one team", tag: "Skalebee", theme: "dark" },
  { kind: "photo", image: "/imgs/hero/work-6.jpg" },
  { kind: "photo", image: "/imgs/hero/work-7.jpg" },
  { kind: "photo", image: "/imgs/hero/work-8.jpg" },
  { kind: "stat", stat: "Meta", label: "Certified founder-led team", tag: "Certified", theme: "blue" },
  { kind: "photo", image: "/imgs/hero/work-9.jpg" },
  { kind: "photo", image: "/imgs/hero/work-10.jpg" },
  { kind: "photo", image: "/imgs/hero/work-11.jpg" },
  { kind: "stat", stat: "8 steps", label: "From getting seen to the final sale", tag: "Growth journey", theme: "dark" },
];

export const MARQUEE_WORDS = ["Scale", "Grow", "Convert", "Buzz", "Launch", "Win"];

// Services (skalebee.com/services). `artwork` = animation in /public/imgs/home/services/
export const SERVICES = [
  {
    title: "SEO services",
    artwork: "search",
    description:
      "When people search for what you sell, you should be the business they find. We fix your website, grow your Google Business Profile and write content that ranks, so enquiries come in every day without paying for every click.",
    points: ["SEO audit", "Keyword plan", "On-page SEO", "Technical SEO"],
  },
  {
    title: "Google & Meta Ads",
    artwork: "google-ads",
    description:
      "We plan, create and manage your ads on Google, Facebook and Instagram. Every campaign is tracked to real leads, WhatsApp chats and sales, so you know exactly what your money brings back.",
    points: ["Ad account audit", "Google Ads", "Meta Ads", "Ad creatives"],
  },
  {
    title: "Social media marketing",
    artwork: "campaigns",
    description:
      "We plan, design and post your Instagram and Facebook content, reply to your community and turn followers into enquiries. Your page looks active, professional and on-brand every week.",
    points: ["Monthly content plan", "Design & reels", "Captions & hashtags", "Posting & scheduling"],
  },
  {
    title: "Growth marketing",
    artwork: "performance",
    description:
      "Most people don't buy the first time they see you. We build the full funnel around your ads and website: landing pages, retargeting, follow-ups and testing, so more of the people you already reach become customers.",
    points: ["Funnel mapping", "Landing pages", "Retargeting", "Lead nurturing"],
  },
  {
    title: "Website design",
    artwork: "websites",
    description:
      "Your website is your best salesperson. We design and build fast, mobile-first websites that explain what you do in seconds, rank on Google and make it easy to call, WhatsApp or book.",
    points: ["Strategy & sitemap", "Custom design", "Copywriting", "SEO setup"],
  },
  {
    title: "E-commerce stores",
    artwork: "store",
    description:
      "We build online stores that load fast, look great on phones and make checkout simple. Payments, shipping, product feeds, catalogue ads and WhatsApp order updates are all set up, so you can start selling from day one.",
    points: ["Store setup", "Payments & shipping", "Product pages", "Catalogue & feeds"],
  },
  {
    title: "WhatsApp automation",
    artwork: "conversations",
    description:
      "Your customers already message on WhatsApp. We set up the official WhatsApp Business Platform with chatbots and automations that reply instantly, collect details, send updates and pass hot leads to your team, even at 2 a.m.",
    points: ["WhatsApp Business API", "Chatbot flows", "Click-to-WhatsApp ads", "Broadcasts"],
  },
];

// Services section heading: "{count} services" + the muted rest
export const SERVICES_SECTION = {
  muted: "from getting found on Google to closing the sale on WhatsApp",
};

export const WHY_US = {
  eyebrow: "Why Skalebee",
  title: "Why brands choose Skalebee",
  highlight: ["Skalebee"],
  description:
    "Skalebee is led by founder Shakkeer, a Meta Certified Digital Marketing Associate and Meta Certified Business Messaging Strategist. We keep the team lean, the reporting honest and the focus on sales, not vanity numbers.",
  points: [
    "Founder-led: you talk to the person planning your campaigns",
    "Full funnel, one team: SEO, ads, social, website, store and WhatsApp",
    "UAE + India focus: we know the buyers, languages and ad costs in both",
    "Clear reporting: monthly reports on leads, sales and cost per result",
  ],
};

// About section counters: facts only (no invented results)
export const STATS = [
  { value: 7, label: "Services under one roof" },
  { value: 2, label: "Meta certifications" },
  { value: 2, label: "Markets: UAE & India" },
  { value: 1, label: "Working day to hear back" },
];

// Featured work: brands from skalebee.com/portfolio. Add `image` (a screenshot) or results only
// when you have them. `logo` sits on a coloured card; `theme`: "dark" | "light" | "yellow".
export const CASE_STUDIES = [
  {
    client: "GBH",
    category: "Digital marketing",
    logo: "/imgs/brand/client-gbh-white.png",
    theme: "dark",
    note: "Live link coming soon",
  },
  {
    client: "Flowbee.io",
    category: "Digital marketing",
    logo: "/imgs/brand/client-flowbee.png",
    theme: "light",
    note: "Live link coming soon",
  },
  {
    client: "GBC",
    category: "Digital marketing",
    theme: "yellow",
    note: "Live link coming soon",
  },
];

// "Your growth journey in 8 simple steps" (skalebee.com)
export const APPROACH = [
  { title: "Meta Ads", description: "Facebook and Instagram ads put your brand in front of the right people." },
  { title: "Google Ads", description: "Search ads catch people who are ready to buy right now." },
  { title: "Retargeting", description: "Visitors who didn't buy see you again until they come back." },
  { title: "SEO", description: "Your website ranks on Google, bringing free leads every month." },
  { title: "WhatsApp Automation", description: "Every enquiry gets an instant reply on WhatsApp, 24/7." },
  { title: "Experts", description: "A Meta-certified team manages it all and keeps improving it." },
  { title: "Closing Guides", description: "Simple scripts and follow-ups help your team close the sale." },
  { title: "Business Audit", description: "Regular audits show what's working and what to fix next." },
];

// Add real client testimonials here ({ quote, name, role }). The section stays hidden while empty.
export const TESTIMONIALS = [];

// FAQs (skalebee.com)
export const FAQS = [
  {
    question: "What does Skalebee do?",
    answer:
      "Skalebee is a digital marketing agency for Dubai, the UAE and India. We bring you customers from Google, Facebook, Instagram and WhatsApp through SEO, Google and Meta ads, social media, websites, online stores and WhatsApp automation.",
  },
  {
    question: "How much does digital marketing cost in Dubai or India?",
    answer:
      "It depends on the services, markets and how fast you want to grow. After a free audit we send a fixed monthly quote, with our fee and your ad budget shown separately.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Ads can bring leads within the first weeks. SEO usually shows steady results in 4–6 months. We plan both so you get quick wins and long-term growth.",
  },
  {
    question: "Do you work with businesses outside Dubai and Kerala?",
    answer:
      "Yes. We work with brands across the UAE and India, and everything from audits to monthly reports can be handled online.",
  },
  {
    question: "How do we get started?",
    answer:
      "Fill in the form or message us on WhatsApp. We'll book a short call, review your current marketing and send your free growth audit.",
  },
];

// "Platforms" section: logos travelling around the arc.
// `icon` = a Phosphor logo name, or use `text` (short label) / `image` (path in /public) for anything else.
export const PLATFORMS_SECTION = {
  label: "Platforms we work with",
  title: "Every platform your brand needs, in one place",
  description:
    "Google, Meta, Instagram and WhatsApp, plus your website and online store, run by one team so they work together.",
  cta: "Get a free growth audit",
};

export const PLATFORMS = [
  { name: "Meta", icon: "MetaLogo", color: "#0866FF" },
  { name: "Facebook", icon: "FacebookLogo", color: "#1877F2" },
  { name: "Instagram", icon: "InstagramLogo", color: "#E1306C" },
  { name: "WhatsApp", icon: "WhatsappLogo", color: "#25D366" },
  { name: "Google", icon: "GoogleLogo", color: "#4285F4" },
  { name: "YouTube", icon: "YoutubeLogo", color: "#FF0000" },
  { name: "WooCommerce", text: "Woo", color: "#7F54B3" },
  { name: "Shopify", text: "Shop", color: "#5E8E3E" },
];

export const SERVICE_OPTIONS = [...SERVICES.map((service) => service.title), "Not sure yet"];

// ---------- "Lead → Sales" section ----------
export const LEAD_TO_SALES = {
  label: "Lead → Sales",
  title: "Not just ads. It's about your sales.",
  description:
    "Get seen, get chosen, reply fast, close the sale and keep improving, with every channel working together.",
  steps: [
    { title: "Get found", image: "/imgs/home/fashion.jpg", text: "SEO, Google Ads and Meta Ads bring the right people to you.", tags: ["SEO", "Google Ads", "Meta Ads"] },
    { title: "Capture leads", image: "/imgs/home/workspace.jpg", text: "Websites and landing pages built to turn visitors into enquiries.", tags: ["Websites", "Landing pages"] },
    { title: "Follow up fast", image: "/imgs/home/coffee.jpg", text: "WhatsApp automation replies instantly, 24/7, and keeps every lead warm.", tags: ["WhatsApp Automation"] },
    { title: "Close the sale", image: "/imgs/home/skincare.jpg", text: "Simple scripts and follow-ups help your team close the sale.", tags: ["Closing guides", "Follow-ups"] },
  ],
};

// ---------- "How we keep you in the loop" section ----------
export const REVIEWS = {
  label: "Always in the loop",
  title: "We report. You stay in control.",
  items: [
    {
      title: "Clear Monthly Reports",
      text: "Monthly reports on leads, sales and cost per result, in plain language. You own your ad accounts and data.",
      tag: "Every month",
    },
    {
      title: "Regular Audits",
      text: "Regular audits and tests show what's working and what to fix next, so results keep getting better.",
      tag: "Always improving",
    },
    {
      title: "Free Growth Audit",
      text: "What's working, what's leaking money and the first three things to fix, with a clear 90-day plan.",
      tag: "Free",
      cta: "Get my free audit",
    },
  ],
};

// ---------- Pricing (3 plans) - currently not shown on the page ----------
// PLACEHOLDER PRICES: replace "₹XX,XXX" with your real prices before turning the section on.
export const PRICING = {
  label: "Pricing",
  title: "Simple plans. Clear results.",
  note: "Ad spend is paid directly to Google / Meta and is not included in the plan price.",
  plans: [
    {
      name: "Starter",
      price: "₹XX,XXX",
      period: "/month",
      description: "For new brands getting online the right way.",
      features: ["Website design", "SEO setup", "Free growth audit", "Monthly report"],
      cta: "Start with Starter",
    },
    {
      name: "Growth",
      price: "₹XX,XXX",
      period: "/month",
      description: "For businesses ready to generate leads every day.",
      features: ["Everything in Starter", "Google or Meta Ads", "Landing page", "WhatsApp automation", "Monthly report"],
      cta: "Choose Growth",
      popular: true,
    },
    {
      name: "Scale",
      price: "₹XX,XXX",
      period: "/month",
      description: "The full growth journey for brands that want to scale.",
      features: ["Everything in Growth", "Google + Meta Ads", "Growth marketing & SEO", "E-commerce store", "Closing guides", "Regular audits"],
      cta: "Choose Scale",
    },
  ],
};

// ---------- Certifications (bento) - currently not shown on the page ----------
export const CERTIFICATIONS = {
  label: "Meta certified",
  title: "A Meta-certified team for the UAE and India.",
  // Bento grid: the 5 text cards fill the gaps around the 2 photos.
  items: [
    { title: "Meta Certified Digital Marketing Associate", subtitle: "Meta certification" },
    { title: "Meta Certified Business Messaging Strategy", subtitle: "Meta certification" },
    { title: "Founder-led", subtitle: "You talk to the person planning your campaigns" },
    { title: "Clear monthly reports", subtitle: "Always in the loop" },
    { title: "Ads, websites & WhatsApp in one team", subtitle: "Full funnel" },
  ],
  photos: {
    tall: { src: "/imgs/brand/dubai.webp", alt: "Hand-drawn Dubai skyline with Google, Meta, Instagram and WhatsApp icons" },
    square: { src: "/imgs/brand/kerala.webp", alt: "Hand-drawn Kerala houseboat with Google, Meta, Instagram and WhatsApp icons" },
  },
};

// ---------- Meta Specialist (dark bento section) ----------
const CREDLY = {
  associate: "https://www.credly.com/badges/8779929f-347f-4ed4-9b53-2b18440b0d8b/public_url",
  messaging: "https://www.credly.com/badges/e7b10e2d-c717-48e1-8d1e-8c01c9c01d06/public_url",
};
export const META_SPECIALIST = {
  label: "Meta certified",
  stats: [
    { value: 2, suffix: "", label: "Meta certifications" },
    { value: 2, suffix: "", label: "Offices: Kerala & Dubai" },
    { value: 7, suffix: "", label: "Services under one roof" },
  ],
  location: {
    title: "Kerala & Dubai",
    subtitle: "Serving the UAE & India",
    // Globe: pin = [longitude, latitude] of the office, center = where the globe camera looks
    pin: [76.19, 10.81], // Pattambi, Kerala
    center: [96, -24],
  },
  person: {
    name: "Shakkeer",
    role: "Founder · Meta Certified",
    image: "/imgs/brand/shakkeer.webp",
    heading: "Meet our founder, Shakkeer",
    bio: [
      "Skalebee is led by founder Shakkeer, a Meta Certified Digital Marketing Associate and Meta Certified Business Messaging Strategist.",
      "You talk to the person planning your campaigns, not an account manager in the middle. We keep the team lean, the reporting honest and the focus on sales, not vanity numbers.",
      "Skalebee is a brand of Sharaco Technologies Pvt Ltd, based in Pattambi, Kerala, and working with businesses in Dubai, across the UAE and throughout India.",
    ],
    cta: "Work with Shakkeer",
  },
  partner: {
    title: "Meta Certified",
    subtitle: "Digital Marketing Associate · Business Messaging Strategy",
    cta: "Verify on Credly",
    href: CREDLY.associate,
    badges: [
      { src: "/imgs/brand/meta-digital-marketing-associate.png", alt: "Meta Certified Digital Marketing Associate badge", href: CREDLY.associate },
      { src: "/imgs/brand/meta-business-messaging-strategy.png", alt: "Meta Certified Skill: Business Messaging Strategy badge", href: CREDLY.messaging },
    ],
  },
  toolbox: {
    title: "Everyday's Toolbox",
    subtitle: "Mastered for every campaign.",
    // `icon` = Phosphor logo name, or `text` for a short label
    tools: [
      { name: "Meta", icon: "MetaLogo" },
      { name: "Facebook", icon: "FacebookLogo" },
      { name: "Instagram", icon: "InstagramLogo" },
      { name: "WhatsApp", icon: "WhatsappLogo" },
      { name: "Messenger", icon: "MessengerLogo" },
      { name: "Threads", icon: "ThreadsLogo" },
      { name: "Ads Manager", text: "Ads" },
      { name: "Events Manager / Pixel", text: "Px" },
      { name: "Conversions API", text: "CAPI" },
      { name: "Google Analytics", icon: "GoogleLogo" },
      { name: "Figma", icon: "FigmaLogo" },
      { name: "Canva", text: "Cv" },
      { name: "Shopify", text: "Shop" },
    ],
  },
};

// ---------- "Let’s build yours" (floating work field at the end of the page) ----------
export const BUILD_CTA = {
  title: "Let’s build yours",
  button: "Book a call",
  subtitle: "One call, a clear next step",
  // Cards floating around the button. Click a card: it flies to the centre; click it again to flip
  // it and show the title + tags on the back. Landscape images look best.
  projects: [
    { image: "/imgs/hero/work-1.jpg", title: "Launch announcement creative for a web studio going live", tags: ["Social", "Launch"] },
    { image: "/imgs/hero/work-2.jpg", title: "Course ad covering Meta Ads, Google Ads and SEO", tags: ["Meta Ads", "Creative"] },
    { image: "/imgs/hero/work-3.jpg", title: "Social media flyer set for a gadget brand", tags: ["Social", "Design"] },
    { image: "/imgs/hero/work-4.jpg", title: "App studio ad: turning ideas into apps", tags: ["Ads", "Creative"] },
    { image: "/imgs/hero/work-5.jpg", title: "Lead-generation ad for a videomaker course", tags: ["Meta Ads", "Leads"] },
    { image: "/imgs/hero/work-6.jpg", title: "Influencer agency landing page", tags: ["Website", "UI"] },
    { image: "/imgs/hero/work-7.jpg", title: "Podcast platform homepage", tags: ["Website", "UI"] },
    { image: "/imgs/hero/work-8.jpg", title: "Productivity app dashboard", tags: ["Product", "UI"] },
    { image: "/imgs/hero/work-9.jpg", title: "Audio store e-commerce experience", tags: ["E-commerce", "UI"] },
    { image: "/imgs/hero/work-10.jpg", title: "Streaming app concept for a spatial display", tags: ["Product", "Concept"] },
    { image: "/imgs/hero/work-11.jpg", title: "Testimonial section for a B2B website", tags: ["Website", "Trust"] },
    { image: "/imgs/home/fashion.jpg", title: "Product shoot for an apparel drop", tags: ["E-commerce", "Photo"] },
    { image: "/imgs/home/coffee.jpg", title: "Campaign visual for a coffee brand", tags: ["Meta Ads", "Photo"] },
    { image: "/imgs/home/skincare.jpg", title: "Product ads for a skincare launch", tags: ["Meta Ads", "Photo"] },
    { image: "/imgs/home/workspace.jpg", title: "Brand imagery for a SaaS CRM", tags: ["SaaS", "Photo"] },
  ],
  backPrompt: "Like this work?",
};
