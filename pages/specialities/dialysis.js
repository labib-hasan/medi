import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Fallback doctors for demonstration when API is not available
const fallbackDialysisDoctors = [
  { id: 1, name: "Dr. Professor M. A. Khan", specialization: "Senior Consultant – Nephrology", degrees: "MBBS, FCPS", designation: "Senior Consultant", institute: "Ad-din Medical College Hospital", experience_years: 20, room_no: "Dialysis-101", visiting_days: ["Sunday", "Monday", "Tuesday"], visiting_time: "9 AM - 5 PM", serial_note: "Call hotline", phone: "+8801234567890" },
  { id: 2, name: "Dr. Runa Laila", specialization: "Consultant – Nephrology", degrees: "MBBS, MD", designation: "Consultant", institute: "Ad-din Medical College Hospital", experience_years: 12, room_no: "Dialysis-102", visiting_days: ["Saturday", "Monday", "Wednesday"], visiting_time: "10 AM - 4 PM", serial_note: "First come first serve", phone: "+8801234567891" },
  { id: 3, name: "Dr. Fazle Hasan", specialization: "Specialist – Dialysis Medicine", degrees: "MBBS, MD", designation: "Specialist", institute: "Ad-din Medical College Hospital", experience_years: 8, room_no: "Dialysis-103", visiting_days: ["Sunday", "Tuesday", "Thursday"], visiting_time: "8 AM - 2 PM", serial_note: "Emergency cases prioritized", phone: "+8801234567892" },
  { id: 4, name: "Dr. Mowsumi Kabir", specialization: "Associate Specialist – Kidney Care", degrees: "MBBS, MD", designation: "Associate Specialist", institute: "Ad-din Medical College Hospital", experience_years: 6, room_no: "Dialysis-104", visiting_days: ["Monday", "Wednesday", "Friday"], visiting_time: "11 AM - 6 PM", serial_note: "Online booking available", phone: "+8801234567893" },
];

// Department name for API query - must match exactly with admin/doctors.js
const SPECIALTY_DEPARTMENT = "Dialysis - Kidney Care";

const getDoctorImage = (id) =>
  `https://randomuser.me/api/portraits/${id % 2 === 0 ? "men" : "women"}/${(id * 17) % 90}.jpg`;

const formatTimeToAMPM = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return '';
  let normalized = timeString.replace(/(\d)\.(\d)/g, '$1:$2').trim();
  const convertTo12Hour = (timeStr) => {
    if (!timeStr) return '';
    const match = timeStr.match(/^(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?$/i);
    if (!match) return timeStr;
    let [, hourStr, minuteStr, period] = match;
    let hour = parseInt(hourStr);
    let minute = minuteStr || '00';
    if (minute.length === 1) minute = '0' + minute;
    if (period) {
      period = period.toUpperCase();
      if (period === 'AM' && hour === 12) hour = 0;
      if (period === 'PM' && hour !== 12) hour += 12;
      if (hour === 0) return `12:${minute} AM`;
      if (hour < 12) return `${hour}:${minute} AM`;
      if (hour === 12) return `12:${minute} PM`;
      return `${hour - 12}:${minute} PM`;
    }
    if (hour === 0) return `12:${minute} AM`;
    if (hour === 12) return `12:${minute} PM`;
    if (hour < 12) return `${hour}:${minute} AM`;
    return `${hour - 12}:${minute} PM`;
  };
  const rangePatterns = [
    /(\d{1,2}:?\d*\s*(?:am|pm)?)\s*-\s*(\d{1,2}:?\d*\s*(?:am|pm)?)/i,
    /(\d{1,2}:?\d*\s*(?:am|pm)?)\s*to\s*(\d{1,2}:?\d*\s*(?:am|pm)?)/i,
  ];
  for (const pattern of rangePatterns) {
    const match = normalized.match(pattern);
    if (match) {
      return `${convertTo12Hour(match[1].trim())} - ${convertTo12Hour(match[2].trim())}`;
    }
  }
  return convertTo12Hour(normalized);
};

const getVisitingDaysArray = (days) => {
  if (!days) return [];
  if (typeof days === 'string') {
    try { days = JSON.parse(days); } catch { return []; }
  }
  return Array.isArray(days) ? days : [];
};

