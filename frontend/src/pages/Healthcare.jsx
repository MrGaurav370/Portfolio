import React, { useMemo, useState } from "react";
import { Activity, CalendarCheck, CalendarX, ClipboardList, HeartPulse, Pill, Search, Users } from "lucide-react";
import DemoHeader from "../components/DemoHeader";
import useLocalStorage from "../hooks/useLocalStorage";
import { doctors, patients, prescriptions } from "../mockHealthcare";
import { SLOT_TIMES, bookAppointment, cancelAppointment, doctorWorksOn, isSlotPast, isSlotTaken, nextDays } from "../lib/appointments";

const TABS = [
  { id: "book", label: "Book", icon: CalendarCheck },
  { id: "appointments", label: "Appointments", icon: ClipboardList },
  { id: "patients", label: "Patients", icon: Users },
  { id: "rx", label: "Prescriptions", icon: Pill },
];
const pill = (on) => `px-3 py-2 text-sm font-semibold border transition-colors ${on ? "bg-[#00d9ff] text-black border-[#00d9ff]" : "bg-[#0a0a0a] text-gray-300 border-[#2a2a2a] hover:border-[#00d9ff]/60"}`;

const Healthcare = () => {
  const [tab, setTab] = useState("book");
  const [appointments, setAppointments] = useLocalStorage("demo.health.appts.v1", []);
  const [refills, setRefills] = useLocalStorage("demo.health.refills.v1", {});
  const [doctorId, setDoctorId] = useState(doctors[0].id);
  const days = useMemo(() => nextDays(7), []);
  // Keep the chosen date valid for the doctor: fall back to their next working day.
  const validDate = (doc, current) => {
    const cur = days.find((d) => d.iso === current);
    if (cur && doctorWorksOn(doc, cur.weekday)) return current;
    return (days.find((d) => doctorWorksOn(doc, d.weekday)) || days[0]).iso;
  };
  const [date, setDate] = useState(() => validDate(doctors[0], days[0].iso));
  const [time, setTime] = useState("");
  const [patient, setPatient] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(patients[0].id);

  const doctor = doctors.find((d) => d.id === doctorId);
  const day = days.find((d) => d.iso === date);
  const works = doctorWorksOn(doctor, day.weekday);
  const active = appointments.filter((a) => a.status !== "cancelled");
  const upcoming = [...appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const book = (e) => {
    e.preventDefault();
    const r = bookAppointment(appointments, { doctorId, date, time, patient, reason });
    if (!r.ok) return setMsg({ ok: false, text: r.error });
    setAppointments(r.appointments);
    setMsg({ ok: true, text: `Confirmed: ${doctor.name} on ${day.label} at ${time}.` });
    setTime(""); setPatient(""); setReason("");
  };

  const person = patients.find((p) => p.id === selected);
  const filtered = patients.filter((p) => (p.name + p.condition).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <DemoHeader icon={HeartPulse} title="Healthcare Portal" subtitle="Appointments, records and prescriptions" />
      <main className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Doctors", value: doctors.length, icon: HeartPulse },
            { label: "Patients", value: patients.length, icon: Users },
            { label: "Booked", value: active.length, icon: CalendarCheck },
            { label: "Active Rx", value: prescriptions.length, icon: Activity },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex items-center gap-3">
              <Icon className="text-[#00d9ff]" size={24} />
              <div><p className="text-2xl font-bold leading-none">{value}</p><p className="text-sm text-gray-400 mt-1">{label}</p></div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" role="tablist">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`${pill(tab === id)} flex items-center gap-2 whitespace-nowrap`}>
              <Icon size={16} />{label}
            </button>
          ))}
        </div>

        {tab === "book" && (
          <form onSubmit={book} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-6 min-w-0">
              <div>
                <h2 className="font-bold mb-3">1. Choose a doctor</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {doctors.map((d) => (
                    <button type="button" key={d.id} onClick={() => { setDoctorId(d.id); setDate(validDate(d, date)); setTime(""); setMsg(null); }} aria-pressed={doctorId === d.id}
                      className={`text-left p-4 border transition-colors ${doctorId === d.id ? "border-[#00d9ff] bg-[#00d9ff]/10" : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#00d9ff]/50"}`}>
                      <p className="font-semibold">{d.name}</p>
                      <p className="text-sm text-gray-400">{d.specialty} · ★ {d.rating.toFixed(1)}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-bold mb-3">2. Pick a day</h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {days.map((d) => {
                    const off = !doctorWorksOn(doctor, d.weekday);
                    return (
                      <button type="button" key={d.iso} disabled={off} onClick={() => { setDate(d.iso); setTime(""); setMsg(null); }} aria-pressed={date === d.iso}
                        className={`${pill(date === d.iso)} whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed`}>{d.label}</button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h2 className="font-bold mb-3">3. Pick a time</h2>
                {!works ? <p className="text-gray-500">{doctor.name} doesn't see patients on this day.</p> : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {SLOT_TIMES.map((t) => {
                      const off = isSlotTaken(appointments, doctorId, date, t) || isSlotPast(date, t);
                      return <button type="button" key={t} disabled={off} onClick={() => { setTime(t); setMsg(null); }} aria-pressed={time === t}
                        className={`${pill(time === t)} disabled:opacity-30 disabled:line-through disabled:cursor-not-allowed`}>{t}</button>;
                    })}
                  </div>
                )}
              </div>
            </section>

            <aside className="bg-[#1a1a1a] border border-[#2a2a2a] p-5 h-fit space-y-4 min-w-0">
              <h2 className="font-bold">4. Your details</h2>
              <label className="block text-sm text-gray-400">Patient name
                <input value={patient} onChange={(e) => setPatient(e.target.value)} maxLength={60} required className="mt-1 w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-white focus:outline-none focus:border-[#00d9ff]" />
              </label>
              <label className="block text-sm text-gray-400">Reason (optional)
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} rows={3} className="mt-1 w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2 text-white focus:outline-none focus:border-[#00d9ff] resize-none" />
              </label>
              <div className="text-sm text-gray-400 border-t border-[#2a2a2a] pt-3">
                <p>{doctor.name}</p><p>{day.label}{time && ` · ${time}`}</p>
              </div>
              <button type="submit" disabled={!time} className="w-full py-3 bg-[#00d9ff] text-black font-semibold hover:bg-[#00b8e6] disabled:opacity-40">Confirm appointment</button>
              {msg && <p role="status" className={`text-sm ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>}
            </aside>
          </form>
        )}

        {tab === "appointments" && (
          <section className="space-y-3">
            {upcoming.length === 0 && <p className="text-gray-500 py-10 text-center">No appointments yet. Book one from the Book tab.</p>}
            {upcoming.map((a) => {
              const d = doctors.find((x) => x.id === a.doctorId);
              return (
                <div key={a.id} className={`bg-[#1a1a1a] border border-[#2a2a2a] p-4 flex flex-wrap items-center justify-between gap-3 ${a.status === "cancelled" ? "opacity-50" : ""}`}>
                  <div>
                    <p className="font-semibold">{a.patient} <span className="text-gray-400 font-normal">with {d?.name}</span></p>
                    <p className="text-sm text-gray-400">{new Date(a.date + "T00:00").toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })} at {a.time}{a.reason && ` · ${a.reason}`}</p>
                  </div>
                  {a.status === "cancelled" ? <span className="text-xs uppercase text-red-400">Cancelled</span> : (
                    <button onClick={() => setAppointments(cancelAppointment(appointments, a.id))} className="flex items-center gap-2 text-sm px-3 py-1.5 border border-[#2a2a2a] text-gray-300 hover:border-red-400 hover:text-red-400">
                      <CalendarX size={16} />Cancel
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {tab === "patients" && (
          <section className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patients" aria-label="Search patients" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#00d9ff]" />
              </div>
              {filtered.map((p) => (
                <button key={p.id} onClick={() => setSelected(p.id)} aria-pressed={selected === p.id}
                  className={`w-full text-left p-4 border ${selected === p.id ? "border-[#00d9ff] bg-[#00d9ff]/10" : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#00d9ff]/50"}`}>
                  <p className="font-semibold">{p.name}</p><p className="text-sm text-gray-400">{p.age} yrs · {p.condition}</p>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-gray-500 text-sm">No patients match.</p>}
            </div>
            {person && (
              <div className="lg:col-span-3 bg-[#1a1a1a] border border-[#2a2a2a] p-5 h-fit">
                <h2 className="text-xl font-bold">{person.name}</h2>
                <p className="text-gray-400 mb-4">{person.age} years · {person.condition} · last visit {person.lastVisit}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[["Blood pressure", person.vitals.bp], ["Heart rate", `${person.vitals.hr} bpm`], ["Temperature", person.vitals.temp], ["SpO₂", person.vitals.spo2]].map(([k, v]) => (
                    <div key={k} className="bg-[#0a0a0a] border border-[#2a2a2a] p-3"><p className="text-xs text-gray-500">{k}</p><p className="font-semibold text-[#00d9ff]">{v}</p></div>
                  ))}
                </div>
                <h3 className="font-semibold mb-1">Clinical notes</h3>
                <p className="text-gray-300">{person.notes}</p>
              </div>
            )}
          </section>
        )}

        {tab === "rx" && (
          <section className="grid md:grid-cols-2 gap-4">
            {prescriptions.map((r) => {
              const p = patients.find((x) => x.id === r.patientId);
              const requested = refills[r.id];
              return (
                <div key={r.id} className="bg-[#1a1a1a] border border-[#2a2a2a] p-5">
                  <div className="flex items-center gap-2 mb-1"><Pill size={18} className="text-[#00d9ff]" /><h2 className="font-bold">{r.medication}</h2></div>
                  <p className="text-gray-300">{r.dose}</p>
                  <p className="text-sm text-gray-400 mt-1">{p?.name} · prescribed by {r.doctor}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-400">{r.refills} refill{r.refills === 1 ? "" : "s"} left</span>
                    {r.refills === 0 ? <span className="text-xs text-yellow-400">Needs new prescription</span> : (
                      <button disabled={requested} onClick={() => setRefills({ ...refills, [r.id]: true })}
                        className="text-sm px-3 py-1.5 bg-[#00d9ff] text-black font-semibold hover:bg-[#00b8e6] disabled:bg-[#2a2a2a] disabled:text-gray-400">
                        {requested ? "Refill requested ✓" : "Request refill"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}
        <p className="mt-8 text-xs text-gray-500 text-center">Demo with fictional data. Bookings are saved in your browser only, and nothing is sent anywhere.</p>
      </main>
    </div>
  );
};

export default Healthcare;
