// All home page copy lives here so it can be edited without touching the layout.
// Replace the placeholder text, names and numbers with your real content.

export const HERO = {
  // Round image above the name. Leave empty to show the Skalebee mark.
  avatar: "",
  name: "Skalebee",
  status: "Taking on new brands",
  // Two headline lines (the SEO build also reads this). "{...}" tokens are ignored.
  titleLines: [
    ["Scale", "ads", "that"],
    ["make", "buzz"],
  ],
  description:
    "All the things you need in digital marketing, from the first lead to the final sale. Not just ads, it's about your sales.",
  primaryCta: "Book a call",
  secondaryCta: "Get Free Proposal",
  since: "Growing brands since 2024",
};

// Hero side walls: "work" tiles on two walls that run into the screen.
// Tiles are spread over the columns automatically; add as many as you like.
// Simplest: { kind: "photo", image: "/imgs/...jpg" }  or  { kind: "video", video: "/videos/...mp4", poster: "..." }
// Mockups (built from your photos): ad, insta, phone, site, dashboard, chat, search, stat
const P = {
  fashion: "/imgs/home/fashion.jpg",
  coffee: "/imgs/home/coffee.jpg",
  skincare: "/imgs/home/skincare.jpg",
  workspace: "/imgs/home/workspace.jpg",
};
export const HERO_WALL = [
  // Work samples (files in /public/imgs/hero). Add more as { kind: "photo", image: "/imgs/hero/....jpg" }
  { kind: "photo", image: "/imgs/hero/work-1.jpg" },
  { kind: "photo", image: "/imgs/hero/work-2.jpg" },
  { kind: "stat", stat: "+312%", label: "Online revenue in 6 months", tag: "Meta Ads", theme: "yellow" },
  { kind: "photo", image: "/imgs/hero/work-3.jpg" },
  { kind: "photo", image: "/imgs/hero/work-4.jpg" },
  { kind: "photo", image: "/imgs/hero/work-5.jpg" },
  { kind: "dashboard", title: "Meta Ads · Purchases", value: "5.2x", label: "ROAS", change: "+38%", theme: "dark" },
  { kind: "photo", image: "/imgs/hero/work-6.jpg" },
  { kind: "photo", image: "/imgs/hero/work-7.jpg" },
  { kind: "photo", image: "/imgs/hero/work-8.jpg" },
  { kind: "stat", stat: "18M", label: "Organic views from 40 creators", tag: "Creators", theme: "blue" },
  { kind: "photo", image: "/imgs/hero/work-9.jpg" },
  { kind: "photo", image: "/imgs/hero/work-10.jpg" },
  { kind: "photo", image: "/imgs/hero/work-11.jpg" },
  { kind: "stat", stat: "250+", label: "Brands growing with us", tag: "Skalebee", theme: "dark" },
];

export const MARQUEE_WORDS = ["Scale", "Grow", "Convert", "Buzz", "Launch", "Win"];

// What's included in the Brand Launch Kit
export const BRAND_KIT_ITEMS = [
  "Brand naming",
  "Website",
  "Business email",
  "Instagram profile",
  "Facebook profile",
  "Google Business Profile",
];

