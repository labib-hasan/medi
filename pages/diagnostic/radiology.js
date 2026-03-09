import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Fallback doctors for demonstration when API is not available
const fallbackRadiologyDoctors = [
  { id: 1, name: "Prof. Dr. AHM Maqsud", specialization: "Senior Consultant – Radiology", degrees: "MBBS, FCPS, MD", designation: "Senior Consultant", institute: "Medical Center Hospital Chattagram", experience_years: 25, room_no: "RAD-101", visiting_days: ["Sunday", "Monday", "Tuesday"], visiting_time: "9 AM - 5 PM", serial_note: "Call hotline", phone: "+8801234567890" },
  { id: 2, name: "Dr. Shamsul Haque", specialization: "Consultant – Interventional Radiology", degrees: "MBBS, MD, FRCR", designation: "Consultant", institute: "Medical Center Hospital Chattagram", experience_years: 15, room_no: "RAD-102", visiting_days: ["Saturday", "Monday", "Wednesday"], visiting_time: "10 AM - 4 PM", serial_note: "First come first serve", phone: "+8801234567891" },
  { id: 3, name: "Dr. Nurjahan Begum", specialization: "Specialist – Diagnostic Radiology", degrees: "MBBS, DMRD", designation: "Specialist", institute: "Medical Center Hospital Chattagram", experience_years: 10, room_no: "RAD-103", visiting_days: ["Sunday", "Tuesday", "Thursday"], visiting_time: "8 AM - 2 PM", serial_note: "Emergency cases prioritized", phone: "+8801234567892" },
  { id: 4, name: "Dr. Mohammad Ali", specialization: "Associate Specialist – MRI & CT", degrees: "MBBS, MD", designation: "Associate Specialist", institute: "Medical Center Hospital Chattagram", experience_years: 8, room_no: "RAD-104", visiting_days: ["Monday", "Wednesday", "Friday"], visiting_time: "11 AM - 6 PM", serial_note: "Online booking available", phone: "+8801234567893" },
];

// Department name for API query - must match exactly with admin/doctors.js
const SPECIALTY_DEPARTMENT = "Radiology";

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

export default function RadiologyPage() {
  const [coverImages, setCoverImages] = useState({});
  const [doctors, setDoctors] = useState(fallbackRadiologyDoctors);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("hospital_cover_images");

    if (saved) {
      try {
        setCoverImages(JSON.parse(saved));
      } catch (e) {
        console.error("Cover image parse error:", e);
      }
    }
  }
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

  const getCoverImage = () => {
  const key = "diag_radiology";

  return (
    coverImages[key] ||
    "https://images.unsplash.com/photo-1551190822-a9333d879b1f"
  );
};
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[300px] md:h-[420px] overflow-hidden">
        <Image
  src={getCoverImage()}
          alt="Radiology"
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
              Radiology Department
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-white/90 max-w-xl"
            >
              Advanced Diagnostic Imaging Services at Medical Center Hospital Chattagram
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
              Radiology Services – Medical Center Hospital Chattagram
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Radiology Department at Medical Centre Hospital offers comprehensive diagnostic imaging services using state-of-the-art technology. Our team of experienced radiologists provides accurate diagnoses and expert interpretation for a wide range of medical conditions.
            </p>
          </motion.div>

          {/* RADIOLOGY SERVICES & FEATURES GRID */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              Radiology Services & Features
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "MRI (Magnetic Resonance Imaging)", text: "Advanced MRI scans for detailed soft tissue imaging, brain, spine, joints, and abdominal organs." },
                { title: "CT Scan (Computed Tomography)", text: "High-resolution CT imaging for emergency diagnostics, cancer staging, and surgical planning." },
                { title: "Digital X-Ray", text: "Quick and accurate X-ray services for bones, chest, and abdomen with instant digital results." },
                { title: "Ultrasound & Color Doppler", text: "Non-invasive imaging for pregnancy, abdominal organs, vascular studies, and guided procedures." },
                { title: "Mammography", text: "Breast cancer screening and diagnostic mammography with advanced digital tomosynthesis." },
                { title: "Interventional Radiology", text: "Minimally invasive procedures including angiography, biopsy, and tumor ablation." },
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

          {/* EQUIPMENT & TECHNOLOGY */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              Advanced Equipment & Technology
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "1.5T MRI Scanner",
                "128-Slice CT Scanner",
                "Digital X-Ray System",
                "4D Ultrasound",
                "Color Doppler",
                "Digital Mammography",
                "C-Arm Fluoroscopy",
                "Picture Archiving System (PACS)"
              ].map((equipment, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-sm text-gray-800 shadow hover:shadow-lg transition"
                >
                  {equipment}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RADIOLOGY SPECIALISTS – FROM DATABASE */}
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
                Radiology Specialist Doctors
              </h2>
              <p className="text-gray-600 mt-2">
                Highly experienced radiologists and imaging specialists
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
                              <span className="text-xs ml-1">yrs</span>
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
              <h3 className="text-2xl font-bold mb-4">Need Diagnostic Imaging?</h3>
              <p className="mb-6 max-w-2xl mx-auto">
                Our radiology team provides comprehensive diagnostic imaging services. Contact us for appointments and more information.
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

