import SpecialtyPage from "../../components/SpecialtyPage";

const specialty = {
  slug: "blood-bank",
  name: "Blood Bank",
  department: "Blood Bank",
  subtitle: "Safe, timely blood and transfusion support at Medical Center Hospital Chattagram",
  description:
    "The Blood Bank at Medical Center Hospital Chattagram provides safe blood collection, testing, storage, and transfusion support. Our trained team follows strict quality procedures so patients receive compatible blood products when they need them.",
  doctorDescription: "Experienced transfusion medicine and blood-bank specialists",
  defaultCoverImage: "https://images.unsplash.com/photo-1615461066841-6116e61058f4",
  features: [
    { title: "24/7 Blood Availability", text: "Rapid coordination of safe blood and blood components for emergency and planned patient care." },
    { title: "Donor Screening", text: "Careful donor assessment and collection procedures to help protect both donors and recipients." },
    { title: "Blood Grouping & Cross-Matching", text: "Compatibility testing before transfusion to support safe, appropriate treatment." },
    { title: "Component Therapy", text: "Preparation and supply of red cells, plasma, and platelets based on individual patient needs." },
  ],
  fallbackDoctors: [
    { id: "blood-bank-1", name: "Blood Bank Specialist", specialization: "Transfusion Medicine", degrees: "MBBS, Diploma in Transfusion Medicine", designation: "Consultant", institute: "Medical Center Hospital Chattagram", experience_years: 10, room_no: "Blood Bank", visiting_time: "24 Hours", phone: "+8809610-818888" },
  ],
};

export default function BloodBankPage() {
  return <SpecialtyPage specialty={specialty} />;
}
