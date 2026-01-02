import React, { useState } from "react";
import { projects } from "../mock";
import { ExternalLink, Github, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Projects = () => {
  const [filter, setFilter] = useState("all");

  const filteredProjects = filter === "featured" 
    ? projects.filter(p => p.featured) 
    : projects;

  return (
    <section id="projects" className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      {/* Angular Background */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] border border-[#00d9ff]/10 transform rotate-45 -translate-x-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#00d9ff] font-semibold tracking-wider uppercase text-sm">Portfolio</span>
          <div className="w-20 h-1 bg-[#00d9ff] mt-2 mx-auto transform -skew-x-12"></div>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-white">
            Featured <span className="text-[#00d9ff]">Projects</span>
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105 ${
              filter === "all"
                ? "bg-[#00d9ff] text-black"
                : "bg-[#0a0a0a] text-gray-400 border border-[#2a2a2a] hover:border-[#00d9ff]/50"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter("featured")}
            className={`px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105 ${
              filter === "featured"
                ? "bg-[#00d9ff] text-black"
                : "bg-[#0a0a0a] text-gray-400 border border-[#2a2a2a] hover:border-[#00d9ff]/50"
            }`}
          >
            Featured
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#0a0a0a] border border-[#2a2a2a] overflow-hidden transform transition-all duration-300 hover:border-[#00d9ff]/50 hover:-translate-y-2 group relative"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                {/* Angular Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black p-3 transform hover:scale-110 transition-transform duration-300"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black p-3 transform hover:scale-110 transition-transform duration-300"
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6 relative">
                {/* Angular Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#00d9ff]/5 transform rotate-45 translate-x-10 -translate-y-10 group-hover:bg-[#00d9ff]/10 transition-all duration-300"></div>
                
                {project.featured && (
                  <div className="inline-block px-3 py-1 bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] text-xs font-semibold mb-3 transform -skew-x-6">
                    <span className="inline-block transform skew-x-6">FEATURED</span>
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00d9ff] transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Special Dashboard Link for Enterprise Dashboard */}
                {project.id === 1 && (
                  <Link to="/dashboard">
                    <Button className="w-full bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold mb-2">
                      <Eye size={16} className="mr-2" />
                      View Live Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
