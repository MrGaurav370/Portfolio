// Fallback content. Used when the backend is unavailable (e.g. static hosting on GitHub Pages).
// Keep in sync with backend/seed_data.py.

export const profileData = {
  name: "Gaurav Gaur",
  title: "Angular Frontend Developer",
  tagline: "Building modern, scalable web applications with Angular",
  bio: "Passionate frontend engineer with 2+ years of experience building robust web applications with Angular. Specialized in Angular, TypeScript, RxJS and responsive design. I turn complex problems into elegant, user-friendly solutions.",
  email: "grvsinghthakur370@gmail.com",
  github: "https://github.com/MrGaurav370",
  linkedin: "https://www.linkedin.com/in/gauravgaur007/",
  twitter: "",
  phone: "+91 7982300419",
  location: "India",
};

export const skills = [
  { id: 1, category: "Angular Core", items: ["Components", "Directives", "Services", "Dependency Injection", "Modules"] },
  { id: 2, category: "State Management", items: ["Signals", "Observables", "BehaviorSubject"] },
  { id: 3, category: "UI & Styling", items: ["Angular Material", "SCSS", "Responsive Design", "Flex Layout"] },
  { id: 4, category: "TypeScript & Tools", items: ["TypeScript", "Angular CLI", "Git & GitHub"] },
];

const img = (id) => `https://images.unsplash.com/${id}?w=800&h=600&fit=crop`;

export const projects = [
  {
    id: 1,
    title: "J.A.R.V.I.S. Voice Assistant",
    description: "An Angular voice assistant that listens, understands and responds to spoken commands, with a local LLM brain via Ollama in the works.",
    technologies: ["Angular", "TypeScript", "Web Speech API", "Ollama"],
    image: img("photo-1620712943543-bcc4688e7485"),
    demoUrl: "", githubUrl: "https://github.com/MrGaurav370/jarvis-project", route: "/jarvis", featured: true,
  },
  {
    id: 2,
    title: "Enterprise Dashboard",
    description: "Admin dashboard with data visualisation, user management and analytics built around Chart.js.",
    technologies: ["Angular", "TypeScript", "NgRx", "Chart.js"],
    image: img("photo-1551288049-bebda4e38f71"),
    demoUrl: "", githubUrl: "", route: "/dashboard", featured: true,
  },
  {
    id: 3,
    title: "E-Learning Platform",
    description: "Course catalogue, course detail pages, progress tracking and assessments.",
    technologies: ["Angular", "RxJS", "Angular Material", "Firebase"],
    image: img("photo-1501504905252-473c47e087f8"),
    demoUrl: "", githubUrl: "", route: "/elearning", featured: true,
  },
  {
    id: 4,
    title: "Shopping Cart Application",
    description: "E-commerce front end with product catalogue, cart and a multi-step checkout.",
    technologies: ["Angular", "NgRx Store", "Angular Material", "Stripe"],
    image: img("photo-1557821552-17105176677c"),
    demoUrl: "", githubUrl: "", route: "/shop", featured: true,
  },
  {
    id: 5,
    title: "Task Management System",
    description: "Kanban-style task manager with drag-and-drop and real-time collaboration.",
    technologies: ["Angular", "Angular CDK", "NgRx", "WebSocket"],
    image: img("photo-1454165804606-c3d57bc86b40"),
    demoUrl: "", githubUrl: "", route: "/tasks", featured: false,
  },
  {
    id: 6,
    title: "Healthcare Portal",
    description: "Patient management with appointment scheduling, records and prescriptions.",
    technologies: ["Angular", "PrimeNG", "RxJS", "REST API"],
    image: img("photo-1576091160399-112ba8d25d1d"),
    demoUrl: "", githubUrl: "", route: "/healthcare", featured: false,
  },
  {
    id: 7,
    title: "Weather Forecast App",
    description: "Location-based forecasts, interactive maps and weather alerts.",
    technologies: ["Angular", "RxJS", "Leaflet", "OpenWeather API"],
    image: img("photo-1592210454359-9043f067919b"),
    demoUrl: "", githubUrl: "", route: "/weather", featured: false,
  },
];
