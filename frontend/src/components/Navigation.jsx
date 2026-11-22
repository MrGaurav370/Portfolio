import React, { useState, useEffect } from "react";
import { Menu, Search, X } from "lucide-react";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";
import useActiveSection from "../hooks/useActiveSection";

const navLinks = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Skills", id: "skills" },
  { name: "Projects", id: "projects" },
  { name: "Contact", id: "contact" },
];
const ids = navLinks.map((l) => l.id);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const linkClass = (id) =>
    `font-medium transition-colors duration-300 ${
      active === id ? "text-[#00d9ff]" : "text-gray-300 hover:text-[#00d9ff]"
    }`;

  return (
    <nav
      aria-label="Primary"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOpen ? "bg-[#0a0a0a] border-b border-[#2a2a2a]" : isScrolled ? "bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => go("home")} className="text-2xl font-bold" aria-label="Back to top">
            <span className="text-[#00d9ff]">GG</span>
            <span className="text-white">/</span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className={linkClass(l.id)}
                aria-current={active === l.id ? "true" : undefined}>
                {l.name}
              </button>
            ))}
            <button onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))} aria-label="Open command palette"
              className="flex items-center gap-2 text-sm text-gray-400 border border-[#2a2a2a] px-3 py-1.5 hover:border-[#00d9ff] hover:text-[#00d9ff] transition-colors">
              <Search size={14} /><span>Search</span><kbd className="text-xs text-gray-500">Ctrl K</kbd>
            </button>
          </div>

          <button
            className="md:hidden text-white p-2 -mr-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className={`block w-full text-left py-2 ${linkClass(l.id)}`}>
                {l.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
