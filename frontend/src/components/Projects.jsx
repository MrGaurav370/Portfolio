import React, { useState } from "react";
import { ExternalLink, Github, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { usePortfolio } from "../context/PortfolioContext";
import Reveal from "./Reveal";

const FILTERS = [
  { id: "all", label: "All Projects", test: () => true },
  { id: "featured", label: "Featured", test: (p) => p.featured },
  { id: "live", label: "Live Demos", test: (p) => p.route || p.demoUrl },
];

const Projects = () => {
  const { projects } = usePortfolio();
  const [filter, setFilter] = useState("all");
  const visible = projects.filter(FILTERS.find((f) => f.id === filter).test);

  return (
    <section id="projects" className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] border border-[#00d9ff]/10 transform rotate-45 -translate-x-1/2" aria-hidden="true"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#00d9ff] font-semibold tracking-wider uppercase text-sm">Portfolio</span>
          <div className="w-20 h-1 bg-[#00d9ff] mt-2 mx-auto transform -skew-x-12"></div>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-white">
            Featured <span className="text-[#00d9ff]">Projects</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 ${
                filter === f.id
                  ? "bg-[#00d9ff] text-black"
                  : "bg-[#0a0a0a] text-gray-400 border border-[#2a2a2a] hover:border-[#00d9ff]/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((project, idx) => (
            <Reveal key={project.id} delay={(idx % 3) * 100} className="h-full">
              <article className="h-full flex flex-col bg-[#0a0a0a] border border-[#2a2a2a] overflow-hidden transition-all duration-300 hover:border-[#00d9ff]/50 hover:-translate-y-2 group relative">
                <div className="relative h-48 overflow-hidden bg-[#111]">
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>

                <div className="p-6 relative flex flex-col flex-1">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#00d9ff]/5 transform rotate-45 translate-x-10 -translate-y-10 group-hover:bg-[#00d9ff]/10 transition-all duration-300" aria-hidden="true"></div>

                  {project.featured && (
                    <div className="self-start px-3 py-1 bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] text-xs font-semibold mb-3 transform -skew-x-6">
                      <span className="inline-block transform skew-x-6">FEATURED</span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00d9ff] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="text-xs px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-col gap-2">
                    {project.route && (
                      <Link to={project.route}>
                        <Button className="w-full bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold">
                          <Eye size={16} className="mr-2" /> View Live Demo
                        </Button>
                      </Link>
                    )}
                    {(project.demoUrl || project.githubUrl) && (
                      <div className="flex gap-2">
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button variant="outline" className="w-full border-[#2a2a2a] bg-transparent text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff] hover:bg-transparent">
                              <ExternalLink size={16} className="mr-2" /> Demo
                            </Button>
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button variant="outline" className="w-full border-[#2a2a2a] bg-transparent text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff] hover:bg-transparent">
                              <Github size={16} className="mr-2" /> Code
                            </Button>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
