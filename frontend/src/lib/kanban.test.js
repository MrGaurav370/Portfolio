import { initialTasks, kanbanReducer, moveTask, shiftTask, taskStats } from "./kanban";

const col = (tasks, c) => tasks.filter((t) => t.column === c).map((t) => t.id);

test("move to another column appends it after that column's last task", () => {
  const out = moveTask(initialTasks, "t1", "done");
  expect(col(out, "done")).toEqual(["t5", "t1"]);
  expect(col(out, "todo")).toEqual(["t2"]);
  expect(out).toHaveLength(initialTasks.length);
});
test("move before a specific card reorders within the column", () => {
  const out = moveTask(initialTasks, "t2", "todo", "t1");
  expect(col(out, "todo")).toEqual(["t2", "t1"]);
});
test("moving into an empty column works", () => {
  const out = moveTask([{ id: "a", title: "A", column: "todo" }], "a", "done");
  expect(out[0].column).toBe("done");
});
test("invalid moves are ignored", () => {
  expect(moveTask(initialTasks, "nope", "done")).toBe(initialTasks);
  expect(moveTask(initialTasks, "t1", "bogus")).toBe(initialTasks);
});
test("shift left/right stops at the edges", () => {
  expect(shiftTask(initialTasks, "t1", -1)).toBe(initialTasks);
  expect(shiftTask(initialTasks, "t5", 1)).toBe(initialTasks);
  expect(shiftTask(initialTasks, "t1", 1).find((t) => t.id === "t1").column).toBe("doing");
});
test("add trims, ignores blank, defaults bad priority", () => {
  expect(kanbanReducer(initialTasks, { type: "add", title: "   " })).toBe(initialTasks);
  const out = kanbanReducer(initialTasks, { type: "add", title: "  New  ", priority: "weird" });
  const added = out[out.length - 1];
  expect(added).toMatchObject({ title: "New", priority: "medium", column: "todo" });
});
test("edit, remove, reset and stats", () => {
  expect(kanbanReducer(initialTasks, { type: "edit", id: "t1", changes: { title: "  X " } }).find((t) => t.id === "t1").title).toBe("X");
  expect(kanbanReducer(initialTasks, { type: "edit", id: "t1", changes: { title: "  " } }).find((t) => t.id === "t1").title).toBe("Design onboarding flow");
  expect(kanbanReducer(initialTasks, { type: "remove", id: "t1" })).toHaveLength(4);
  expect(kanbanReducer([], { type: "reset" })).toBe(initialTasks);
  expect(taskStats(initialTasks)).toEqual({ total: 5, done: 1, percent: 20 });
  expect(taskStats([])).toEqual({ total: 0, done: 0, percent: 0 });
});
