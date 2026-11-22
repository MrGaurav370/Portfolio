import { evaluateMath, parseCommand } from "./jarvisEngine";

const fixed = new Date(2026, 10, 22, 15, 5);
const ask = (s) => parseCommand(s, { now: fixed, rng: () => 0 });

describe("evaluateMath", () => {
  test("precedence, parens, unary minus and power", () => {
    expect(evaluateMath("2+3*4")).toBe(14);
    expect(evaluateMath("(2+3)*4")).toBe(20);
    expect(evaluateMath("-5+10")).toBe(5);
    expect(evaluateMath("2^3^2")).toBe(512);
    expect(evaluateMath("10/4")).toBe(2.5);
  });
  test("rejects unsafe or invalid input (never evals code)", () => {
    expect(evaluateMath("alert(1)")).toBeNull();
    expect(evaluateMath("1/0")).toBeNull();
    expect(evaluateMath("2+")).toBeNull();
    expect(evaluateMath("(2+3")).toBeNull();
    expect(evaluateMath("")).toBeNull();
  });
});

describe("parseCommand", () => {
  test("time and date use the injected clock", () => {
    expect(ask("what time is it?").reply).toMatch(/3:05/);
    expect(ask("what's the date").reply).toMatch(/November 22, 2026/);
  });
  test("spoken math", () => {
    expect(ask("calculate 12 times 8").reply).toBe("That's 96.");
    expect(ask("what is 5 plus 3").reply).toBe("That's 8.");
    expect(ask("100 divided by 8").reply).toBe("That's 12.5.");
    expect(ask("2*(3+4)").reply).toBe("That's 14.");
  });
  test("navigation to sections and demos", () => {
    expect(ask("open projects").action).toEqual({ type: "scroll", id: "projects" });
    expect(ask("open the shop").action).toEqual({ type: "navigate", to: "/shop" });
    expect(ask("show me the weather").action).toEqual({ type: "navigate", to: "/weather" });
    expect(ask("go to task manager").action).toEqual({ type: "navigate", to: "/tasks" });
  });
  test("jokes, greeting, about, help, fallback", () => {
    expect(ask("tell me a joke").intent).toBe("joke");
    expect(ask("hello").intent).toBe("greeting");
    expect(ask("who is gaurav").reply).toMatch(/Angular/);
    expect(ask("help").intent).toBe("help");
    expect(ask("blorp zxq").intent).toBe("unknown");
    expect(ask("   ").intent).toBe("empty");
  });
});
