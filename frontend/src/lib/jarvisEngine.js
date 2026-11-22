// Rule-based "brain" for the J.A.R.V.I.S. demo. Pure functions so they are easy to test.

const WORD_OPS = [
  [/\bmultiplied by\b|\btimes\b|\bx\b/g, "*"],
  [/\bdivided by\b|\bover\b/g, "/"],
  [/\bplus\b|\band\b/g, "+"],
  [/\bminus\b|\bless\b/g, "-"],
  [/\bto the power of\b|\bpower\b/g, "^"],
  [/\bmod(ulo)?\b/g, "%"],
];

// Tiny recursive-descent evaluator: + - * / % ^ ( ) and unary minus. Never uses eval().
export function evaluateMath(input) {
  const src = String(input).replace(/\s+/g, "");
  if (!src || !/^[\d+\-*/%^().]+$/.test(src)) return null;
  let i = 0;
  const peek = () => src[i];
  const number = () => {
    const m = /^\d*\.?\d+/.exec(src.slice(i));
    if (!m) throw new Error("num");
    i += m[0].length;
    return parseFloat(m[0]);
  };
  const factor = () => {
    if (peek() === "-") { i++; return -factor(); }
    if (peek() === "+") { i++; return factor(); }
    if (peek() === "(") {
      i++;
      const v = expr();
      if (peek() !== ")") throw new Error("paren");
      i++;
      return v;
    }
    return number();
  };
  const power = () => {
    const base = factor();
    if (peek() === "^") { i++; return Math.pow(base, power()); }
    return base;
  };
  const term = () => {
    let v = power();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = src[i++];
      const r = power();
      v = op === "*" ? v * r : op === "/" ? v / r : v % r;
    }
    return v;
  };
  const expr = () => {
    let v = term();
    while (peek() === "+" || peek() === "-") {
      const op = src[i++];
      const r = term();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  };
  try {
    const v = expr();
    if (i !== src.length || !Number.isFinite(v)) return null;
    return v;
  } catch {
    return null;
  }
}

const SECTIONS = {
  home: "home", about: "about", skills: "skills", projects: "projects", contact: "contact", github: "github",
};
const PAGES = {
  dashboard: "/dashboard", "e-learning": "/elearning", elearning: "/elearning", learning: "/elearning",
  shop: "/shop", store: "/shop", tasks: "/tasks", "task manager": "/tasks", kanban: "/tasks",
  healthcare: "/healthcare", hospital: "/healthcare", weather: "/weather", forecast: "/weather",
};

export const JOKES = [
  "Why do Angular developers love dependency injection? Because they hate making their own problems.",
  "There are 10 kinds of people: those who understand binary and those who don't.",
  "I would tell you a UDP joke, but you might not get it.",
  "A RxJS developer walks into a bar and subscribes to the bartender. Now he can't stop getting drinks.",
  "Why was the TypeScript developer calm? Everything was strongly typed, even the feelings.",
];

export const HELP_TEXT =
  "Try: what time is it, what's the date, tell me a joke, calculate 12 times 8, " +
  "open projects, open the shop, show the weather, or who is Gaurav.";

export function parseCommand(raw, { now = new Date(), rng = Math.random } = {}) {
  const text = String(raw || "").trim();
  const t = text.toLowerCase().replace(/[?!.,]+$/g, "");
  if (!t) return { intent: "empty", reply: "I'm listening. Say or type a command." };

  if (/^(hi|hello|hey|yo|good (morning|afternoon|evening))\b/.test(t))
    return { intent: "greeting", reply: "Hello! J.A.R.V.I.S. online and at your service. How can I help?" };

  if (/\b(thank(s| you)|cheers)\b/.test(t))
    return { intent: "thanks", reply: "Always a pleasure." };

  if (/\b(help|what can you do|commands)\b/.test(t))
    return { intent: "help", reply: HELP_TEXT };

  if (/\b(time)\b/.test(t) && !/\bsometimes?\b/.test(t))
    return { intent: "time", reply: `It's ${now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.` };

  if (/\b(date|today|day is it)\b/.test(t))
    return {
      intent: "date",
      reply: `Today is ${now.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`,
    };

  if (/\bjoke\b|\bmake me laugh\b/.test(t))
    return { intent: "joke", reply: JOKES[Math.floor(rng() * JOKES.length)] };

  if (/\bwho (is|are) (gaurav|the developer|you)\b|\babout (gaurav|you)\b|\bwho made you\b/.test(t))
    return {
      intent: "about",
      reply: "I'm J.A.R.V.I.S., a voice assistant built with Angular by Gaurav Gaur, an Angular frontend developer.",
    };

  // Navigation: "open the shop", "go to projects", "show weather"
  const nav = /\b(open|show|go to|take me to|launch|navigate to)\b\s*(the |my )?(.+)$/.exec(t);
  if (nav) {
    const target = nav[3].replace(/\b(page|section|demo|app|please)\b/g, "").trim();
    for (const [key, id] of Object.entries(SECTIONS))
      if (target.includes(key)) return { intent: "navigate", reply: `Taking you to ${key}.`, action: { type: "scroll", id } };
    for (const [key, to] of Object.entries(PAGES))
      if (target.includes(key)) return { intent: "navigate", reply: `Opening ${key}.`, action: { type: "navigate", to } };
  }

  // Math: "calculate 12 times 8", "what is 5 plus 3", or a bare expression like 2*(3+4)
  const mathCandidate = t
    .replace(/\b(calculate|compute|what is|what's|whats|how much is|equals|solve)\b/g, "")
    .replace(/(\d),(?=\d{3})/g, "$1");
  let expression = mathCandidate;
  for (const [re, op] of WORD_OPS) expression = expression.replace(re, ` ${op} `);
  if (/\d/.test(expression) && /[+\-*/%^]/.test(expression)) {
    const result = evaluateMath(expression);
    if (result !== null) {
      const pretty = Number.isInteger(result) ? String(result) : String(parseFloat(result.toFixed(6)));
      return { intent: "math", reply: `That's ${pretty}.` };
    }
  }

  return { intent: "unknown", reply: "I didn't catch that. Say \"help\" to hear what I can do." };
}
