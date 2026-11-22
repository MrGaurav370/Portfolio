import React, { useReducer, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, KanbanSquare, Plus, RotateCcw, Trash2 } from "lucide-react";
import DemoHeader from "../components/DemoHeader";
import { COLUMNS, PRIORITIES, initialTasks, kanbanReducer, taskStats } from "../lib/kanban";

const KEY = "demo.tasks.v1";
const load = () => {
  try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : initialTasks; } catch { return initialTasks; }
};
const PRIORITY_STYLE = {
  high: "text-red-400 border-red-400/40 bg-red-400/10",
  medium: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  low: "text-green-400 border-green-400/40 bg-green-400/10",
};

const Tasks = () => {
  const [tasks, dispatch] = useReducer(kanbanReducer, undefined, load);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [query, setQuery] = useState("");
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);
  const stats = taskStats(tasks);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch { /* ignore */ } }, [tasks]);

  const add = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({ type: "add", title, priority });
    setTitle("");
  };
  const visible = (col) => tasks.filter((t) => t.column === col && t.title.toLowerCase().includes(query.toLowerCase()));
  const drop = (e, column, beforeId = null) => {
    e.preventDefault(); e.stopPropagation();
    if (dragId) dispatch({ type: "move", id: dragId, column, beforeId });
    setDragId(null); setOverCol(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <DemoHeader icon={KanbanSquare} title="Task Manager" subtitle="Kanban board with drag & drop">
        <button onClick={() => dispatch({ type: "reset" })} aria-label="Reset demo data"
          className="flex items-center gap-2 px-3 py-2 text-sm border border-[#2a2a2a] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff]">
          <RotateCcw size={16} /><span className="hidden sm:inline">Reset</span>
        </button>
      </DemoHeader>

      <main className="container mx-auto px-4 sm:px-6 py-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{stats.done} of {stats.total} tasks done</span><span className="text-[#00d9ff] font-semibold">{stats.percent}%</span>
          </div>
          <div className="h-2 bg-[#0a0a0a]" role="progressbar" aria-valuenow={stats.percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-[#00d9ff] transition-all duration-500" style={{ width: `${stats.percent}%` }} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={add} className="flex flex-1 gap-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task…" aria-label="New task title" maxLength={80}
              className="flex-1 min-w-0 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-[#00d9ff]" />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority"
              className="bg-[#1a1a1a] border border-[#2a2a2a] px-2 text-gray-300">
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <button type="submit" aria-label="Add task" className="px-4 bg-[#00d9ff] text-black font-semibold hover:bg-[#00b8e6] disabled:opacity-40" disabled={!title.trim()}>
              <Plus size={20} />
            </button>
          </form>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" aria-label="Search tasks"
            className="sm:w-56 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-[#00d9ff]" />
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {COLUMNS.map((col, ci) => {
            const items = visible(col.id);
            return (
              <section key={col.id} aria-label={col.title}
                onDragOver={(e) => { e.preventDefault(); setOverCol(col.id); }}
                onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
                onDrop={(e) => drop(e, col.id)}
                className={`bg-[#1a1a1a] border p-3 sm:p-4 min-h-[140px] transition-colors ${overCol === col.id ? "border-[#00d9ff]" : "border-[#2a2a2a]"}`}>
                <h2 className="font-bold mb-3 flex items-center justify-between">
                  {col.title}<span className="text-xs text-gray-400 bg-[#0a0a0a] px-2 py-0.5">{items.length}</span>
                </h2>
                <div className="space-y-3">
                  {items.map((t) => (
                    <article key={t.id} draggable onDragStart={(e) => { setDragId(t.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", t.id); }}
                      onDragEnd={() => { setDragId(null); setOverCol(null); }} onDrop={(e) => drop(e, col.id, t.id)}
                      className={`bg-[#0a0a0a] border border-[#2a2a2a] p-3 cursor-grab active:cursor-grabbing hover:border-[#00d9ff]/50 ${dragId === t.id ? "opacity-40" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold leading-snug break-words min-w-0">{t.title}</h3>
                        <button onClick={() => dispatch({ type: "remove", id: t.id })} aria-label={`Delete ${t.title}`} className="text-gray-500 hover:text-red-400 shrink-0"><Trash2 size={16} /></button>
                      </div>
                      {t.desc && <p className="text-sm text-gray-400 mt-1">{t.desc}</p>}
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-xs px-2 py-0.5 border capitalize ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span>
                        <div className="flex gap-1">
                          <button onClick={() => dispatch({ type: "shift", id: t.id, dir: -1 })} disabled={ci === 0} aria-label={`Move ${t.title} left`}
                            className="p-1.5 border border-[#2a2a2a] text-gray-300 hover:text-[#00d9ff] hover:border-[#00d9ff] disabled:opacity-25 disabled:hover:text-gray-300 disabled:hover:border-[#2a2a2a]"><ChevronLeft size={16} /></button>
                          <button onClick={() => dispatch({ type: "shift", id: t.id, dir: 1 })} disabled={ci === COLUMNS.length - 1} aria-label={`Move ${t.title} right`}
                            className="p-1.5 border border-[#2a2a2a] text-gray-300 hover:text-[#00d9ff] hover:border-[#00d9ff] disabled:opacity-25 disabled:hover:text-gray-300 disabled:hover:border-[#2a2a2a]"><ChevronRight size={16} /></button>
                        </div>
                      </div>
                    </article>
                  ))}
                  {items.length === 0 && <p className="text-sm text-gray-600 text-center py-4">{query ? "No matches" : "Drop tasks here"}</p>}
                </div>
              </section>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-gray-500 text-center">Drag cards between columns, or use the arrows on touch screens. Saved in your browser only.</p>
      </main>
    </div>
  );
};

export default Tasks;
