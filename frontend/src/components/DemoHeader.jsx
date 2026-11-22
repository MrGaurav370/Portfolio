import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

// Sticky header shared by the demo pages. Collapses to icon + title on phones.
const DemoHeader = ({ icon: Icon, title, subtitle, backTo = "/", backLabel = "Back to Portfolio", children }) => (
  <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-40">
    <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link to={backTo}>
            <Button variant="outline" aria-label={backLabel}
              className="border-[#2a2a2a] bg-transparent text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff] hover:bg-transparent px-3 sm:px-4">
              <ArrowLeft size={16} className="sm:mr-2" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <div className="hidden min-[420px]:block p-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded">
              <Icon className="text-[#00d9ff]" size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold truncate text-white">{title}</h1>
              {subtitle && <p className="hidden sm:block text-sm text-gray-400 truncate">{subtitle}</p>}
            </div>
          </div>
        </div>
        {children && <div className="shrink-0 flex items-center gap-2">{children}</div>}
      </div>
    </div>
  </div>
);

export default DemoHeader;
