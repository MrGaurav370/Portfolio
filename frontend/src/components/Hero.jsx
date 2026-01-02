import React from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { profileData } from "../mock";

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Angular Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00d9ff]/5 transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00d9ff]/5 transform rotate-45 -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] border border-[#00d9ff]/10 transform rotate-45"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <div className="mb-6">
            <div className="inline-block px-4 py-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] text-sm font-medium transform -skew-x-6">
              <span className="inline-block transform skew-x-6">ANGULAR DEVELOPER</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-white">Hi, I'm </span>
            <span className="text-[#00d9ff] relative inline-block">
              {profileData.name}
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#00d9ff] transform -skew-x-12"></div>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl">
            {profileData.tagline}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Button
              onClick={() => scrollToSection("projects")}
              className="bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold px-8 py-6 transform transition-all duration-300 hover:scale-105 hover:-skew-x-6"
            >
              View Projects
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              className="border-[#00d9ff] text-[#00d9ff] hover:bg-[#00d9ff]/10 font-semibold px-8 py-6 transform transition-all duration-300 hover:scale-105"
            >
              Get in Touch
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00d9ff] transition-all duration-300 hover:scale-110"
            >
              <Github size={24} />
            </a>
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00d9ff] transition-all duration-300 hover:scale-110"
            >
              <Linkedin size={24} />
            </a>
            <a
              href={profileData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00d9ff] transition-all duration-300 hover:scale-110"
            >
              <Twitter size={24} />
            </a>
            <a
              href={`mailto:${profileData.email}`}
              className="text-gray-400 hover:text-[#00d9ff] transition-all duration-300 hover:scale-110"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Diagonal Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#1a1a1a] transform origin-top-left -skew-y-2"></div>
    </section>
  );
};

export default Hero;