export const SERVICES = [
  {
    title: "Websites",
    artwork: "websites",
    description:
      "Fast, mobile-friendly websites and landing pages designed to turn visitors into enquiries and sales.",
    points: ["Design & development", "Landing pages that convert", "Speed & mobile optimisation"],
  },
  {
    title: "SEO",
    artwork: "search",
    description:
      "Get found when customers search. We fix the technical basics, target the right keywords and build content that ranks.",
    points: ["Technical SEO audit", "Keyword & content strategy", "Local SEO & Google Business Profile"],
  },
  {
    title: "Digital Marketing",
    artwork: "strategy",
    description:
      "One plan across all your channels, with clear goals, consistent messaging and reporting you can follow.",
    points: ["Marketing strategy", "Social media management", "Content & creatives"],
  },
  {
    title: "Google Ads",
    artwork: "google-ads",
    description:
      "Search, Shopping, Performance Max and YouTube campaigns built around clear targets and optimised every week.",
    points: ["Search & Shopping campaigns", "Conversion tracking", "Weekly optimisation"],
  },
  {
    title: "Meta Ads",
    artwork: "campaigns",
    description:
      "Facebook and Instagram ads that stop the scroll, run by a Meta certified team and scaled only when the numbers say so.",
    points: ["Campaign setup & audits", "Creative testing", "Retargeting"],
  },
  {
    title: "Performance Marketing",
    artwork: "performance",
    description:
      "Every rupee tracked from click to sale. We move budget to whatever brings the most leads and revenue.",
    points: ["Full-funnel tracking", "ROAS & cost-per-lead targets", "Budget optimisation"],
  },
  {
    title: "E-commerce Store",
    artwork: "store",
    description:
      "Online stores on Shopify or WooCommerce, built to sell: clear product pages, smooth checkout and the marketing to bring buyers back.",
    points: ["Shopify & WooCommerce", "Product pages that convert", "Payments & shipping setup"],
  },
  {
    title: "WhatsApp Automation",
    artwork: "conversations",
    description:
      "Reply instantly, follow up automatically and send updates on WhatsApp, so no lead or order slips through.",
    points: ["WhatsApp Business API setup", "Chatbots & auto-replies", "Lead & order notifications"],
  },
  {
    title: "Lead to Sales Team",
    artwork: "briefing",
    description:
      "Leads are only the start. Our team follows up, qualifies and helps turn enquiries into paying customers.",
    points: ["Lead follow-up & qualification", "Sales scripts & process", "CRM setup"],
  },
  {
    title: "Brand Launch Kit",
    artwork: "launch",
    description:
      "Everything a new brand needs to go live, set up properly from day one.",
    points: BRAND_KIT_ITEMS,
  },
];

// Services section heading: "{count} services" + the muted rest
export const SERVICES_SECTION = {
  muted: "from the first lead to the final sale",
};

export const WHY_US = {
  eyebrow: "Why Skalebee",
  title: "Built To Scale What Already Works",
  highlight: ["Scale"],
  description:
    "We work like part of your team: open numbers, fast tests and decisions you can follow.",
  points: [
    "Meta Business Partner with a Meta certified team",
    "Weekly review of every campaign",
    "Monthly report meeting with you",
    "We focus on sales, not just clicks",
  ],
};

export const STATS = [
  { value: 250, suffix: "+", label: "Brands grown" },
  { value: 1.2, decimals: 1, suffix: "B", label: "Impressions served" },
  { value: 4.6, decimals: 1, suffix: "x", label: "Average ROAS" },
  { value: 98, suffix: "%", label: "Client retention" },
];

export const CASE_STUDIES = [
  {
    client: "Northwind Apparel",
    category: "Fashion · Meta Ads",
    result: "+312%",
    resultLabel: "online revenue in 6 months",
    gradient: "from-[#FFD400] to-[#F6B90F]",
    dark: false,
  },
  {
    client: "Brewhaus Coffee",
    category: "F&B · Creator Campaign",
    result: "18M",
    resultLabel: "organic views from 40 creators",
    gradient: "from-[#2A2A2A] to-[#0A0A0A]",
    dark: true,
  },
  {
    client: "Lumen Skincare",
    category: "Beauty · Google + YouTube",
    result: "5.2x",
    resultLabel: "return on ad spend",
    gradient: "from-[#FFF3B0] to-[#FFD400]",
    dark: false,
  },
  {
    client: "Stackly CRM",
    category: "SaaS · Lead Generation",
    result: "-47%",
    resultLabel: "cost per qualified lead",
    gradient: "from-[#1C1C1C] to-[#3A3000]",
    dark: true,
  },
];

export const APPROACH = [
  {
    icon: "MagnifyingGlass",
    title: "Discover",
    description: "We audit your accounts, audience and margins to find the fastest wins.",
  },
  {
    icon: "Strategy",
    title: "Plan",
    description: "A channel and creative plan with clear targets for every rupee.",
  },
  {
    icon: "RocketLaunch",
    title: "Launch",
    description: "Campaigns go live with tracking checked and creatives ready to test.",
  },
  {
    icon: "TrendUp",
    title: "Scale",
    description: "We double down on what converts and cut what doesn't, every week.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Skalebee rebuilt our ad account from scratch. Within three months our cost per purchase dropped by almost half.",
    name: "Ananya K.",
    role: "Founder, Northwind Apparel",
  },
  {
    quote:
      "The creator campaign they ran for our launch did more for us than a year of paid ads. Organised, quick and honest.",
    name: "Rahul S.",
    role: "Marketing Lead, Brewhaus",
  },
  {
    quote:
      "Weekly reports we actually understand, and a team that answers on the same day. Exactly what we needed.",
    name: "Meera J.",
    role: "CEO, Lumen Skincare",
  },
  {
    quote:
      "They told us which channels not to spend on. That alone saved us more than their fee.",
    name: "Pranav N.",
    role: "Growth, Stackly",
  },
];

