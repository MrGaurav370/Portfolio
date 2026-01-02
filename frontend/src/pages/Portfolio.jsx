import React, { useState } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Navigation from "../components/Navigation";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <footer className="bg-[#1a1a1a] border-t border-[#2a2a2a] py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>© 2025 Alex Chen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
