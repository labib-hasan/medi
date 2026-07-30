import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MAX_VISIBLE_DOCTORS = 8;

const getDoctorImage = (id) => {
  const numericId = Number(id) || 1;
  return `https://randomuser.me/api/portraits/${numericId % 2 === 0 ? "men" : "women"}/${(numericId * 17) % 90}.jpg`;
};

const formatTimeToAMPM = (timeString) => {
  if (!timeString || typeof timeString !== "string") return "";

  const normalized = timeString.replace(/(\d)\.(\d)/g, "$1:$2").trim();
  const timeMatch = normalized.match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)?$/i);

  if (!timeMatch) return normalized;

  let [, hourString, minuteString, period] = timeMatch;
  let hour = Number(hourString);
  const minute = minuteString || "00";

  if (period) {
    period = period.toUpperCase();
    if (period === "AM" && hour === 12) hour = 0;
    if (period === "PM" && hour !== 12) hour += 12;
  }

  if (hour === 0) return `12:${minute} AM`;
  if (hour < 12) return `${hour}:${minute} AM`;
  if (hour === 12) return `12:${minute} PM`;
  return `${hour - 12}:${minute} PM`;
};

export default function SpecialtyPage({ specialty }) {
  const [coverImages, setCoverImages] = useState({});
  const [doctors, setDoctors] = useState(specialty.fallbackDoctors);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const savedCoverImages = window.localStorage.getItem("hospital_cover_images");

    if (savedCoverImages) {
      try {
        setCoverImages(JSON.parse(savedCoverImages));
      } catch (error) {
        console.error("Cover image parse error:", error);
      }
    }

    const loadDoctors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`);
        if (!response.ok) return;

        const data = await response.json();
        if (!Array.isArray(data)) return;

        const specialtyDoctors = data.filter(
          (doctor) => (doctor.department || "").trim() === specialty.department
        );

        if (specialtyDoctors.length > 0) setDoctors(specialtyDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [specialty.department]);

  const displayedDoctors = showAll ? doctors : doctors.slice(0, MAX_VISIBLE_DOCTORS);
  const hasMoreDoctors = doctors.length > MAX_VISIBLE_DOCTORS;
  const coverImage =
    coverImages[`spec_${specialty.slug}`] || specialty.defaultCoverImage;

  return (
    <>
      <Navbar />

      <section className="relative h-[300px] overflow-hidden md:h-[420px]">
        <Image src={coverImage} alt={specialty.name} fill className="object-cover" />
        <div className="absolute inset-0 flex items-center bg-gradient-to-r from-black/80 via-black/50 to-transparent">
          <div className="mx-auto w-full max-w-7xl px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-3 text-3xl font-bold text-white md:text-5xl"
            >
              {specialty.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="max-w-xl text-white/90"
            >
              {specialty.subtitle}
            </motion.p>
          </div>
        </div>
      </section>

      <main className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="mb-4 text-2xl font-bold text-blue-700 md:text-3xl">
              {specialty.name} Services - Medical Center Hospital Chattagram
            </h2>
            <p className="leading-relaxed text-gray-700">{specialty.description}</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <h2 className="mb-6 text-xl font-semibold text-gray-800 md:text-2xl">
              {specialty.name} Services & Features
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {specialty.features.map((feature) => (
                <motion.article
                  key={feature.title}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="rounded-2xl border-l-4 border-blue-600 bg-white p-6 shadow-lg transition-shadow hover:shadow-2xl"
                >
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{feature.text}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-8 text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">Our Experts</span>
              <h2 className="mt-2 text-2xl font-bold text-gray-800 md:text-3xl">
                {specialty.name} Specialist Doctors
              </h2>
              <p className="mt-2 text-gray-600">{specialty.doctorDescription}</p>
              <p className="mt-1 text-sm text-gray-500">{doctors.length} doctors available</p>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedDoctors.map((doctor, index) => (
                    <motion.article
                      key={doctor.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6 }}
                      className="group mx-auto flex h-full w-full max-w-[280px] flex-col overflow-hidden rounded-3xl bg-gray-100 shadow-md transition-shadow hover:shadow-2xl"
                    >
                      <div className="relative">
                        <img
                          src={doctor.image || getDoctorImage(doctor.id || index + 1)}
                          alt={doctor.name}
                          className="h-[280px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-95"
                          onError={(event) => {
                            event.currentTarget.src = getDoctorImage(doctor.id || index + 1);
                          }}
                        />
                        <span className="absolute left-2 top-2 rounded-full bg-green-500 px-2 py-0.5 text-[9px] font-semibold text-white">
                          Available
                        </span>
                      </div>
                      <div className="flex flex-grow flex-col p-4 text-center">
                        <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                        <p className="mt-1 text-[11px] text-blue-600">{doctor.degrees || doctor.specialization}</p>
                        <p className="mt-1 text-[11px] text-gray-500">{doctor.designation || "Consultant"}</p>
                        <div className="mt-4 grid grid-cols-3 border-y border-gray-200 py-2 text-[10px] text-gray-600">
                          <div><span className="block text-gray-400">Experience</span>{doctor.experience_years || "-"} yrs</div>
                          <div className="border-x border-gray-200"><span className="block text-gray-400">Room</span>{doctor.room_no || "TBA"}</div>
                          <div><span className="block text-gray-400">Time</span>{formatTimeToAMPM(doctor.visiting_time) || "TBA"}</div>
                        </div>
                        {doctor.phone && <p className="mt-3 text-xs text-gray-600">Phone: {doctor.phone}</p>}
                        <Link
                          href={`/doctors/${doctor.id}`}
                          className="mt-4 inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-500 hover:to-cyan-700"
                        >
                          View Full Profile
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {hasMoreDoctors && !showAll && (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAll(true)}
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-700 hover:to-cyan-700"
                    >
                      View All ({doctors.length}) Doctors
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.section>
        </div>
      </main>

      <Footer />
    </>
  );
}
