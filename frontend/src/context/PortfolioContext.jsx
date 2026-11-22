import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, hasBackend } from "../services/api";
import { profileData, skills as mockSkills, projects as mockProjects } from "../mock";

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [state, setState] = useState({
    profile: profileData,
    skills: mockSkills,
    projects: mockProjects,
    source: "fallback", // "api" once live data has loaded
  });

  useEffect(() => {
    if (!hasBackend) return undefined;
    let cancelled = false;
    Promise.all([api.getProfile(), api.getSkills(), api.getProjects()])
      .then(([profile, skills, projects]) => {
        if (!cancelled) setState({ profile, skills, projects, source: "api" });
      })
      .catch(() => {
        /* keep fallback content if the API is down */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside <PortfolioProvider>");
  return ctx;
};
