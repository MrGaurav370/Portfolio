export const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "In Progress" },
  { id: "done", title: "Done" },
];
export const PRIORITIES = ["low", "medium", "high"];

export const initialTasks = [
  { id: "t1", title: "Design onboarding flow", desc: "Wireframes for the first-run experience", priority: "high", column: "todo" },
  { id: "t2", title: "Set up CI pipeline", desc: "Lint, test and build on every PR", priority: "medium", column: "todo" },
  { id: "t3", title: "Build Kanban drag & drop", desc: "Native HTML5 drag events plus touch buttons", priority: "high", column: "doing" },
  { id: "t4", title: "Write API docs", desc: "", priority: "low", column: "doing" },
  { id: "t5", title: "Project kickoff", desc: "Agree scope and milestones", priority: "medium", column: "done" },
];

let counter = 0;
export const newId = () => `t${Date.now().toString(36)}${(counter++).toString(36)}`;

// Moves a task to `column`, placed before `beforeId` (or at the end of that column).
export function moveTask(tasks, id, column, beforeId = null) {
  const task = tasks.find((t) => t.id === id);
  if (!task || !COLUMNS.some((c) => c.id === column) || id === beforeId) return tasks;
  const rest = tasks.filter((t) => t.id !== id);
  const moved = { ...task, column };
  const idx = beforeId ? rest.findIndex((t) => t.id === beforeId) : -1;
  if (idx === -1) {
    // after the last task already in that column (keeps column grouping stable)
    let last = -1;
    rest.forEach((t, i) => { if (t.column === column) last = i; });
    rest.splice(last + 1, 0, moved);
  } else {
    rest.splice(idx, 0, moved);
  }
  return rest;
}

// Shift a task one column left (-1) or right (+1).
export function shiftTask(tasks, id, dir) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return tasks;
  const i = COLUMNS.findIndex((c) => c.id === task.column) + dir;
  if (i < 0 || i >= COLUMNS.length) return tasks;
  return moveTask(tasks, id, COLUMNS[i].id);
}

export function kanbanReducer(tasks, action) {
  switch (action.type) {
    case "add": {
      const title = (action.title || "").trim();
      if (!title) return tasks;
      const priority = PRIORITIES.includes(action.priority) ? action.priority : "medium";
      return [...tasks, { id: newId(), title, desc: action.desc || "", priority, column: "todo" }];
    }
    case "move": return moveTask(tasks, action.id, action.column, action.beforeId);
    case "shift": return shiftTask(tasks, action.id, action.dir);
    case "remove": return tasks.filter((t) => t.id !== action.id);
    case "edit": return tasks.map((t) => (t.id === action.id ? { ...t, ...action.changes, title: (action.changes.title ?? t.title).trim() || t.title } : t));
    case "reset": return initialTasks;
    default: return tasks;
  }
}

export function taskStats(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.column === "done").length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}
