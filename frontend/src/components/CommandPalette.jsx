import React, { useCallback, useEffect, useState } from "react";
import { Command } from "cmdk";
import { useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Code2, Copy, ExternalLink, FolderGit2, Github, Home, Linkedin, Mail, Mouse, PlayCircle, Search, User } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export const OPEN_PALETTE_EVENT = "open-command-palette";

const SECTIONS = [
  { id: "home", label: "Home", icon: Home }, { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Code2 }, { id: "projects", label: "Projects", icon: Briefcase },
  { id: "github", label: "Open source (GitHub)", icon: FolderGit2 }, { id: "contact", label: "Contact", icon: Mouse },
];

const itemClass = "flex items-center gap-3 px-3 py-2.5 text-gray-300 cursor-pointer data-[selected=true]:bg-[#00d9ff]/15 data-[selected=true]:text-white";
const headingClass = "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#00d9ff]";

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { profile, projects } = usePortfolio();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener(OPEN_PALETTE_EVENT, onOpen); };
  }, []);

  const run = useCallback((fn) => { setOpen(false); setTimeout(fn, 50); }, []);
  const toSection = (id) => run(() => {
    if (pathname === "/") document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    else { navigate("/"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 400); }
  });
  const external = (url) => run(() => window.open(url, "_blank", "noopener,noreferrer"));
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard blocked */ }
  };

  const demos = projects.filter((p) => p.route);

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Command palette"
      overlayClassName="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
      contentClassName={`fixed z-[101] top-[12%] left-1/2 -translate-x-1/2 w-[92vw] max-w-lg bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl text-white ${headingClass}`}>
      <div className="flex items-center gap-3 px-4 border-b border-[#2a2a2a]">
        <Search size={18} className="text-gray-500" />
        <Command.Input placeholder="Jump to a section, demo or link…" className="flex-1 bg-transparent py-4 outline-none placeholder-gray-500" />
        <kbd className="hidden sm:block text-xs text-gray-500 border border-[#2a2a2a] px-1.5 py-0.5">Esc</kbd>
      </div>
      <Command.List className="max-h-[50vh] overflow-y-auto p-2">
        <Command.Empty className="py-8 text-center text-gray-500">Nothing found.</Command.Empty>
        <Command.Group heading="Sections">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <Command.Item key={id} value={`section ${label}`} onSelect={() => toSection(id)} className={itemClass}><Icon size={18} className="text-[#00d9ff]" />{label}</Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading="Live demos">
          {demos.map((p) => (
            <Command.Item key={p.id} value={`demo ${p.title} ${p.technologies.join(" ")}`} onSelect={() => run(() => navigate(p.route))} className={itemClass}>
              <PlayCircle size={18} className="text-[#00d9ff]" /><span className="truncate">{p.title}</span>
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading="Links">
          {profile.github && <Command.Item value="github profile" onSelect={() => external(profile.github)} className={itemClass}><Github size={18} className="text-[#00d9ff]" />GitHub profile<ExternalLink size={14} className="ml-auto text-gray-500" /></Command.Item>}
          {profile.linkedin && <Command.Item value="linkedin profile" onSelect={() => external(profile.linkedin)} className={itemClass}><Linkedin size={18} className="text-[#00d9ff]" />LinkedIn<ExternalLink size={14} className="ml-auto text-gray-500" /></Command.Item>}
          {profile.email && <Command.Item value="send email" onSelect={() => run(() => { window.location.href = `mailto:${profile.email}`; })} className={itemClass}><Mail size={18} className="text-[#00d9ff]" />Send an email</Command.Item>}
          {profile.email && <Command.Item value="copy email address" onSelect={copyEmail} className={itemClass}><Copy size={18} className="text-[#00d9ff]" />{copied ? "Copied!" : "Copy email address"}</Command.Item>}
        </Command.Group>
      </Command.List>
      <div className="px-4 py-2 border-t border-[#2a2a2a] text-xs text-gray-500 flex justify-between"><span>↑↓ navigate · ↵ select</span><span>Ctrl/⌘ + K</span></div>
    </Command.Dialog>
  );
};

export default CommandPalette;
