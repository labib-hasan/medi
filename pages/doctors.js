import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchDoctors } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";

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

              {filteredDoctors.map((doctor) => (

                <div
                  key={doctor.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group"
                >

                  {/* IMAGE */}
                  <div className="h-64 bg-gray-100 overflow-hidden">
                    <img
                      src={doctor.image || "/placeholder-doctor.jpg"}
                      alt={doctor.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) =>
                        (e.target.src = "/placeholder-doctor.jpg")
                      }
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col flex-1">

                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>

                    <p className="text-blue-600 font-semibold mb-2">
                      {doctor.specialization}
                    </p>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                      {doctor.degrees}
                    </p>

                    {/* BUTTON */}
                    <div className="mt-auto pt-4 border-t border-gray-100">

                      <Link
                        href={`/doctors/${doctor.id}`}
                        className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
                      >
                        {language === "en"
                          ? "View Profile"
                          : "প্রোফাইল দেখুন"}
                      </Link>

                    </div>
                  </div>

                </div>
              ))}

            </div>

          )}
        </div>
      </main>

      <Footer />
    </>
  );
}