export const FAQS = [
  {
    question: "Do you offer a free business review?",
    answer:
      "Yes. We review your business, website and ads for free and share clear next steps, with no obligation.",
  },
  {
    question: "What budget do I need to start?",
    answer:
      "Most clients start between ₹50,000 and ₹2,00,000 per month in ad spend. We'll recommend a budget during your free proposal call.",
  },
  {
    question: "How soon will I see results?",
    answer:
      "You'll usually see early signals in the first 2–3 weeks. Stable, scalable results typically take 60–90 days of testing.",
  },
  {
    question: "Do you work with small businesses?",
    answer:
      "Yes. We work with early-stage brands as well as established companies, and shape the plan around your stage and budget.",
  },
  {
    question: "Which platforms do you manage?",
    answer:
      "Meta (Facebook & Instagram), Google Search, Shopping & YouTube, SEO, websites, Shopify & WooCommerce stores and WhatsApp automation.",
  },
  {
    question: "Is there a long-term contract?",
    answer:
      "No. We work month to month after an initial 3-month setup period, so we keep earning your business.",
  },
  {
    question: "How do you report results?",
    answer:
      "We review your campaigns every week, and meet with you every month to walk through the report: leads, sales, spend and the plan for next month.",
  },
];

// "Platforms" section: logos travelling around the arc.
// `icon` = a Phosphor logo name, or use `text` (short label) / `image` (path in /public) for anything else.
export const PLATFORMS_SECTION = {
  label: "Platforms we work with",
  title: "Every platform your brand needs - in one place",
  description:
    "Ads, social, search, stores and WhatsApp, managed by one team, so you never have to juggle agencies or logins again.",
  cta: "Book a call",
};

export const PLATFORMS = [
  { name: "Meta", icon: "MetaLogo", color: "#0866FF" },
  { name: "Facebook", icon: "FacebookLogo", color: "#1877F2" },
  { name: "Instagram", icon: "InstagramLogo", color: "#E1306C" },
  { name: "WhatsApp", icon: "WhatsappLogo", color: "#25D366" },
  { name: "Flowbee", text: "F", color: "#F6B90F" }, // add `image: "/imgs/flowbee.png"` to use the real logo
  { name: "Google", icon: "GoogleLogo", color: "#4285F4" },
  { name: "YouTube", icon: "YoutubeLogo", color: "#FF0000" },
  { name: "LinkedIn", icon: "LinkedinLogo", color: "#0A66C2" },
  { name: "WooCommerce", text: "Woo", color: "#7F54B3" },
  { name: "Shopify", text: "Shop", color: "#5E8E3E" },
  { name: "Threads", icon: "ThreadsLogo", color: "#000000" },
  { name: "TikTok", icon: "TiktokLogo", color: "#000000" },
];

export const SERVICE_OPTIONS =[...SERVICES.map((service) => service.title), "Not sure yet"];

// ---------- "Lead → Sales" section ----------
export const LEAD_TO_SALES = {
  label: "Lead → Sales",
  title: "Not just ads. It's about your sales.",
  description:
    "All the things you need in digital marketing, working together, from the first click to the final sale.",
  steps: [
    { title: "Get found", image: "/imgs/home/fashion.jpg", text: "SEO, Google Ads and Meta Ads bring the right people to you.", tags: ["SEO", "Google Ads", "Meta Ads"] },
    { title: "Capture leads", image: "/imgs/home/workspace.jpg", text: "Websites and landing pages built to turn visitors into enquiries.", tags: ["Websites", "Landing pages"] },
    { title: "Follow up fast", image: "/imgs/home/coffee.jpg", text: "WhatsApp automation replies instantly and keeps every lead warm.", tags: ["WhatsApp Automation"] },
    { title: "Close the sale", image: "/imgs/home/skincare.jpg", text: "Our lead-to-sales team qualifies leads and helps turn them into customers.", tags: ["Sales team", "CRM"] },
  ],
};

