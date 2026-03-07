import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Fallback doctors for demonstration when API is not available
const fallbackICUDoctors = [
  { id: 1, name: "Dr. Professor M. A. Khan", specialization: "Senior Consultant – Intensive Care Medicine", degrees: "MBBS, FCPS", designation: "Senior Consultant", institute: "Ad-din Medical College Hospital", experience_years: 20, room_no: "ICU-101", visiting_days: ["Sunday", "Monday", "Tuesday"], visiting_time: "9 AM - 5 PM", serial_note: "Call hotline", phone: "+8801234567890" },
  { id: 2, name: "Dr. Runa Laila", specialization: "Consultant – Critical Care Medicine", degrees: "MBBS, MD", designation: "Consultant", institute: "Ad-din Medical College Hospital", experience_years: 12, room_no: "ICU-102", visiting_days: ["Saturday", "Monday", "Wednesday"], visiting_time: "10 AM - 4 PM", serial_note: "First come first serve", phone: "+8801234567891" },
  { id: 3, name: "Dr. Fazle Hasan", specialization: "Specialist – Respiratory & Ventilator Care", degrees: "MBBS, DA", designation: "Specialist", institute: "Ad-din Medical College Hospital", experience_years: 8, room_no: "ICU-103", visiting_days: ["Sunday", "Tuesday", "Thursday"], visiting_time: "8 AM - 2 PM", serial_note: "Emergency cases prioritized", phone: "+8801234567892" },
  { id: 4, name: "Dr. Mowsumi Kabir", specialization: "Associate Specialist – Organ Support Care", degrees: "MBBS, MD", designation: "Associate Specialist", institute: "Ad-din Medical College Hospital", experience_years: 6, room_no: "ICU-104", visiting_days: ["Monday", "Wednesday", "Friday"], visiting_time: "11 AM - 6 PM", serial_note: "Online booking available", phone: "+8801234567893" },
];

// Department name for API query - must match exactly with admin/doctors.js
const SPECIALTY_DEPARTMENT = "ICU - Intensive Care Unit";

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

export default function ICUPage() {
  const [doctors, setDoctors] = useState(fallbackICUDoctors);
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
          src="https://images.unsplash.com/photo-1551190822-a9333d879b1f"
          alt="ICU - Intensive Care Unit"
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
              Intensive Care Unit (ICU)
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-white/90 max-w-xl"
            >
              Advanced critical care at Medical Center Hospital Chattagram
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
              Intensive Care Unit Services – Medical Center Hospital Chattagram
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Intensive Care Unit (ICU) at Medical Center Hospital Chattagram is a specialized department dedicated to providing comprehensive critical care for patients with life-threatening conditions. Our ICU is equipped with state-of-the-art technology and staffed by a multidisciplinary team of intensivists, critical care nurses, and specialized therapists.
            </p>
          </motion.div>

          {/* ICU SERVICES & FEATURES GRID */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              ICU Services & Features
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Constant Monitoring", text: "Continuous tracking of vital signs, including heart rate, blood pressure, and oxygen levels." },
                { title: "Respiratory Support", text: "Use of ventilators for patients unable to breathe independently." },
                { title: "Organ Support & Dialysis", text: "Advanced treatment for multi-organ failure, kidney failure, or severe infections." },
                { title: "Specialized Staffing", text: "High staff-to-patient ratio (often 1:1), with intensive care specialists." },
                { title: "Post-Operative Care", text: "Intensive monitoring following major surgeries." },
                { title: "Emergency Care", text: "Immediate intervention for severe accidents or heart attacks." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-2xl transition-all duration-[30ms]"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ICU SPECIALISTS – FROM DATABASE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-8 text-center">
              <span className="text-sm uppercase tracking-wider text-blue-600 font-semibold">
                Our Experts
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                ICU Specialist Doctors
              </h2>
              <p className="text-gray-600 mt-2">
                Highly experienced intensivists and critical care specialists
              </p>
              <p className="text-gray-500 text-sm mt-1">{doctors.length} doctors available</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                      whileHover={{ y: -3, scale: 1.01 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100 flex flex-col h-[520px]"
                    >
                      <div className="w-full h-[280px] relative bg-gradient-to-br from-blue-600 to-cyan-600 flex-shrink-0">
                        <img
                          src={doctor.image || getDoctorImage(doctor.id || index + 1)}
                          alt={doctor.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => { e.target.src = getDoctorImage(doctor.id || index + 1); }}
                        />
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          Available
                        </div>
                      </div>

                      <div className="w-full p-4 flex flex-col h-[240px]">
                        <div className="flex flex-col h-full">
                          <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide h-6 leading-6 truncate flex-shrink-0">
                            {doctor.name}
                          </h2>
                          <p className="text-blue-700 font-semibold text-sm h-5 leading-5 truncate flex-shrink-0 mt-1">
                            {doctor.degrees || doctor.specialization}
                          </p>
                          <p className="text-gray-700 font-medium text-sm h-5 leading-5 truncate flex-shrink-0">
                            {doctor.designation || "Doctor"}
                          </p>
                          <p className="text-gray-600 text-sm h-5 leading-5 truncate flex-shrink-0">
                            {doctor.institute || "Ad-din Medical College Hospital"}
                          </p>
                          <p className="text-gray-600 text-xs h-4 leading-4 truncate flex-shrink-0">
                            <span className="font-medium text-gray-800">Experience:</span> {doctor.experience_years || "5"} years
                          </p>

                          <div className="mt-1 space-y-1 flex-shrink-0">
                            <p className="text-gray-600 text-xs h-4 leading-4 truncate">
                              <span className="font-medium text-gray-800">Room:</span> {doctor.room_no || "TBA"}
                            </p>
                            <p className="text-gray-600 text-xs h-4 leading-4 truncate">
                              <span className="font-medium text-gray-800">Time:</span> {formatTimeToAMPM(doctor.visiting_time) || "9 AM - 5 PM"}
                            </p>
                            <p className="text-gray-600 text-xs h-4 leading-4 truncate">
                              <span className="font-medium text-gray-800">Serial:</span> {formatTimeToAMPM(doctor.serial_note) || "Call hotline"}
                            </p>
                            {doctor.phone && (
                              <p className="text-gray-600 text-xs h-4 leading-4 truncate">
                                <span className="font-medium text-gray-800">Phone:</span> {doctor.phone}
                              </p>
                            )}
                          </div>

                          <div className="flex-grow"></div>

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-auto flex-shrink-0">
                            <Link 
                              href={`/doctors/${doctor.id}`}
                              className="inline-flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-cyan-700 transition shadow-lg shadow-blue-500/25"
                            >
                              View Profile
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </motion.div>
                        </div>
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
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-700 transition"
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
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Need ICU Care?</h3>
              <p className="mb-6 max-w-2xl mx-auto">
                Our ICU team provides comprehensive critical care for the most seriously ill patients. Contact us for immediate assistance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/appointment" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition">
                  Book Appointment
                </a>
                <a href="tel:+8809610818888" className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-full hover:bg-blue-800 transition">
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
