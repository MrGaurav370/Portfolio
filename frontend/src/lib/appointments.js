// Pure helpers for the healthcare demo's appointment booking.
export const SLOT_TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

export const toISODate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function nextDays(count = 7, from = new Date()) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    return { iso: toISODate(d), weekday: d.getDay(), label: d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" }) };
  });
}

export const doctorWorksOn = (doctor, weekday) => doctor.days.includes(weekday);

export const isSlotTaken = (appointments, doctorId, date, time) =>
  appointments.some((a) => a.doctorId === doctorId && a.date === date && a.time === time && a.status !== "cancelled");

// A slot earlier today is no longer bookable.
export function isSlotPast(date, time, now = new Date()) {
  if (date !== toISODate(now)) return false;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
}

export function bookAppointment(appointments, appt, now = new Date()) {
  const { doctorId, date, time, patient } = appt;
  if (!patient || !patient.trim()) return { ok: false, error: "Please enter the patient name." };
  if (!doctorId || !date || !time) return { ok: false, error: "Choose a doctor, date and time." };
  if (isSlotPast(date, time, now)) return { ok: false, error: "That time has already passed." };
  if (isSlotTaken(appointments, doctorId, date, time)) return { ok: false, error: "That slot was just taken. Pick another time." };
  const created = { ...appt, patient: patient.trim(), id: `a${Date.now().toString(36)}${appointments.length}`, status: "confirmed" };
  return { ok: true, appointment: created, appointments: [...appointments, created] };
}

export const cancelAppointment = (appointments, id) =>
  appointments.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a));
