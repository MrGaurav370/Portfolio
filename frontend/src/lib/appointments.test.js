import { bookAppointment, cancelAppointment, isSlotPast, isSlotTaken, nextDays, toISODate } from "./appointments";

const now = new Date(2026, 10, 22, 12, 0); // Sun 22 Nov 2026 12:00
const base = { doctorId: "d1", date: "2026-11-23", time: "10:00", patient: "Asha", reason: "Checkup" };

test("nextDays returns consecutive ISO dates starting today", () => {
  const days = nextDays(3, now);
  expect(days.map((d) => d.iso)).toEqual(["2026-11-22", "2026-11-23", "2026-11-24"]);
  expect(days[0].weekday).toBe(0);
});
test("books a free slot and trims the name", () => {
  const r = bookAppointment([], { ...base, patient: "  Asha " }, now);
  expect(r.ok).toBe(true);
  expect(r.appointment).toMatchObject({ patient: "Asha", status: "confirmed" });
});
test("prevents double booking, but allows the slot again after cancelling", () => {
  const first = bookAppointment([], base, now);
  const dup = bookAppointment(first.appointments, { ...base, patient: "Other" }, now);
  expect(dup.ok).toBe(false);
  expect(dup.error).toMatch(/taken/);
  const freed = cancelAppointment(first.appointments, first.appointment.id);
  expect(isSlotTaken(freed, "d1", "2026-11-23", "10:00")).toBe(false);
  expect(bookAppointment(freed, base, now).ok).toBe(true);
});
test("a different doctor can book the same time", () => {
  const first = bookAppointment([], base, now);
  expect(bookAppointment(first.appointments, { ...base, doctorId: "d2" }, now).ok).toBe(true);
});
test("rejects past slots today, missing fields and blank names", () => {
  expect(isSlotPast("2026-11-22", "11:30", now)).toBe(true);
  expect(isSlotPast("2026-11-22", "14:00", now)).toBe(false);
  expect(isSlotPast("2026-11-23", "09:00", now)).toBe(false);
  expect(bookAppointment([], { ...base, date: "2026-11-22", time: "09:00" }, now).ok).toBe(false);
  expect(bookAppointment([], { ...base, patient: " " }, now).ok).toBe(false);
  expect(bookAppointment([], { ...base, time: "" }, now).ok).toBe(false);
  expect(toISODate(new Date(2026, 0, 5))).toBe("2026-01-05");
});
