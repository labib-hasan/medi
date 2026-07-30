import SpecialtyPage from "../../components/SpecialtyPage";

const specialty = {
  slug: "anesthesia",
  name: "Anesthesia",
  department: "Anesthesia",
  subtitle: "Safe anesthesia and perioperative care at Medical Center Hospital Chattagram",
  description:
    "The Anesthesia Department at Medical Center Hospital Chattagram provides comprehensive care before, during, and after surgery. Our anesthesiologists tailor anesthesia plans, closely monitor patients throughout procedures, and support safe, comfortable recovery.",
  doctorDescription: "Experienced anesthesiologists and perioperative care specialists",
  defaultCoverImage: "https://images.unsplash.com/photo-1516549655669-df1b7c5e8d20",
  features: [
    { title: "Pre-Anesthesia Assessment", text: "Individual assessment and planning to prepare patients safely for surgery or procedures." },
    { title: "General & Regional Anesthesia", text: "Appropriate anesthesia techniques selected for each procedure and patient condition." },
    { title: "Continuous Monitoring", text: "Close monitoring of vital signs and comfort throughout surgery by a dedicated anesthesia team." },
    { title: "Post-Anesthesia Care", text: "Structured recovery support, pain management, and monitoring after procedures." },
  ],
  fallbackDoctors: [
    { id: "anesthesia-1", name: "Anesthesia Specialist", specialization: "Anesthesiology", degrees: "MBBS, DA", designation: "Consultant", institute: "Medical Center Hospital Chattagram", experience_years: 10, room_no: "OT Complex", visiting_time: "By Appointment", phone: "+8809610-818888" },
  ],
};

export default function AnesthesiaPage() {
  return <SpecialtyPage specialty={specialty} />;
}
