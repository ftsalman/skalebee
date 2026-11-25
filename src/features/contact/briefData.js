// Copy for the 4-step brief form on the Contact page. Edit freely.
export const BRIEF = {
  title: "Have a project in mind?",
  muted: "Tell us in 4 quick steps.",
  note: "No call needed to start.",
  // Chat bubble on the left (types itself in)
  message: ["We read every brief ourselves.", "You’ll hear back within 24 hours."],
  signature: "Skalebee team",
  // Popup header, depending on which button opened it
  modal: {
    general: { title: "Have a project in mind?", muted: "Tell us in 4 quick steps." },
    call: { title: "Book a free call.", muted: "4 quick steps, then we set up the call." },
    proposal: { title: "Get a free proposal.", muted: "4 quick steps, then we send your plan." },
  },
  steps: [
    {
      key: "service",
      question: "What can we help you with?",
      options: ["Meta Ads", "Google Ads", "Website or landing page", "SEO", "WhatsApp automation", "Something else"],
    },
    {
      key: "start",
      question: "When would you like to start?",
      options: ["As soon as possible", "Within a month", "In 1 to 3 months", "Just exploring"],
    },
    {
      key: "budget",
      question: "Roughly what’s your monthly budget?",
      options: ["Under ₹50K", "₹50K to ₹2L", "₹2L+", "Not sure yet"],
    },
    { key: "contact", question: "Where can we reach you?" },
  ],
  fields: {
    name: "Name",
    email: "Email",
    about: "About your project (optional)",
    aboutPlaceholder: "What are you selling? A link helps",
  },
  error: "Add your name and a working email.",
  submit: "Send a brief",
  sending: "Sending…",
  privacy: "By sending, you agree to our",
  privacyLink: "privacy notice",
  // {name} is replaced with the visitor's first name
  thanks: "Thanks {name}! We’ll reply within 24 hours.",
  delivered: "Delivered · just now",
};
