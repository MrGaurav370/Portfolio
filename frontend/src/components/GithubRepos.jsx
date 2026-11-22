import React, { useEffect, useState } from "react";
import { FolderGit2, GitFork, Star, Users } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import Reveal from "./Reveal";

const LANG_COLORS = { JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c", Python: "#3572A5", SCSS: "#c6538c", Java: "#b07219", Dart: "#00B4AB" };
const TTL = 10 * 60 * 1000; // cache so we stay well under GitHub's unauthenticated rate limit

const usernameFrom = (url = "") => /github\.com\/([^/?#]+)/i.exec(url)?.[1] || null;

async function load(user) {
  const key = `gh.${user}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key));
    if (cached && Date.now() - cached.at < TTL) return cached.data;
  } catch { /* no cache */ }
  const [u, r] = await Promise.all([
    fetch(`https://api.github.com/users/${user}`),
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`),
  ]);
  if (!u.ok || !r.ok) throw new Error("github");
  const profile = await u.json();
  const repos = (await r.json())
    .filter((x) => !x.fork && !x.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6)
    .map((x) => ({ id: x.id, name: x.name, url: x.html_url, description: x.description, language: x.language, stars: x.stargazers_count, forks: x.forks_count, pushed: x.pushed_at }));
  const data = { repos, publicRepos: profile.public_repos, followers: profile.followers };
  try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch { /* ignore */ }
  return data;
}

const timeAgo = (iso) => {
  const days = Math.floor((Date.now() - new Date(iso)) / 864e5);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

// Renders nothing if GitHub can't be reached or the user has no public repos.
const GithubRepos = () => {
  const { profile } = usePortfolio();
  const user = usernameFrom(profile.github);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return undefined;
    let cancelled = false;
    load(user).then((d) => !cancelled && setData(d)).catch(() => {});
    return () => { cancelled = true; };
  }, [user]);

  if (!data || data.repos.length === 0) return <div id="github" />;

  return (
    <section id="github" className="py-16 md:py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-[#00d9ff] font-semibold tracking-wider uppercase text-sm">Open Source</span>
          <div className="w-20 h-1 bg-[#00d9ff] mt-2 mx-auto transform -skew-x-12"></div>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-white">Latest on <span className="text-[#00d9ff]">GitHub</span></h2>
          <div className="flex justify-center gap-6 mt-6 text-gray-400">
            <span className="flex items-center gap-2"><FolderGit2 size={18} className="text-[#00d9ff]" />{data.publicRepos} public repos</span>
            <span className="flex items-center gap-2"><Users size={18} className="text-[#00d9ff]" />{data.followers} followers</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.repos.map((r, i) => (
            <Reveal key={r.id} delay={(i % 3) * 100} className="h-full">
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                className="h-full flex flex-col bg-[#1a1a1a] border border-[#2a2a2a] p-5 hover:border-[#00d9ff]/50 hover:-translate-y-1 transition-all duration-300 group">
                <h3 className="font-bold text-white group-hover:text-[#00d9ff] break-words">{r.name}</h3>
                <p className="text-sm text-gray-400 mt-2 mb-4 flex-1">{r.description || "No description yet."}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                  {r.language && <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: LANG_COLORS[r.language] || "#00d9ff" }} />{r.language}</span>}
                  <span className="flex items-center gap-1"><Star size={14} />{r.stars}</span>
                  <span className="flex items-center gap-1"><GitFork size={14} />{r.forks}</span>
                  <span className="ml-auto">{timeAgo(r.pushed)}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GithubRepos;
