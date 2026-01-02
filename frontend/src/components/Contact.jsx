import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { Toaster } from "./ui/toaster";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (will be replaced with backend integration)
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <Toaster />
      
      {/* Angular Background Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00d9ff]/5 transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] border border-[#00d9ff]/10 transform rotate-45 -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#00d9ff] font-semibold tracking-wider uppercase text-sm">Get In Touch</span>
          <div className="w-20 h-1 bg-[#00d9ff] mt-2 mx-auto transform -skew-x-12"></div>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-white">
            Let's <span className="text-[#00d9ff]">Connect</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-3 group-hover:border-[#00d9ff]/50 transition-all duration-300">
                  <Mail className="text-[#00d9ff]" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <a href="mailto:grvsinghthakur370@gmail.com" className="text-gray-400 hover:text-[#00d9ff] transition-colors duration-300">
                    grvsinghthakur370@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-3 group-hover:border-[#00d9ff]/50 transition-all duration-300">
                  <Phone className="text-[#00d9ff]" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Phone</h4>
                  <p className="text-gray-400">+91 7982300419</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-3 group-hover:border-[#00d9ff]/50 transition-all duration-300">
                  <MapPin className="text-[#00d9ff]" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Location</h4>
                  <p className="text-gray-400">India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 relative overflow-hidden group hover:border-[#00d9ff]/50 transition-all duration-300">
            {/* Angular Corner Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d9ff]/5 transform rotate-45 translate-x-16 -translate-y-16 group-hover:bg-[#00d9ff]/10 transition-all duration-300"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label htmlFor="name" className="text-white font-semibold mb-2 block">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-[#0a0a0a] border-[#2a2a2a] text-white focus:border-[#00d9ff] focus:ring-[#00d9ff]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-white font-semibold mb-2 block">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-[#0a0a0a] border-[#2a2a2a] text-white focus:border-[#00d9ff] focus:ring-[#00d9ff]"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="text-white font-semibold mb-2 block">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="bg-[#0a0a0a] border-[#2a2a2a] text-white focus:border-[#00d9ff] focus:ring-[#00d9ff]"
                  placeholder="Project inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-white font-semibold mb-2 block">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="bg-[#0a0a0a] border-[#2a2a2a] text-white focus:border-[#00d9ff] focus:ring-[#00d9ff] resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold py-6 transform transition-all duration-300 hover:scale-105"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
