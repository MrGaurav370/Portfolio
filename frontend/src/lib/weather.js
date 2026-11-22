// Open-Meteo client (no API key) + pure helpers for the weather demo.
const GEO = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST = "https://api.open-meteo.com/v1/forecast";

const CODES = [
  [[0], "Clear sky", "sun"],
  [[1, 2], "Partly cloudy", "cloud-sun"],
  [[3], "Overcast", "cloud"],
  [[45, 48], "Fog", "fog"],
  [[51, 53, 55, 56, 57], "Drizzle", "drizzle"],
  [[61, 63, 65, 66, 67], "Rain", "rain"],
  [[71, 73, 75, 77], "Snow", "snow"],
  [[80, 81, 82], "Rain showers", "rain"],
  [[85, 86], "Snow showers", "snow"],
  [[95, 96, 99], "Thunderstorm", "storm"],
];

export function describeCode(code) {
  const hit = CODES.find(([codes]) => codes.includes(code));
  return hit ? { label: hit[1], icon: hit[2] } : { label: "Unknown", icon: "cloud" };
}

// Turns raw numbers into human alerts. Thresholds use metric units (celsius / km/h).
export function deriveAlerts(current, daily) {
  const alerts = [];
  const todayCode = daily[0]?.code ?? current.code;
  if ([95, 96, 99].includes(todayCode) || [95, 96, 99].includes(current.code))
    alerts.push({ level: "severe", text: "Thunderstorms expected. Stay indoors if possible." });
  else if ([65, 66, 67, 82].includes(todayCode)) alerts.push({ level: "warn", text: "Heavy rain expected today." });
  if ([71, 73, 75, 77, 85, 86].includes(todayCode)) alerts.push({ level: "warn", text: "Snowfall expected today." });
  if (current.tempC >= 38) alerts.push({ level: "warn", text: "Extreme heat. Drink water and avoid midday sun." });
  if (current.tempC <= -10) alerts.push({ level: "warn", text: "Extreme cold. Dress in layers." });
  if (current.windKmh >= 50) alerts.push({ level: "warn", text: "Strong winds. Secure loose objects." });
  return alerts;
}

export function normalizeForecast(raw, place, unit = "metric") {
  const c = raw.current;
  const current = {
    temp: Math.round(c.temperature_2m),
    tempC: unit === "imperial" ? ((c.temperature_2m - 32) * 5) / 9 : c.temperature_2m,
    feels: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    wind: Math.round(c.wind_speed_10m),
    windKmh: unit === "imperial" ? c.wind_speed_10m * 1.60934 : c.wind_speed_10m,
    code: c.weather_code,
  };
  const daily = raw.daily.time.map((date, i) => ({
    date,
    code: raw.daily.weather_code[i],
    max: Math.round(raw.daily.temperature_2m_max[i]),
    min: Math.round(raw.daily.temperature_2m_min[i]),
    rain: raw.daily.precipitation_probability_max?.[i] ?? 0,
  }));
  // next 24 hours starting from the current hour
  const nowIdx = Math.max(0, raw.hourly.time.findIndex((t) => t >= c.time.slice(0, 13)));
  const hourly = raw.hourly.time.slice(nowIdx, nowIdx + 24).map((time, i) => ({
    time,
    temp: Math.round(raw.hourly.temperature_2m[nowIdx + i]),
    code: raw.hourly.weather_code[nowIdx + i],
  }));
  return { place, unit, current, daily, hourly, alerts: deriveAlerts(current, daily) };
}

export async function searchPlaces(query, signal) {
  const res = await fetch(`${GEO}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`, { signal });
  if (!res.ok) throw new Error("geocoding failed");
  const data = await res.json();
  return (data.results || []).map((r) => ({
    name: r.name, region: [r.admin1, r.country].filter(Boolean).join(", "), lat: r.latitude, lon: r.longitude,
  }));
}

export async function fetchForecast(place, unit = "metric", signal) {
  const params = new URLSearchParams({
    latitude: place.lat, longitude: place.lon, timezone: "auto", forecast_days: "7",
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    hourly: "temperature_2m,weather_code",
    temperature_unit: unit === "imperial" ? "fahrenheit" : "celsius",
    wind_speed_unit: unit === "imperial" ? "mph" : "kmh",
  });
  const res = await fetch(`${FORECAST}?${params}`, { signal });
  if (!res.ok) throw new Error("forecast failed");
  return normalizeForecast(await res.json(), place, unit);
}

export const DEFAULT_PLACE = { name: "New Delhi", region: "Delhi, India", lat: 28.6139, lon: 77.209 };

// Offline sample so the demo still renders if the API is unreachable.
export function sampleForecast(place = DEFAULT_PLACE, unit = "metric", now = new Date()) {
  const base = unit === "imperial" ? 86 : 30;
  const iso = (d) => d.toISOString().slice(0, 10);
  const raw = {
    current: { time: now.toISOString().slice(0, 16), temperature_2m: base, apparent_temperature: base + 2, relative_humidity_2m: 55, wind_speed_10m: 12, weather_code: 1 },
    daily: {
      time: Array.from({ length: 7 }, (_, i) => iso(new Date(now.getTime() + i * 864e5))),
      weather_code: [1, 2, 3, 61, 1, 0, 2],
      temperature_2m_max: [0, 1, -1, -3, 2, 3, 1].map((d) => base + d + 2),
      temperature_2m_min: [0, 1, -1, -3, 2, 3, 1].map((d) => base + d - 8),
      precipitation_probability_max: [5, 10, 30, 70, 10, 0, 15],
    },
    hourly: {
      time: Array.from({ length: 30 }, (_, i) => new Date(now.getTime() + (i - 2) * 36e5).toISOString().slice(0, 13) + ":00"),
      temperature_2m: Array.from({ length: 30 }, (_, i) => base - 4 + Math.round(4 * Math.sin(i / 3.8))),
      weather_code: Array.from({ length: 30 }, (_, i) => (i % 9 < 5 ? 1 : 2)),
    },
  };
  return normalizeForecast(raw, place, unit);
}
