import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Droplets, LocateFixed, MapPin, Search, Sun, Thermometer, Wind } from "lucide-react";
import DemoHeader from "../components/DemoHeader";
import useLocalStorage from "../hooks/useLocalStorage";
import { DEFAULT_PLACE, describeCode, fetchForecast, sampleForecast, searchPlaces } from "../lib/weather";

const ICONS = { sun: Sun, "cloud-sun": CloudSun, cloud: Cloud, fog: CloudFog, drizzle: CloudDrizzle, rain: CloudRain, snow: CloudSnow, storm: CloudLightning };
const WIcon = ({ code, size = 28, className = "text-[#00d9ff]" }) => { const I = ICONS[describeCode(code).icon] || Cloud; return <I size={size} className={className} />; };
const dayName = (iso, i) => (i === 0 ? "Today" : new Date(iso + "T00:00").toLocaleDateString([], { weekday: "short" }));

const Weather = () => {
  const [place, setPlace] = useLocalStorage("demo.weather.place", DEFAULT_PLACE);
  const [unit, setUnit] = useLocalStorage("demo.weather.unit", "metric");
  const [data, setData] = useState(null);
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState("");
  const abortRef = useRef(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController(); abortRef.current = ctrl;
    setLoading(true);
    try {
      setData(await fetchForecast(place, unit, ctrl.signal)); setOffline(false);
    } catch (e) {
      if (e.name === "AbortError") return;
      setData(sampleForecast(place, unit)); setOffline(true);
    }
    setLoading(false);
  }, [place, unit]);
  useEffect(() => { load(); return () => abortRef.current?.abort(); }, [load]);

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true); setNotice("");
    try {
      const r = await searchPlaces(query.trim());
      setResults(r);
      if (!r.length) setNotice(`No places found for "${query}".`);
    } catch { setNotice("Search is unavailable right now. Check your connection."); }
    setSearching(false);
  };
  const choose = (p) => { setPlace(p); setResults([]); setQuery(""); setNotice(""); };
  const locate = () => {
    if (!navigator.geolocation) return setNotice("Location isn't supported in this browser.");
    navigator.geolocation.getCurrentPosition(
      (pos) => choose({ name: "My location", region: "", lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setNotice("Couldn't get your location. Search for a city instead."),
      { timeout: 8000 });
  };

  const u = unit === "metric" ? { t: "°C", w: "km/h" } : { t: "°F", w: "mph" };
  const bbox = `${place.lon - 0.15},${place.lat - 0.1},${place.lon + 0.15},${place.lat + 0.1}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <DemoHeader icon={CloudSun} title="Weather Forecast" subtitle="Live data from Open-Meteo">
        <div className="flex border border-[#2a2a2a]" role="group" aria-label="Units">
          {[["metric", "°C"], ["imperial", "°F"]].map(([k, l]) => (
            <button key={k} onClick={() => setUnit(k)} aria-pressed={unit === k} className={`px-3 py-2 text-sm font-semibold ${unit === k ? "bg-[#00d9ff] text-black" : "text-gray-300 hover:text-[#00d9ff]"}`}>{l}</button>
          ))}
        </div>
      </DemoHeader>

      <main className="container mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={search} className="flex gap-2 mb-2 max-w-2xl">
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a city…" aria-label="Search a city"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] pl-9 pr-3 py-3 placeholder-gray-500 focus:outline-none focus:border-[#00d9ff]" />
          </div>
          <button type="submit" disabled={searching} className="px-5 bg-[#00d9ff] text-black font-semibold hover:bg-[#00b8e6] disabled:opacity-50">{searching ? "…" : "Search"}</button>
          <button type="button" onClick={locate} aria-label="Use my location" className="px-3 border border-[#2a2a2a] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff]"><LocateFixed size={20} /></button>
        </form>
        {notice && <p role="status" className="text-sm text-yellow-400 mb-2">{notice}</p>}
        {results.length > 0 && (
          <ul className="max-w-2xl bg-[#1a1a1a] border border-[#2a2a2a] mb-4 divide-y divide-[#2a2a2a]">
            {results.map((r) => (
              <li key={`${r.lat},${r.lon}`}><button onClick={() => choose(r)} className="w-full text-left px-4 py-3 hover:bg-[#00d9ff]/10 flex items-center gap-2"><MapPin size={16} className="text-[#00d9ff] shrink-0" /><span>{r.name}<span className="text-gray-400">{r.region && `, ${r.region}`}</span></span></button></li>
            ))}
          </ul>
        )}

        {offline && <p role="status" className="mb-4 text-sm bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 px-4 py-2">Couldn't reach the weather service, so you're seeing sample data. <button onClick={load} className="underline">Retry</button></p>}

        {!data ? <p className="text-gray-500 py-16 text-center animate-pulse">Loading forecast…</p> : (
          <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
            {data.alerts.map((a) => (
              <div key={a.text} role="alert" className={`mb-4 flex items-center gap-3 px-4 py-3 border ${a.level === "severe" ? "bg-red-500/10 border-red-500/40 text-red-300" : "bg-yellow-400/10 border-yellow-400/30 text-yellow-300"}`}>
                <AlertTriangle size={20} className="shrink-0" />{a.text}
              </div>
            ))}

            <div className="grid lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#0f2a33] border border-[#2a2a2a] p-5 sm:p-6">
                <p className="flex items-center gap-2 text-gray-300"><MapPin size={16} className="text-[#00d9ff]" />{place.name}{place.region && <span className="text-gray-500">, {place.region}</span>}</p>
                <div className="flex items-center gap-4 sm:gap-6 my-4">
                  <WIcon code={data.current.code} size={72} />
                  <div>
                    <p className="text-6xl sm:text-7xl font-black leading-none">{data.current.temp}<span className="text-3xl text-[#00d9ff] align-top">{u.t}</span></p>
                    <p className="text-gray-300 mt-1">{describeCode(data.current.code).label}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2"><Thermometer size={16} className="text-[#00d9ff]" /><span>Feels {data.current.feels}{u.t}</span></div>
                  <div className="flex items-center gap-2"><Droplets size={16} className="text-[#00d9ff]" /><span>{data.current.humidity}%</span></div>
                  <div className="flex items-center gap-2"><Wind size={16} className="text-[#00d9ff]" /><span>{data.current.wind} {u.w}</span></div>
                </div>
              </section>
              <section className="bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden min-h-[220px]" aria-label="Map">
                <iframe title={`Map of ${place.name}`} loading="lazy" className="w-full h-full min-h-[220px] border-0 grayscale invert-[.92] hue-rotate-180"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${place.lat},${place.lon}`} />
              </section>
            </div>

            <section className="mt-6" aria-label="Next 24 hours">
              <h2 className="font-bold mb-3">Next 24 hours</h2>
              <div className="flex gap-3 overflow-x-auto pb-3">
                {data.hourly.map((h, i) => (
                  <div key={h.time} className="shrink-0 w-20 bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center">
                    <p className="text-xs text-gray-400">{i === 0 ? "Now" : h.time.slice(11, 16)}</p>
                    <div className="flex justify-center my-2"><WIcon code={h.code} size={22} /></div>
                    <p className="font-semibold">{h.temp}°</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6" aria-label="7-day forecast">
              <h2 className="font-bold mb-3">7-day forecast</h2>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] divide-y divide-[#2a2a2a]">
                {data.daily.map((d, i) => (
                  <div key={d.date} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-14 sm:w-20 text-gray-300">{dayName(d.date, i)}</span>
                    <WIcon code={d.code} size={22} />
                    <span className="flex-1 text-sm text-gray-400 hidden sm:block">{describeCode(d.code).label}</span>
                    <span className="text-sm text-blue-300 flex items-center gap-1 ml-auto sm:ml-0"><Droplets size={14} />{d.rain}%</span>
                    <span className="w-24 text-right"><span className="font-semibold">{d.max}°</span> <span className="text-gray-500">{d.min}°</span></span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
        <p className="mt-8 text-xs text-gray-500 text-center">Forecast data by Open-Meteo.com · map © OpenStreetMap contributors</p>
      </main>
    </div>
  );
};

export default Weather;
