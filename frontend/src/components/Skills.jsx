import React from "react";
import { skills } from "../mock";

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Angular Background Elements */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#00d9ff]/5 transform rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] border border-[#00d9ff]/10 transform rotate-45 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#00d9ff] font-semibold tracking-wider uppercase text-sm">Technical Skills</span>
          <div className="w-20 h-1 bg-[#00d9ff] mt-2 mx-auto transform -skew-x-12"></div>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-white">
            My <span className="text-[#00d9ff]">Expertise</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillCategory) => (
            <div
              key={skillCategory.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 transform transition-all duration-300 hover:border-[#00d9ff]/50 hover:-translate-y-2 group relative overflow-hidden"
            >
              {/* Angular Top Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00d9ff] to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              {/* Diagonal Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d9ff]/5 transform rotate-45 translate-x-16 -translate-y-16 group-hover:bg-[#00d9ff]/10 transition-all duration-300"></div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold text-[#00d9ff] mb-4">{skillCategory.category}</h3>
                <ul className="space-y-3">
                  {skillCategory.items.map((skill, index) => (
                    <li
                      key={index}
                      className="text-gray-300 flex items-center gap-2 group/item"
                    >
                      <div className="w-2 h-2 bg-[#00d9ff] transform rotate-45 group-hover/item:rotate-90 transition-transform duration-300"></div>
                      <span className="group-hover/item:text-white group-hover/item:translate-x-1 transition-all duration-300">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