export default function DialysisPage() {
  const [doctors, setDoctors] = useState(fallbackDialysisDoctors);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`);
      if (!response.ok) {
        console.log("API response not ok, using fallback data");
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const filteredDoctors = data.filter(doc => {
          const docDept = (doc.department || '').trim();
          return docDept === SPECIALTY_DEPARTMENT;
        });
        
        if (filteredDoctors.length > 0) {
          setDoctors(filteredDoctors);
        }
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const MAX_VISIBLE_DOCTORS = 8;
  const displayedDoctors = showAll ? doctors : doctors.slice(0, MAX_VISIBLE_DOCTORS);
  const hasMoreDoctors = doctors.length > MAX_VISIBLE_DOCTORS;

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[300px] md:h-[420px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
          alt="Dialysis Center"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-bold text-white mb-3"
            >
              Dialysis Center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-white/90 max-w-xl"
            >
              Advanced Kidney Care & Dialysis Services at Medical Center Hospital Chattagram
            </motion.p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">

          {/* INTRO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4">
              Dialysis & Kidney Care Services – Medical Center Hospital Chattagram
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our Dialysis Center at Medical Center Hospital Chattagram provides comprehensive kidney care services including hemodialysis, peritoneal dialysis, and continuous renal replacement therapy. We offer safe, modern, and patient-focused renal care with state-of-the-art equipment and experienced nephrologists.
            </p>
          </motion.div>

          {/* DIALYSIS SERVICES & FEATURES GRID */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              Dialysis Services & Features
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Hemodialysis", text: "State-of-the-art hemodialysis machines with real-time monitoring for patients with end-stage renal disease." },
                { title: "Peritoneal Dialysis", text: "Home dialysis option for eligible patients with comprehensive training and support." },
                { title: "Continuous Renal Replacement Therapy (CRRT)", text: "24/7 dialysis for critically ill patients in ICU with acute kidney injury." },
                { title: "Kidney Disease Management", text: "Comprehensive care for chronic kidney disease (CKD) stages 1-5 including diet and medication management." },
                { title: "Vascular Access Care", text: "Creation and maintenance of arteriovenous fistulas, grafts, and catheters for dialysis access." },
                { title: "Dialysis Equipment", text: "Modern dialysis machines with advanced filtration systems ensuring patient safety and comfort." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-2xl transition-all duration-[30ms]"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* DIALYSIS PROCEDURES */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              Types of Dialysis We Offer
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Hemodialysis (HD)",
                "Peritoneal Dialysis (PD)",
                "Automated Peritoneal Dialysis (APD)",
                "Continuous Ambulatory Peritoneal Dialysis (CAPD)",
                "Hemodiafiltration (HDF)",
                "Sustained Low-Efficiency Dialysis (SLED)",
                "Plasmapheresis",
                "Kidney Biopsy",
                "Vascular Access Surgery"
              ].map((procedure, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 text-sm text-gray-800 shadow hover:shadow-lg transition flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                  {procedure}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* KIDNEY CARE TIPS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              Kidney Health Tips
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                "Control blood pressure and monitor regularly",
                "Manage diabetes and keep blood sugar in check",
                "Maintain a healthy diet with low sodium",
                "Stay hydrated - drink adequate water daily",
                "Avoid smoking and limit alcohol consumption",
                "Exercise regularly to maintain healthy weight",
                "Avoid overuse of pain medications",
                "Get regular kidney function check-ups"
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-4 text-sm text-gray-700 shadow border border-gray-100 hover:shadow-md transition flex items-center gap-2"
                >
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                  {tip}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* DIALYSIS SPECIALISTS – FROM DATABASE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-8 text-center">
              <span className="text-sm uppercase tracking-wider text-purple-600 font-semibold">
                Our Experts
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                Nephrology & Dialysis Specialists
              </h2>
              <p className="text-gray-600 mt-2">
                Highly experienced nephrologists and kidney care specialists
              </p>
              <p className="text-gray-500 text-sm mt-1">{doctors.length} doctors available</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : displayedDoctors.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedDoctors.map((doctor, index) => (
                    <motion.div
                      key={doctor.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.05, delay: index * 0.01 }}
                      whileHover={{
                        y: -6,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.69)"
                      }}
                      className="max-w-[280px] rounded-3xl overflow-hidden bg-gray-100 mx-auto relative group flex flex-col h-full shadow-md hover:shadow-2xl transition"
                    >

                      {/* IMAGE */}
                      <div className="relative">
                        <img
                          src={doctor.image || getDoctorImage(doctor.id || index + 1)}
                          alt={doctor.name}
                          className="w-full transition-transform duration-500 group-hover:scale-95"
                          style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 75%, 0% 100%)",
                            height: "280px",
                            objectFit: "cover",
                            objectPosition: "top center"
                          }}
                          onError={(e) => {
                            e.target.src = getDoctorImage(doctor.id || index + 1);
                          }}
                        />

                        {/* overlay */}
                        <div
                          style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 75%, 0% 100%)",
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(150, 159, 186, 0.32) 100%)"
                          }}
                        />

                        {/* availability */}
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          Available
                        </div>

                        {/* circle button */}
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.2 }}
                          whileHover={{ scale: 1.4 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute bottom-5 right-5 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-lg  z-20"
                          onClick={() => window.location.href = `/doctors/${doctor.id}`}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </motion.div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-3 flex flex-col flex-grow">

                        <h3 className="font-bold text-xl mt-auto  text-gray-800 text-center break-normal">
                          {doctor.name}
                        </h3>

                        <p className="text-blue-600 text-[11px] text-center mt-auto">
                          {doctor.degrees || doctor.specialization}
                        </p>

                        <p className="text-gray-500 text-[11px] text-center mt-auto">
                          {doctor.designation || "Consultant"}
                        </p>

                        {/* stats */}
                        <div className="grid grid-cols-3 text-center border-t border-b border-gray-100 mt-auto text-[10px]">

                          <div className="text-center">
                            <p className="text-gray-400 text-[9px]">
                              Experience
                            </p>
                            <p className="font-semibold text-gray-800">
                              {doctor.experience_years || "5"}
                              <span className="text-xs ml-1">years</span>
                            </p>
                          </div>

                          <div className="text-center border-l border-r border-gray-100">
                            <p className="text-gray-400 text-[9px]">
                              Room
                            </p>
                            <p className="font-semibold text-gray-800">
                              {doctor.room_no || "TBA"}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-gray-500 text-[9px]">
                              Time
                            </p>
                            <p className="font-semibold text-gray-800 text-[10px]">
                              {formatTimeToAMPM(doctor.visiting_time) || "9 AM"}
                            </p>
                          </div>

                        </div>

                        {/* hospital */}
                        <p className="text-gray-500 text-[10px] text-center mt-auto">
                          <span className="font-medium text-gray-700">
                            Hospital:
                          </span>{" "}
                          {doctor.institute || "Medical Center"}
                        </p>

                        {/* phone */}
                        {doctor.phone && (
                          <p className="text-gray-600 text-xs text-center mt-auto">
                            <span className="font-medium text-gray-700">
                              Phone:
                            </span>{" "}
                            {doctor.phone}
                          </p>
                        )}

                        {/* BUTTON */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-auto"
                        >
                          <Link
                            href={`/doctors/${doctor.id}`}
                            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl font-semibold text-sm hover:from-blue-500 hover:to-cyan-700 transition shadow-lg shadow-blue-500/25"
                          >
                            View Full Profile
                          </Link>
                        </motion.div>

                      </div>

                    </motion.div>
                  ))}
                </div>

                {hasMoreDoctors && !showAll && (
                  <div className="text-center mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAll(true)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-blue-700 transition"
                    >
                      View All ({doctors.length}) Doctors →
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">No specialists found</p>
              </div>
            )}
          </motion.div>

          {/* CONTACT SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Need Dialysis Services?</h3>
              <p className="mb-6 max-w-2xl mx-auto">
                Our Dialysis Center provides comprehensive kidney care. Contact us for consultation, appointments, or emergency dialysis services.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/appointment" className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition">
                  Book Appointment
                </a>
                <a href="tel:+8809610818888" className="px-6 py-3 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition">
                  Call: +8809610-818888
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}

