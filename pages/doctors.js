import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchDoctors } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";

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

export default function Doctors() {
  const { language } = useLanguage();
  const t = translations[language];

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchDoctors();
        setDoctors(data || []);
        setFilteredDoctors(data || []);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    let result = doctors;

    if (searchTerm) {
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialtyFilter) {
      result = result.filter((doc) => doc.specialization === specialtyFilter);
    }

    setFilteredDoctors(result);
  }, [searchTerm, specialtyFilter, doctors]);

  const specialties = [...new Set(doctors.map((d) => d.specialization))];

  return (
    <>
      <Head>
        <title>
          {language === "en"
            ? "Doctors - Medical Center"
            : "ডাক্তারবৃন্দ - মেডিকেল সেন্টার"}
        </title>
      </Head>

      <Navbar />

      <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

        {/* HERO */}
        <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 py-20 text-black">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {language === "en" ? "Meet Our Doctors" : "আমাদের ডাক্তারবৃন্দ"}
            </h1>

            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              {language === "en"
                ? "Experienced professionals dedicated to your health and wellbeing."
                : "আপনার সুস্বাস্থ্যের জন্য নিবেদিত অভিজ্ঞ চিকিৎসকবৃন্দ"}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12">

          {/* FILTER BAR */}
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-5 mb-10 flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder={
                language === "en" ? "Search doctors..." : "ডাক্তার খুঁজুন..."
              }
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 bg-white"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              <option value="">
                {language === "en" ? "All Specialties" : "সকল বিশেষত্ব"}
              </option>

              {specialties.map((spec, i) => (
                <option key={i} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="text-center py-24">
              <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600 mx-auto"></div>
            </div>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {filteredDoctors.map((doctor, index) => (

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
                      {language === "bn" ? "উপলব্ধ" : "Available"}
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
                      {doctor.designation || (language === "bn" ? "পরামর্শক" : "Consultant")}
                    </p>

                    {/* stats */}
                    <div className="grid grid-cols-3 text-center border-t border-b border-gray-100 mt-auto text-[10px]">

                      <div className="text-center">
                        <p className="text-gray-400 text-[9px]">
                          {language === "bn" ? "অভিজ্ঞতা" : "Experience"}
                        </p>
                        <p className="font-semibold text-gray-800">
                          {doctor.experience_years || "5"}
                          <span className="text-xs ml-1">
                            {language === "bn" ? "বছর" : "yrs"}
                          </span>
                        </p>
                      </div>

                      <div className="text-center border-l border-r border-gray-100">
                        <p className="text-gray-400 text-[9px]">
                          {language === "bn" ? "রুম নং" : "Room"}
                        </p>
                        <p className="font-semibold text-gray-800">
                          {doctor.room_no || (language === "bn" ? "টিবিএ" : "TBA")}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-500 text-[9px]">
                          {language === "bn" ? "সময়" : "Time"}
                        </p>
                        <p className="font-semibold text-gray-800 text-[10px]">
                          {formatTimeToAMPM(doctor.visiting_time) || "9 AM"}
                        </p>
                      </div>

                    </div>

                    {/* hospital */}
                    <p className="text-gray-500 text-[10px] text-center mt-auto">
                      <span className="font-medium text-gray-700">
                        {language === "bn" ? "হাসপাতাল:" : "Hospital:"}
                      </span>{" "}
                      {doctor.institute || "Medical Center"}
                    </p>

                    {/* phone */}
                    {doctor.phone && (
                      <p className="text-gray-600 text-xs text-center mt-auto">
                        <span className="font-medium text-gray-700">
                          {language === "bn" ? "ফোন:" : "Phone:"}
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
                        {language === "bn" ? "সম্পূর্ণ প্রোফাইল দেখুন" : "View Full Profile"}
                      </Link>
                    </motion.div>

                  </div>

                </motion.div>
              ))}

            </div>

          )}
        </div>
      </main>

      <Footer />
    </>
  );
}