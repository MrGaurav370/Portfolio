import { deriveAlerts, describeCode, normalizeForecast, sampleForecast } from "./weather";

test("describeCode maps known codes and falls back", () => {
  expect(describeCode(0)).toEqual({ label: "Clear sky", icon: "sun" });
  expect(describeCode(95).icon).toBe("storm");
  expect(describeCode(63).label).toBe("Rain");
  expect(describeCode(12345).label).toBe("Unknown");
});

test("deriveAlerts flags storms, heat and wind, and stays quiet otherwise", () => {
  const calm = { code: 1, tempC: 25, windKmh: 10 };
  expect(deriveAlerts(calm, [{ code: 1 }])).toEqual([]);
  expect(deriveAlerts(calm, [{ code: 95 }])[0].level).toBe("severe");
  expect(deriveAlerts({ ...calm, tempC: 41 }, [{ code: 0 }])[0].text).toMatch(/heat/i);
  expect(deriveAlerts({ ...calm, windKmh: 60 }, [{ code: 0 }])[0].text).toMatch(/wind/i);
});

test("imperial values are converted before thresholds are applied", () => {
  // 104F = 40C -> heat alert; 40 mph ~ 64 km/h -> wind alert
  const raw = sampleForecastRaw(104, 40);
  const f = normalizeForecast(raw, { name: "X" }, "imperial");
  expect(f.alerts.map((a) => a.text).join(" ")).toMatch(/heat/i);
  expect(f.alerts.map((a) => a.text).join(" ")).toMatch(/wind/i);
});

test("normalizeForecast shapes 7 days and up to 24 hours", () => {
  const f = sampleForecast(undefined, "metric", new Date("2026-11-22T10:30:00Z"));
  expect(f.daily).toHaveLength(7);
  expect(f.hourly.length).toBeGreaterThan(0);
  expect(f.hourly.length).toBeLessThanOrEqual(24);
  expect(f.current.temp).toBe(30);
  expect(f.daily[0]).toEqual(expect.objectContaining({ max: expect.any(Number), min: expect.any(Number) }));
});

function sampleForecastRaw(temp, wind) {
  return {
    current: { time: "2026-11-22T10:00", temperature_2m: temp, apparent_temperature: temp, relative_humidity_2m: 40, wind_speed_10m: wind, weather_code: 0 },
    daily: { time: ["2026-11-22"], weather_code: [0], temperature_2m_max: [temp], temperature_2m_min: [temp - 10], precipitation_probability_max: [0] },
    hourly: { time: ["2026-11-22T10:00"], temperature_2m: [temp], weather_code: [0] },
  };
}
