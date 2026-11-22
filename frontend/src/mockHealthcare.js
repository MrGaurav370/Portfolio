// Fictional sample data for the healthcare portal demo. No real patients.
export const doctors = [
  { id: "d1", name: "Dr. Meera Iyer", specialty: "General Physician", days: [1, 2, 3, 4, 5], rating: 4.9 },
  { id: "d2", name: "Dr. Arjun Rao", specialty: "Cardiologist", days: [1, 3, 5], rating: 4.8 },
  { id: "d3", name: "Dr. Sana Khan", specialty: "Dermatologist", days: [2, 4, 6], rating: 4.7 },
  { id: "d4", name: "Dr. Vikram Shah", specialty: "Orthopedic", days: [1, 2, 4], rating: 4.8 },
  { id: "d5", name: "Dr. Priya Nair", specialty: "Pediatrician", days: [1, 2, 3, 4, 5, 6], rating: 5.0 },
];

export const patients = [
  { id: "p1", name: "Aarav Sharma", age: 34, condition: "Hypertension", lastVisit: "2026-11-02", vitals: { bp: "132/86", hr: 76, temp: "36.7 °C", spo2: "98%" }, notes: "Responding well to medication. Advised to reduce salt intake and walk 30 minutes daily." },
  { id: "p2", name: "Diya Patel", age: 28, condition: "Seasonal allergy", lastVisit: "2026-10-18", vitals: { bp: "118/76", hr: 72, temp: "36.6 °C", spo2: "99%" }, notes: "Symptoms flare in autumn. Continue antihistamine as needed." },
  { id: "p3", name: "Rohan Verma", age: 52, condition: "Type 2 diabetes", lastVisit: "2026-11-10", vitals: { bp: "126/82", hr: 80, temp: "36.8 °C", spo2: "97%" }, notes: "HbA1c improving. Review diet plan at next visit." },
  { id: "p4", name: "Ananya Das", age: 8, condition: "Routine check-up", lastVisit: "2026-09-30", vitals: { bp: "98/62", hr: 90, temp: "36.5 °C", spo2: "99%" }, notes: "Growth on track. Vaccinations up to date." },
  { id: "p5", name: "Kabir Singh", age: 45, condition: "Lower back pain", lastVisit: "2026-11-15", vitals: { bp: "122/80", hr: 74, temp: "36.6 °C", spo2: "98%" }, notes: "Physiotherapy twice a week. Avoid heavy lifting." },
];

export const prescriptions = [
  { id: "rx1", patientId: "p1", medication: "Amlodipine", dose: "5 mg, once daily", refills: 2, doctor: "Dr. Arjun Rao" },
  { id: "rx2", patientId: "p2", medication: "Cetirizine", dose: "10 mg, as needed", refills: 3, doctor: "Dr. Meera Iyer" },
  { id: "rx3", patientId: "p3", medication: "Metformin", dose: "500 mg, twice daily", refills: 1, doctor: "Dr. Meera Iyer" },
  { id: "rx4", patientId: "p5", medication: "Ibuprofen", dose: "400 mg, after meals", refills: 0, doctor: "Dr. Vikram Shah" },
];
