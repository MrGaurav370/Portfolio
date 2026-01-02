import React from "react";
import { profileData } from "../mock";
import { Code2, Zap, Users } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: <Code2 size={32} />,
      title: "5+ Years",
      description: "Professional Experience"
    },
    {
      icon: <Zap size={32} />,
      title: "50+ Projects",
      description: "Successfully Delivered"
    },
    {
      icon: <Users size={32} />,
      title: "Happy Clients",
      description: "Worldwide"
    }
  ];

  return (
    <section id="about" className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      {/* Angular Background */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] border border-[#00d9ff]/10 transform rotate-45 translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div>
            <div className="mb-6">
              <span className="text-[#00d9ff] font-semibold tracking-wider uppercase text-sm">About Me</span>
              <div className="w-20 h-1 bg-[#00d9ff] mt-2 transform -skew-x-12"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
              Turning Ideas Into
              <span className="text-[#00d9ff]"> Reality</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              {profileData.bio}
            </p>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.
            </p>
          </div>

          {/* Right Side - Highlights */}
          <div className="grid gap-6">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="bg-[#0a0a0a] border border-[#2a2a2a] p-6 transform transition-all duration-300 hover:border-[#00d9ff]/50 hover:translate-x-2 group relative overflow-hidden"
              >
                {/* Angular Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#00d9ff]/5 transform rotate-45 translate-x-10 -translate-y-10 group-hover:bg-[#00d9ff]/10 transition-all duration-300"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="text-[#00d9ff] group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
