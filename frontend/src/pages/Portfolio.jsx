import React, { useEffect, useState } from "react";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Navigation from "../components/Navigation";
import GithubRepos from "../components/GithubRepos";
import ScrollProgress from "../components/ScrollProgress";
import { usePortfolio } from "../context/PortfolioContext";

const Portfolio = () => {
  const { profile } = usePortfolio();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    document.title = `${profile.name} | ${profile.title}`;
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-[#00d9ff] focus:text-black focus:px-4 focus:py-2">
        Skip to content
      </a>
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GithubRepos />
        <Contact />
      </main>
      <footer className="bg-[#1a1a1a] border-t border-[#2a2a2a] py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div className="flex gap-5">
            {profile.github && <a href={profile.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="hover:text-[#00d9ff]"><Github size={20} /></a>}
            {profile.linkedin && <a href={profile.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="hover:text-[#00d9ff]"><Linkedin size={20} /></a>}
            {profile.email && <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-[#00d9ff]"><Mail size={20} /></a>}
          </div>
        </div>
      </footer>
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 bg-[#00d9ff]/90 text-black p-2.5 md:p-3 hover:bg-[#00b8e6] transition-colors"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Portfolio;
