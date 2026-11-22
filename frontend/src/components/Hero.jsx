import React, { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Twitter, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { usePortfolio } from "../context/PortfolioContext";

const ROLES = ["Angular Developer", "TypeScript Engineer", "RxJS Enthusiast", "UI Craftsman"];

// Types out and deletes each role in turn; shows the first role statically for reduced motion.
const useTyped = (words) => {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    let w = 0, i = 0, deleting = false, timer;
    const tick = () => {
      const word = words[w];
      i += deleting ? -1 : 1;
      setText(word.slice(0, i));
      let delay = deleting ? 40 : 80;
      if (!deleting && i === word.length) { deleting = true; delay = 1600; }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
      timer = setTimeout(tick, delay);
    };
    i = words[0].length; deleting = true;
    timer = setTimeout(tick, 1600);
    return () => clearTimeout(timer);
  }, [words]);
  return text;
};

const Hero = () => {
  const { profile } = usePortfolio();
  const role = useTyped(ROLES);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const socials = [
    { href: profile.github, label: "GitHub", Icon: Github },
    { href: profile.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: profile.twitter, label: "Twitter", Icon: Twitter },
    { href: profile.email && `mailto:${profile.email}`, label: "Email", Icon: Mail },
  ].filter((s) => s.href);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00d9ff]/5 transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00d9ff]/5 transform rotate-45 -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] border border-[#00d9ff]/10 transform rotate-45"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <div className="mb-6">
            <div className="inline-block px-4 py-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] text-sm font-medium transform -skew-x-6">
              <span className="inline-block transform skew-x-6 uppercase tracking-wide" aria-live="off">
                {role}<span className="animate-pulse">|</span>
              </span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-white">Hi, I'm </span>
            <span className="text-[#00d9ff] relative inline-block">
              {profile.name}
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#00d9ff] transform -skew-x-12"></div>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl">{profile.tagline}</p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Button onClick={() => go("projects")}
              className="bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold px-8 py-6 transform transition-all duration-300 hover:scale-105 hover:-skew-x-6">
              View Projects
            </Button>
            <Button onClick={() => go("contact")} variant="outline"
              className="border-[#00d9ff] text-[#00d9ff] bg-transparent hover:bg-[#00d9ff]/10 hover:text-[#00d9ff] font-semibold px-8 py-6 transform transition-all duration-300 hover:scale-105">
              Get in Touch
            </Button>
          </div>

          <div className="flex gap-6">
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} aria-label={label}
                target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00d9ff] transition-all duration-300 hover:scale-110">
                <Icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => go("about")} aria-label="Scroll to About"
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 text-gray-500 hover:text-[#00d9ff] animate-bounce hidden md:block">
        <ArrowDown size={24} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#1a1a1a] transform origin-top-left -skew-y-2" aria-hidden="true"></div>
    </section>
  );
};

export default Hero;