// ---------- "How we keep you in the loop" section ----------
export const REVIEWS = {
  label: "Always in the loop",
  title: "We review. You stay in control.",
  items: [
    {
      title: "Weekly Review",
      text: "Every week we review your campaigns, leads and spend, and adjust what isn't working.",
      tag: "Every week",
    },
    {
      title: "Monthly Report Meeting",
      text: "A monthly meeting with you to walk through the report: results, sales and the plan for next month.",
      tag: "Every month",
    },
    {
      title: "Free Business Review",
      text: "Not working with us yet? Get a free review of your business, website and ads, with clear next steps.",
      tag: "Free",
      cta: "Book your free review",
    },
  ],
};

// ---------- Pricing (3 plans) ----------
// PLACEHOLDER PRICES: replace "₹XX,XXX" with your real prices.
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
      features: [
        "Brand Launch Kit: naming, website, business email, Instagram, Facebook & Google profiles",
        "Basic SEO setup",
        "Free business review",
        "Monthly report meeting",
      ],
      cta: "Start with Starter",
    },
    {
      name: "Growth",
      price: "₹XX,XXX",
      period: "/month",
      description: "For businesses ready to generate leads every day.",
      features: [
        "Everything in Starter",
        "Meta Ads or Google Ads management",
        "Landing page",
        "WhatsApp automation",
        "Weekly review",
        "Monthly report meeting",
      ],
      cta: "Choose Growth",
      popular: true,
    },
    {
      name: "Scale",
      price: "₹XX,XXX",
      period: "/month",
      description: "Full lead-to-sales system for brands that want to scale.",
      features: [
        "Everything in Growth",
        "Meta Ads + Google Ads",
        "Performance marketing & SEO",
        "E-commerce store (Shopify / WooCommerce)",
        "Lead to sales team",
        "Weekly review + monthly report meeting",
      ],
      cta: "Choose Scale",
    },
  ],
};

// ---------- Certifications ----------
// Put the certificate images in /public/imgs/certs/ with these file names.
export const CERTIFICATIONS = {
  label: "Certified & trusted",
  title: "A Meta Business Partner, certified by Meta.",
  // Bento grid: the 5 text cards fill the gaps around the 2 photos.
  items: [
    { title: "Meta Business Partner", subtitle: "Official partner" },
    { title: "Meta Certified Digital Marketing Associate", subtitle: "Meta certification" },
    { title: "Meta Certified Media Buying Strategist", subtitle: "Meta certification" },
    { title: "Weekly reviews, monthly reports", subtitle: "Always in the loop" },
    { title: "Ads, websites & WhatsApp in one team", subtitle: "One partner" },
  ],
  photos: {
    tall: { src: "/imgs/home/fashion.jpg", alt: "Clothing rack with hoodies and a cap" },
    square: { src: "/imgs/home/skincare.jpg", alt: "Serum bottles and a facial cleanser" },
  },
};

// ---------- Meta Specialist (dark bento section) ----------
// PLACEHOLDER: check the name, numbers, location and bio before publishing.
export const META_SPECIALIST = {
  label: "Meta Specialist",
  stats: [
    { value: 5, suffix: "+", label: "Years running Meta Ads" },
    { value: 3, suffix: "", label: "Meta certifications" },
    { value: 250, suffix: "+", label: "Brands scaled on Meta" },
  ],
  location: {
    title: "Based in India",
    subtitle: "Available worldwide",
    // Globe: pin = [longitude, latitude] of the office, center = where the globe camera looks
    pin: [76.27, 9.93], // Kerala (Kochi) - change to your city
    center: [96, -24],
  },
  person: {
    name: "Shakkeer PP",
    role: "Meta Certified Specialist · Skalebee",
    image: "https://i.pinimg.com/1200x/a0/e9/ba/a0e9ba907ad99de21518647b5167db07.jpg",
    heading: "The Meta Specialist",
    bio: [
      "Every Skalebee campaign on Facebook and Instagram is planned and run by a Meta certified specialist, not handed off to a junior or an automated tool.",
      "The work covers the full Meta stack: account structure, Pixel and Conversions API tracking, audiences, creative testing and retargeting. Budgets are scaled only when the numbers say so.",
      "From a first test campaign to multi-lakh monthly spend, you get one expert who knows your account inside out and reviews it every week.",
    ],
    cta: "Work with our Meta specialist",
  },
  partner: { title: "Meta Business Partner", cta: "Learn more" },
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
