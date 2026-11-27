// Service detail pages (/services/:slug). All copy lives here so it can be edited without
// touching the layout. Keep this file plain JS (no JSX, no "@/..." imports): src/config/seo.js
// and the build scripts read it too.
//
// Keep claims factual: only add numbers, results or client names you can back up.
// Images that show placeholder numbers say so in their caption.
//
// Page anatomy (matches the article layout):
//   title      big heading at the top
//   meta       mono line under the title (read time is worked out from the text)
//   info       small mono columns (label / value)
//   summary    three columns: problem, what you get, results
//   hero       large tinted card with the service illustration
//   sections   numbered sections; `nav` is the shorter sidebar label (optional),
//              `figure` shows after the section: { image, alt, caption, bg }
//              or a split figure { images: [{ image, alt, bg }, { image, alt }], caption }

export const SERVICES_UPDATED = "2026-11-26";

export const SERVICES_INDEX = {
  title: "Services: everything from the first search to the final sale",
  intro:
    "Skalebee is a Meta Business Partner and digital marketing agency in Kerala and Dubai. Each service below is a page on how we run it: what we do, in what order, and what you get at the end.",
  description:
    "SEO, Google and Meta Ads, social media, growth marketing, websites, online stores and WhatsApp automation. See how Skalebee runs each service for brands in the UAE and India.",
};

const MARKETS = { label: "Markets", value: "UAE & India" };
const TEAM = { label: "Team", value: "Founder-led, Meta certified" };
const REPORTING = {
  label: "Reporting",
  value: "A monthly report on leads, sales and cost per result.",
};

