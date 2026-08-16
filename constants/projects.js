// constants/projects.js

export const PROJECTS = [
  // --- Figma ---
  {
    id: "ecommerce-ui",
    title: "E-commerce UI",
    category: "figma",
    categoryLabel: "Figma Project",
    summary:
      "A high-fidelity minimalist shopping experience designed for luxury brands. Focused on micro-interactions and seamless navigation.",
    stack: ["Figma", "Auto-layout", "Prototyping", "Design System"],
    color: "#F24E1E",
    bgClass: "bg-white",
    textClass: "text-black",
    liveUrl: "#",
    features: [
      "Modular design tokens and atomic components",
      "Interactive micro-prototypes with smart animate",
      "Fluid responsive breakpoints for desktop and mobile",
    ],
  },
  {
    id: "saas-dashboard",
    title: "SaaS Dashboard",
    category: "figma",
    categoryLabel: "Figma Project",
    summary:
      "A data-intensive management console with dark mode optimization and responsive layout components.",
    stack: ["Figma", "Design Systems", "Iconography", "UI/UX"],
    color: "#1ABCFE",
    bgClass: "bg-white",
    textClass: "text-black",
    liveUrl: "#",
    features: [
      "High-density data visualization widgets",
      "Comprehensive typography hierarchy and color contrast audits",
      "Interactive analytics graphs and telemetry charts",
    ],
  },

  // --- Next.js ---
  {
    id: "blog-platform",
    title: "Blog Platform",
    category: "nextjs",
    categoryLabel: "Next.js Project",
    summary:
      "A full-stack blogging engine with markdown support, dynamic routing, and server-side rendering for optimal SEO.",
    stack: ["Next.js", "Tailwind CSS", "Sanity.io", "TypeScript"],
    color: "#2204ba",
    bgClass: "bg-black",
    textClass: "text-white",
    liveUrl: "#",
    features: [
      "Server-side rendering (SSR) and incremental static regeneration (ISR)",
      "Headless CMS integration with real-time previewing",
      "Optimized Core Web Vitals and dynamic OpenGraph generation",
    ],
  },
  {
    id: "saas-boilerplate",
    title: "SaaS Boilerplate",
    category: "nextjs",
    categoryLabel: "Next.js Project",
    summary:
      "The ultimate starter kit for Next.js developers, featuring authentication, Stripe integration, and global state management.",
    stack: ["Next.js", "Prisma", "Clerk", "Stripe", "PostgreSQL"],
    color: "#f0493a",
    bgClass: "bg-black",
    textClass: "text-white",
    liveUrl: "#",
    features: [
      "Complete subscription tier authentication with Clerk & Stripe webhooks",
      "Type-safe database ORM schema with automated migrations",
      "Ready-to-deploy multi-tenant organization support",
    ],
  },

  // --- React ---
  {
    id: "weather-app",
    title: "Weather App",
    category: "react",
    categoryLabel: "React Project",
    summary:
      "A real-time weather tracking application using OpenWeather API with dynamic glassmorphism effects based on climate.",
    stack: ["React", "GSAP", "API Integration", "Tailwind CSS"],
    color: "#61DAFB",
    bgClass: "bg-brand-blue",
    textClass: "text-white",
    liveUrl: "#",
    features: [
      "Dynamic weather-reactive particle effects using Canvas",
      "Location geolocation auto-detection and 7-day forecast mapping",
      "Glassmorphic design system reacting to daylight cycles",
    ],
  },
  {
    id: "chat-ui",
    title: "Chat UI",
    category: "react",
    categoryLabel: "React Project",
    summary:
      "A smooth, animated messaging interface built with Framer Motion and optimized for mobile-first interactions.",
    stack: ["React", "Framer Motion", "Styled Components", "WebSocket"],
    color: "#a259ff",
    bgClass: "bg-brand-blue",
    textClass: "text-white",
    liveUrl: "#",
    features: [
      "Optimistic UI updates with instant message dispatching",
      "Smooth layout animation physics and swipe-to-reply gestures",
      "Voice memo wave visualization and rich multimedia embedding",
    ],
  },

  // --- Playground ---
  {
    id: "gsap-experiments",
    title: "GSAP Experiments",
    category: "playground",
    categoryLabel: "Creative Playground",
    summary:
      "A collection of complex scroll-triggered animations and mouse-following inertia effects.",
    stack: ["GSAP", "JavaScript", "ScrollTrigger", "Canvas"],
    color: "#ffbf00",
    bgClass: "bg-brand-orange",
    textClass: "text-white",
    liveUrl: "#",
    features: [
      "Multi-layer 3D perspective distortion following cursor physics",
      "Scrubbed kinetic velocity typography timelines",
      "SVG path morphing with custom elastic easing equations",
    ],
  },
];

export const CATEGORIES = {
  figma: PROJECTS.filter((p) => p.category === "figma"),
  nextjs: PROJECTS.filter((p) => p.category === "nextjs"),
  react: PROJECTS.filter((p) => p.category === "react"),
  playground: PROJECTS.filter((p) => p.category === "playground"),
};

export const getProjectById = (id) => {
  return PROJECTS.find((p) => p.id === id) || null;
};
