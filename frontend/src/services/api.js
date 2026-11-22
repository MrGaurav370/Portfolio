import axios from "axios";

// Empty/undefined => no backend configured (static site): the app uses bundled fallback data.
export const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
export const hasBackend = Boolean(BACKEND_URL);

const http = axios.create({ baseURL: `${BACKEND_URL}/api`, timeout: 6000 });

export const api = {
  getProfile: () => http.get("/profile").then((r) => r.data),
  getSkills: () => http.get("/skills").then((r) => r.data),
  getProjects: () => http.get("/projects").then((r) => r.data),
  submitContact: (payload) => http.post("/contact", payload).then((r) => r.data),
};