export const SERVICE_PAGES = [
  // ---------------------------------------------------------------- SEO
  {
    slug: "seo-services",
    name: "SEO services",
    title: "SEO services: how we get your business found on Google",
    description:
      "How Skalebee runs SEO for businesses in Dubai, the UAE and India: an SEO audit, a keyword plan, on-page and technical fixes, Google Business Profile and content that ranks.",
    category: "Search",
    artwork: "search",
    tint: "#86b0f8",
    info: [
      MARKETS,
      TEAM,
      { label: "Tools", value: "Search Console, Google Analytics" },
    ],
    summary: [
      {
        label: "Problem",
        value: "Buyers search for what you sell and find your competitors first.",
      },
      {
        label: "What you get",
        value: "An audit, a keyword plan, a faster site and content that ranks.",
      },
      {
        label: "Results",
        value: "Steady growth usually shows in 4–6 months.",
      },
    ],
    hero: {
      image: "/imgs/home/services/search.webp",
      alt: "Illustration of a search results page under a magnifying glass, next to a rising traffic chart",
    },
    sections: [
      {
        title: "What SEO does for you",
        body: [
          "When someone in Dubai or Kerala searches for what you sell, you should be the business they find. SEO is the work that gets you there: a website Google understands, pages built around what people actually type, and a Google Business Profile that shows up on the map.",
          "Unlike ads, you don't pay for every click. Once a page ranks, it keeps bringing enquiries month after month. Here is how we run it.",
        ],
      },
      {
        title: "Why most websites don't rank",
        nav: "Why most sites don't rank",
        body: [
          "Most of the websites we review share the same 3 problems. The first is technical: slow pages, broken links and pages Google can't index, so good content never gets seen.",
          "The second is targeting. Pages are written around what the business calls itself, not around what buyers search for. The third is the map: an incomplete Google Business Profile, so nearby customers walk into someone else's shop.",
        ],
      },
      {
        title: "Starting with an SEO audit",
        nav: "Starting with an audit",
        body: [
          "Before changing anything, we audit what you have. We check how Google crawls and indexes your site, how fast each page loads on a phone, which pages already bring visitors and which searches you appear for.",
          "You get a plain-language list of what is holding you back, ordered by impact, so the first fixes are the ones that move results.",
        ],
      },
      {
        title: "Building the keyword plan",
        body: [
          "Next we map the searches your buyers make, from \"near me\" searches to detailed questions they ask before they buy. Each search is matched to one page on your site, so pages don't compete with each other.",
          "The plan covers both markets when you sell in the UAE and India, since people search differently, and in different languages, in each.",
        ],
        figure: {
          image: "/imgs/home/loop/search.webp",
          alt: "Mock search results with a business ranked first and an organic traffic chart rising",
          caption: "The goal: the first result for the searches that matter, and traffic that keeps rising. Mock UI.",
        },
      },
      {
        title: "On-page and technical fixes",
        body: [
          "With the plan agreed, we fix the website itself. Titles, headings and descriptions are rewritten for the searches each page targets. Images are compressed, pages are sped up and broken links are repaired.",
          "We add structured data so Google can show richer results, and we make sure every important page can be found, crawled and indexed.",
        ],
      },
      {
        title: "Your Google Business Profile",
        nav: "Google Business Profile",
        body: [
          "For local searches, the map often matters more than the website. We complete and optimise your Google Business Profile: categories, services, photos, opening hours and posts.",
          "Your name, address and phone number are kept identical everywhere they appear online, which helps Google trust that your business is real and nearby.",
        ],
      },
      {
        title: "Content that answers buyers",
        body: [
          "Ranking pages answer the question behind a search. We write service pages, location pages and articles around the questions your buyers ask, in clear language and with a next step on every page: call, WhatsApp or book.",
        ],
      },
      {
        title: "Reporting and what to expect",
        nav: "What to expect",
        body: [
          "Each month you get a report on rankings, organic visitors and the enquiries they bring. SEO is slower than ads: steady results usually show in 4–6 months. That is why we often run it alongside Google or Meta Ads, so you get quick wins while organic growth builds.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Ads
  {
    slug: "google-meta-ads",
    name: "Google & Meta Ads",
    title: "Google & Meta Ads: campaigns tracked to real leads and sales",
    description:
      "How Skalebee plans, creates and manages Google Ads and Meta Ads on Facebook and Instagram, with every campaign tracked to leads, WhatsApp chats and sales.",
    category: "Paid ads",
    artwork: "google-ads",
    tint: "#f9d96a",
    info: [MARKETS, TEAM, { label: "Platforms", value: "Google, Facebook, Instagram" }],
    summary: [
      {
        label: "Problem",
        value: "Ad money is spent, but nobody can say which ads bring customers.",
      },
      {
        label: "What you get",
        value: "Campaigns, creatives and tracking managed by one certified team.",
      },
      {
        label: "Results",
        value: "Ads can bring leads within the first weeks.",
      },
    ],
    hero: {
      image: "/imgs/home/services/google-ads.webp",
      alt: "Illustration of a search ad being clicked, next to a target and a rising results chart",
    },
    sections: [
      {
        title: "What we manage",
        body: [
          "We plan, create and run your ads on Google, Facebook and Instagram. That covers the strategy, the audiences, the ad creatives, the daily management and the reporting.",
          "Every campaign is tracked to real outcomes: form leads, calls, WhatsApp chats and sales, so you know exactly what your money brings back. You always own your ad accounts.",
        ],
      },
      {
        title: "Where ad budgets leak",
        body: [
          "When we take over an account, the same leaks come up again and again. Conversions aren't tracked, so the platforms optimise for clicks instead of customers. Search ads show for terms nobody buys from. And one tired creative runs for months after people stopped noticing it.",
        ],
      },
      {
        title: "Auditing your ad account",
        nav: "Ad account audit",
        body: [
          "We start with an audit of your existing Google and Meta accounts: campaign structure, targeting, search terms, creatives, landing pages and tracking. If you are starting fresh, we audit your competitors' ads and your website instead.",
          "You get a short list of what to keep, what to stop and what to test first.",
        ],
      },
      {
        title: "Tracking before spending",
        body: [
          "Before we raise a budget, we make sure every result can be measured. We set up the Meta Pixel and Conversions API, Google Ads conversion tracking and Google Analytics, and connect WhatsApp and call leads where possible.",
          "Good tracking is what lets the platforms find more people like your real customers.",
        ],
      },
      {
        title: "Google Ads: catching demand",
        body: [
          "Search ads reach people who are already looking for what you sell. We build campaigns around high-intent searches, match each search to a relevant landing page and add negative keywords to stop spend on searches that never convert.",
        ],
      },
      {
        title: "Meta Ads: creating demand",
        body: [
          "Facebook and Instagram ads put your brand in front of people before they search. We plan audiences around who already buys from you, then run prospecting, retargeting and click-to-WhatsApp campaigns so new people discover you and warm visitors come back.",
        ],
        figure: {
          image: "/imgs/home/loop/strategy.webp",
          alt: "Mock campaign overview splitting budget across Meta, Google, WhatsApp and SEO, next to an A/B creative test",
          caption: "Budget follows results, channel by channel. The percentages are placeholder UI.",
        },
      },
      {
        title: "Creative and testing",
        body: [
          "On social platforms the creative is most of the targeting. We design static ads, carousels and short videos, then test angles, hooks and offers against each other. Winners get more budget; the rest are replaced before they fatigue.",
        ],
      },
      {
        title: "Reporting in leads and sales",
        nav: "Reporting",
        body: [
          "Each month you get a report in plain language: what you spent, how many leads and sales it brought and what each one cost. Then we agree what to change next, whether that is budget, audience, creative or the landing page.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Social
  {
    slug: "social-media-marketing",
    name: "Social media marketing",
    title: "Social media marketing: a page that looks active and brings enquiries",
    description:
      "How Skalebee plans, designs and posts Instagram and Facebook content for brands in the UAE and India: monthly content plans, design and reels, captions, scheduling and community replies.",
    category: "Social",
    artwork: "campaigns",
    tint: "#f4b4d4",
    info: [MARKETS, TEAM, { label: "Platforms", value: "Instagram, Facebook" }],
    summary: [
      {
        label: "Problem",
        value: "The page goes quiet for weeks, then posts whatever is at hand.",
      },
      {
        label: "What you get",
        value: "A monthly plan, designs and reels, posted and answered for you.",
      },
      REPORTING,
    ],
    hero: {
      image: "/imgs/home/services/campaigns.webp",
      alt: "Illustration of a product post, a content calendar and an audience of followers",
    },
    sections: [
      {
        title: "What we take off your plate",
        body: [
          "We plan, design and post your Instagram and Facebook content, reply to your community and turn followers into enquiries. You approve the plan; we handle the rest.",
          "The result is a page that looks active, professional and on-brand every week, without your team losing hours to it.",
        ],
      },
      {
        title: "Why pages go quiet",
        body: [
          "Most business pages don't fail for lack of ideas. They fail because posting depends on whoever has time that week. Designs don't match, posts stop during busy months and messages wait days for a reply.",
        ],
      },
      {
        title: "The monthly content plan",
        body: [
          "Every month starts with a plan: themes, post types, dates and the offer or message behind each post. It mixes content that builds trust, content that shows your work and content that asks for the enquiry.",
          "You review the plan before anything is designed, so there are no surprises.",
        ],
      },
      {
        title: "Design and reels",
        body: [
          "We design posts, carousels and stories in your brand style, and edit short reels from your footage or ours. A consistent look makes the page recognisable in a busy feed.",
        ],
        figure: {
          images: [
            {
              image: "/imgs/home/loop/launch.webp",
              alt: "Mock product post next to a retargeting ad with a discount",
              bg: "#efeff4",
            },
            {
              image: "/imgs/home/fashion.webp",
              alt: "Fashion photo used as the kind of image a brand post is built from",
            },
          ],
          caption: "The mood: real photos and clean cards, not stock templates. The product and prices are mock UI.",
        },
      },
      {
        title: "Captions, hashtags and posting",
        nav: "Captions and posting",
        body: [
          "Each post gets a caption written for your audience, relevant hashtags and a clear call to action. Posts are scheduled at the times your followers are active, so the page keeps moving even when you are busy.",
        ],
      },
      {
        title: "Turning followers into enquiries",
        nav: "Followers into enquiries",
        body: [
          "Likes are not the goal. We reply to comments and messages, point interested people to WhatsApp or your website, and boost the posts that start conversations. When it makes sense, we connect the page to your Meta Ads so your best content reaches new people.",
        ],
      },
      {
        title: "What you see each month",
        body: [
          "A short monthly report shows reach, engagement, profile visits and the messages and enquiries the page brought. We use it to shape the next month's plan.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Growth
  {
    slug: "growth-marketing",
    name: "Growth marketing",
    title: "Growth marketing: turning the people you reach into customers",
    description:
      "How Skalebee builds the full funnel around your ads and website: funnel mapping, landing pages, retargeting, lead nurturing and testing, for brands in the UAE and India.",
    category: "Funnel",
    artwork: "performance",
    tint: "#a7dfb9",
    info: [MARKETS, TEAM, { label: "Tools", value: "Google Analytics, Meta, n8n" }],
    summary: [
      {
        label: "Problem",
        value: "Visitors arrive, look around and leave without enquiring.",
      },
      {
        label: "What you get",
        value: "A mapped funnel, landing pages, retargeting and follow-ups.",
      },
      REPORTING,
    ],
    hero: {
      image: "/imgs/home/services/performance.webp",
      alt: "Illustration of a sales funnel next to a rising chart and a donut chart",
    },
    sections: [
      {
        title: "What growth marketing means here",
        nav: "What it means here",
        body: [
          "Most people don't buy the first time they see you. Growth marketing is the work around your ads and website that brings them back and moves them closer to buying: landing pages, retargeting, follow-ups and constant testing.",
          "The aim is simple: more customers from the people you already reach, before spending more to reach new ones.",
        ],
      },
      {
        title: "Why traffic doesn't turn into sales",
        nav: "Why traffic doesn't convert",
        body: [
          "Ads often send people to a home page that tries to say everything at once. There is no reason to act today, no follow-up for people who leave and no way to tell which step is losing them.",
        ],
      },
      {
        title: "Mapping your funnel",
        body: [
          "We start by drawing the path a customer takes today, from the first ad or search to the final sale, and measuring how many people drop off at each step. The biggest drop is where we work first.",
        ],
      },
      {
        title: "Landing pages that convert",
        body: [
          "Each campaign gets a landing page built for one offer and one action. It answers the questions buyers have, shows proof and makes it easy to call, WhatsApp or fill in a short form. Pages load fast on phones, where most of your visitors are.",
        ],
      },
      {
        title: "Retargeting the people who left",
        nav: "Retargeting",
        body: [
          "Visitors who didn't buy see you again on Facebook, Instagram and Google. Messages are based on what they looked at, so someone who viewed a product sees that product, and someone who started a form is reminded to finish it.",
        ],
        figure: {
          image: "/imgs/home/loop/performance.webp",
          alt: "Mock product page next to a retargeting ad that brings the visitor back",
          caption: "A visitor leaves the product page and sees it again later with a reason to come back. Mock UI.",
        },
      },
      {
        title: "Nurturing leads until they buy",
        nav: "Lead nurturing",
        body: [
          "A lead that isn't ready today may be ready next month. We set up follow-ups by WhatsApp and email that answer common questions, share proof and offer a next step, so leads stay warm without your team chasing each one by hand.",
        ],
      },
      {
        title: "Testing and the monthly review",
        nav: "Testing and review",
        body: [
          "Every month we test something: a headline, an offer, a form, a follow-up message. We keep what works and drop what doesn't, then review leads, sales and cost per result with you to set the next priority.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Websites
  {
    slug: "website-design",
    name: "Website design",
    title: "Website design: a site that explains you in seconds and sells",
    description:
      "How Skalebee designs and builds fast, mobile-first websites: strategy and sitemap, copywriting, custom design and SEO setup, built to bring calls, WhatsApp chats and bookings.",
    category: "Websites",
    artwork: "websites",
    tint: "#b9b4f6",
    info: [MARKETS, TEAM, { label: "Tools", value: "Figma, Webflow" }],
    summary: [
      {
        label: "Problem",
        value: "The site looks dated, loads slowly and doesn't say what you do.",
      },
      {
        label: "What you get",
        value: "A fast, mobile-first site with clear copy and SEO set up.",
      },
      {
        label: "Built for",
        value: "Calls, WhatsApp chats and bookings, not just visits.",
      },
    ],
    hero: {
      image: "/imgs/home/services/websites.webp",
      alt: "Illustration of a website broken into layers: key flows, form fields and UI controls",
    },
    sections: [
      {
        title: "What we build",
        body: [
          "Your website is your best salesperson. We design and build fast, mobile-first websites that explain what you do in seconds, rank on Google and make it easy to call, WhatsApp or book.",
          "That covers the strategy, the copy, the design, the build and the SEO setup, handled by one team.",
        ],
      },
      {
        title: "What goes wrong with most websites",
        nav: "What goes wrong",
        body: [
          "Most business websites are built around how the company sees itself. Visitors land, can't tell what is offered or what to do next, and leave. On phones it is worse: slow pages, tiny buttons and forms that are hard to fill in.",
        ],
      },
      {
        title: "Strategy and sitemap",
        body: [
          "We start with your customers, not the design. Who visits, what they need to know and what you want them to do. From that we plan the sitemap: which pages exist, what each one is for and how a visitor moves from one to the next.",
        ],
      },
      {
        title: "Copy first, then design",
        body: [
          "We write the words before we draw the pages. Clear headlines, plain explanations and a next step on every page. Writing first means the design is built to fit the message, not the other way round.",
        ],
      },
      {
        title: "Custom, mobile-first design",
        nav: "Mobile-first design",
        body: [
          "Every site is designed in Figma, for phones first and then for larger screens. You see and comment on the real pages before anything is built.",
        ],
        figure: {
          image: "/imgs/hero/work-11.webp",
          alt: "Website section showing a grid of client portraits under the heading Trusted by leaders",
          caption: "From our work: a testimonials section that leads with real faces before any claims.",
          bg: "#f1f1f4",
        },
      },
      {
        title: "Built for speed and SEO",
        body: [
          "We build for speed: compressed images, clean code and nothing the page doesn't need. Titles, descriptions, structured data and a sitemap are set up from day one, and Google Analytics is connected so you can see how visitors use the site.",
        ],
      },
      {
        title: "Launch and handover",
        body: [
          "Before launch we test every page and form on real phones and browsers. After launch you get a walkthrough so your team can update text and images, and we stay on hand for changes as your business grows.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Stores
  {
    slug: "e-commerce-stores",
    name: "E-commerce stores",
    title: "E-commerce stores: built to sell from day one",
    description:
      "How Skalebee builds online stores on Shopify and WooCommerce: store setup, product pages, payments and shipping, catalogue feeds, ads and WhatsApp order updates.",
    category: "E-commerce",
    artwork: "store",
    tint: "#f7bf8f",
    info: [MARKETS, TEAM, { label: "Platforms", value: "Shopify, WooCommerce" }],
    summary: [
      {
        label: "Problem",
        value: "Shoppers add to cart, then drop out at a slow, confusing checkout.",
      },
      {
        label: "What you get",
        value: "A fast store with payments, shipping and feeds set up.",
      },
      {
        label: "Built for",
        value: "Selling from day one, on phones first.",
      },
    ],
    hero: {
      image: "/imgs/home/services/store.webp",
      alt: "Illustration of store screens for phone and desktop, labelled responsive, error handling and accessibility",
    },
    sections: [
      {
        title: "What we set up",
        body: [
          "We build online stores that load fast, look great on phones and make checkout simple. Payments, shipping, product feeds, catalogue ads and WhatsApp order updates are all set up, so you can start selling from day one.",
        ],
      },
      {
        title: "Why online stores lose sales",
        nav: "Why stores lose sales",
        body: [
          "Stores rarely lose sales on the home page. They lose them on product pages that don't answer questions, in checkouts with too many steps and surprise costs, and after the order, when customers don't know where their parcel is.",
        ],
      },
      {
        title: "Store setup and platform",
        body: [
          "We help you choose the right platform, usually Shopify or WooCommerce, based on your products, budget and the markets you sell in. Then we set up the store structure: collections, filters, navigation and the pages buyers expect, like shipping, returns and contact.",
        ],
      },
      {
        title: "Product pages that sell",
        body: [
          "A product page has to do the job of a shop assistant. Clear photos, sizes and variants, an honest description, delivery times and reviews where you have them. The add-to-cart button stays easy to reach on a phone.",
        ],
        figure: {
          image: "/imgs/hero/work-9.webp",
          alt: "Audio store design with a large headphone product image and product cards",
          caption: "From our work: an audio store that leads with the product and keeps browsing simple.",
          bg: "#eef0f0",
        },
      },
      {
        title: "Payments, shipping and checkout",
        nav: "Payments and checkout",
        body: [
          "We set up the payment methods your customers trust in the UAE and India, shipping zones and rates, and taxes. Checkout is kept short, with costs shown early so nothing surprises the buyer at the last step.",
        ],
      },
      {
        title: "Catalogue, feeds and ads",
        body: [
          "Your products are synced to Meta and Google catalogues, so you can run shopping and dynamic ads that show each person the products they viewed. The feed stays in step with your stock and prices.",
        ],
      },
      {
        title: "WhatsApp order updates",
        body: [
          "Customers get order confirmations and delivery updates on WhatsApp, where they already read their messages. Fewer \"where is my order?\" calls, and a channel to bring buyers back for their next order.",
        ],
      },
      {
        title: "Launch and growing sales",
        nav: "Launch and growth",
        body: [
          "We test orders end to end before launch, then help you grow: ads, retargeting, abandoned-cart reminders and a monthly look at what sells and what doesn't.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- WhatsApp
  {
    slug: "whatsapp-automation",
    name: "WhatsApp automation",
    title: "WhatsApp automation: every enquiry answered, even at 2 a.m.",
    description:
      "How Skalebee sets up the official WhatsApp Business Platform with chatbots, click-to-WhatsApp ads, broadcasts and lead handoff, for businesses in the UAE and India.",
    category: "Automation",
    artwork: "conversations",
    tint: "#9edbb4",
    info: [
      MARKETS,
      { label: "Team", value: "Meta Certified Business Messaging Strategist" },
      { label: "Platform", value: "WhatsApp Business Platform" },
    ],
    summary: [
      {
        label: "Problem",
        value: "Enquiries arrive at all hours and wait hours for a reply.",
      },
      {
        label: "What you get",
        value: "Instant replies, collected details and hot leads passed to your team.",
      },
      {
        label: "Availability",
        value: "Replies 24/7, including weekends and holidays.",
      },
    ],
    hero: {
      image: "/imgs/home/services/conversations.webp",
      alt: "Illustration of a person chatting on a phone, with chat bubbles flowing into a calendar, email and a contact card",
    },
    sections: [
      {
        title: "What WhatsApp automation is",
        nav: "What it is",
        body: [
          "Your customers already message on WhatsApp. We set up the official WhatsApp Business Platform with chatbots and automations that reply instantly, collect details, send updates and pass hot leads to your team, even at 2 a.m.",
          "It is the same WhatsApp your customers use every day, with your verified business name on it.",
        ],
      },
      {
        title: "The cost of a slow reply",
        body: [
          "A lead who messages and waits will often message a competitor too. Most businesses can't staff WhatsApp around the clock, so evening and weekend enquiries go cold before anyone sees them.",
        ],
      },
      {
        title: "Setting up the WhatsApp Business Platform",
        nav: "Platform setup",
        body: [
          "We set up the official WhatsApp Business Platform (the WhatsApp Business API) for your number, verify your business with Meta and connect it to a shared inbox, so several people on your team can reply from one number.",
        ],
      },
      {
        title: "Designing the chatbot flows",
        nav: "Chatbot flows",
        body: [
          "We map the questions you get every day, then build flows that answer them: prices, locations, opening hours, availability. The bot collects the details your team needs, like name, need and budget, and books appointments where it makes sense.",
          "A person can step in at any point, and the bot always offers a way to reach one.",
        ],
        figure: {
          images: [
            {
              image: "/imgs/brand/whatsapp-automation.webp",
              alt: "Illustration of a phone with WhatsApp messages, a clock and a shopping cart",
              bg: "#111111",
            },
            {
              image: "/imgs/home/coffee.webp",
              alt: "Coffee being served, the kind of moment a customer sends a quick message",
            },
          ],
          caption: "Messages in, replies out, at any hour. The bot handles the routine; your team handles the sale.",
        },
      },
      {
        title: "Click-to-WhatsApp ads",
        body: [
          "Facebook and Instagram ads can open a WhatsApp chat instead of a website. We run these ads and connect them to your flows, so a person who taps the ad gets an instant, relevant reply instead of a blank chat.",
        ],
      },
      {
        title: "Broadcasts that people welcome",
        nav: "Broadcasts",
        body: [
          "With your customers' permission, we send offers, launches and reminders as WhatsApp broadcasts. Lists are segmented, so people only get messages that matter to them, and every message follows WhatsApp's rules to keep your number in good standing.",
        ],
      },
      {
        title: "Handing hot leads to your team",
        nav: "Lead handoff",
        body: [
          "When a lead is ready to buy, the conversation goes straight to the right person with the details already collected. Simple follow-up scripts help your team close, and each month we review which flows bring the most sales.",
        ],
      },
    ],
  },
];

// ---------- helpers ----------

// Section ids for the sidebar links: "01-what-seo-does-for-you" style, unique per page.
export const sectionId = (section, index) =>
  `${String(index + 1).padStart(2, "0")}-${section.title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

export const servicePath = (slug) => `/services/${slug}`;

export const getServicePage = (slug) => SERVICE_PAGES.find((s) => s.slug === slug);

// About 200 words a minute, rounded up.
export const readMinutes = (page) => {
  const text = [
    page.title,
    ...page.summary.map((s) => s.value),
    ...page.sections.flatMap((s) => [s.title, ...s.body]),
  ].join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
};

export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
