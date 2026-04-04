import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";

const getDoctorImage = (id, fallbackId) => {
  if (!id) {
    return `https://randomuser.me/api/portraits/${fallbackId % 2 === 0 ? "men" : "women"}/${(fallbackId * 17) % 90}.jpg`;
  }
  return id;
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Format time to 12-hour AM/PM format
const formatTimeToAMPM = (timeString) => {
  if (!timeString) return '';
  
  // Helper to convert any hour to 12-hour format
  const to12Hour = (hour, period) => {
    let h = parseInt(hour);
    // If period provided, use it as-is
    if (period) {
      const isPM = period.toLowerCase() === 'pm';
      const isAM = period.toLowerCase() === 'am';
      if (isPM && h !== 12) return { hour: h, period: 'PM' };
      if (isPM && h === 12) return { hour: 12, period: 'PM' };
      if (isAM && h === 12) return { hour: 12, period: 'AM' };
      return { hour: h, period: 'AM' };
    }
    // Convert 24-hour format to 12-hour
    if (h === 0 || h === 24) return { hour: 12, period: 'AM' };
    if (h === 12) return { hour: 12, period: 'PM' };
    if (h > 12) return { hour: h - 12, period: 'PM' };
    return { hour: h, period: 'AM' };
  };

  const formatTime = (h, m, p) => {
    let min = m || '00';
    if (min.length === 1) min = '0' + min;
    const time12 = to12Hour(h, p);
    return `${time12.hour}:${min} ${time12.period}`;
  };

  // Normalize time string: replace periods with colons, handle various formats
  const normalizeTime = (timeStr) => {
    if (!timeStr) return '';
    // Replace periods with colons (e.g., "4.30" -> "4:30")
    timeStr = timeStr.replace(/(\d)\.(\d)/g, '$1:$2');
    return timeStr.trim();
  };

  // Handle "start - end" format (from admin panel)
  if (timeString.includes(' - ')) {
    const [startTime, endTime] = timeString.split(' - ').map(t => normalizeTime(t.trim()));

    // Convert 24-hour format to 12-hour
    const convert24To12 = (timeStr) => {
      if (!timeStr) return '';
      // If already has AM/PM, return as is
      if (timeStr.includes('AM') || timeStr.includes('PM') || timeStr.includes('am') || timeStr.includes('pm')) {
        // Normalize and format
        const match = timeStr.match(/^(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?$/i);
        if (match) {
          const [, hour, minute, period] = match;
          return formatTime(hour, minute || '00', period);
        }
        return timeStr;
      }

      // Parse HH:MM or H:MM format (24-hour)
      const match = timeStr.match(/^(\d{1,2}):?(\d{2})$/);
      if (match) {
        const [, hour, minute] = match;
        return formatTime(hour, minute);
      }
      return timeStr;
    };

    const start = convert24To12(startTime);
    const end = convert24To12(endTime);
    return `${start} - ${end}`;
  }

  // Handle time ranges with "to" or "-" (various formats)
  const rangeMatch = timeString.match(/(\d{1,2})[:.]?(\d{2})?\s*(am|pm|AM|PM)?\s*(?:to|-)\s*(\d{1,2})[:.]?(\d{2})?\s*(am|pm|AM|PM)?/i);
  if (rangeMatch) {
    const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = rangeMatch;
    const start = formatTime(startHour, startMin || '00', startPeriod);
    const end = formatTime(endHour, endMin || '00', endPeriod);
    return `${start} - ${end}`;
  }

  // Single time (various formats: "10 am", "4.30 pm", "14:30")
  const singleMatch = timeString.match(/^(\d{1,2})[:.]?(\d{2})?\s*(am|pm|AM|PM)?$/i);
  if (singleMatch) {
    const [, hour, minute, period] = singleMatch;
    return formatTime(hour, minute || '00', period);
  }

  return timeString;
};

export default function DoctorProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { language } = useLanguage();
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    if (id) {
      fetchDoctor();
      fetchRelatedDoctors();
      checkFavorite();
    }
  }, [id]);

  const checkFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteDoctors') || '[]');
    setIsFavorite(favorites.includes(id));
  };

  const fetchDoctor = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors/${id}`);
      if (!response.ok) {
        throw new Error("Doctor not found");
      }
      const data = await response.json();
      setDoctor(data);
    } catch (err) {
      console.error("Error fetching doctor:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedDoctors = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`);
      if (response.ok) {
        const data = await response.json();
        const related = data
          .filter(d => d.id !== parseInt(id) && d.department === (doctor?.department || ''))
          .slice(0, 3);
        setRelatedDoctors(related);
      }
    } catch (err) {
      console.error("Error fetching related doctors:", err);
    }
  };

  const formatVisitingDays = (days) => {
    if (!days) return "Not specified";
    if (typeof days === 'string') {
      try {
        days = JSON.parse(days);
      } catch {
        return days;
      }
    }
    if (Array.isArray(days)) {
      return days.join(", ");
    }
    return "Not specified";
  };

  const getVisitingDaysArray = (days) => {
    if (!days) return [];
    if (typeof days === 'string') {
      try {
        days = JSON.parse(days);
      } catch {
        return [];
      }
    }
    return Array.isArray(days) ? days : [];
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    const favorites = JSON.parse(localStorage.getItem('favoriteDoctors') || '[]');
    if (!isFavorite) {
      favorites.push(id);
    } else {
      const index = favorites.indexOf(id);
      if (index > -1) favorites.splice(index, 1);
    }
    localStorage.setItem('favoriteDoctors', JSON.stringify(favorites));
  };

  const shareProfile = async () => {
    const shareData = {
      title: `${doctor.name} - ${doctor.specialization}`,
      text: `Book an appointment with ${doctor.name}, ${doctor.specialization} at our hospital.`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const printProfile = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `Book an appointment with ${doctor.name}, ${doctor.specialization}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 sm:h-24 sm:w-24 border-4 border-slate-600 border-t-cyan-400"></div>
              <div className="absolute inset-0 animate-pulse rounded-full h-20 w-20 sm:h-24 sm:w-24 border-4 border-slate-700"></div>
            </div>
            <p className="mt-6 sm:mt-8 text-slate-400 font-medium text-base sm:text-lg">Loading doctor profile...</p>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !doctor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-6 sm:p-8"
          >
            <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-5 sm:mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 sm:w-14 sm:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Doctor Not Found</h2>
            <p className="text-slate-400 mb-6 sm:mb-8 text-base sm:text-lg">{error || "Unable to load doctor profile"}</p>
            <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl sm:rounded-2xl hover:from-cyan-600 hover:to-blue-700 transition font-semibold text-base sm:text-lg shadow-xl">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  const visitingDaysArray = getVisitingDaysArray(doctor.visiting_days);

  return (
    <>
      <Navbar />

      {/* ENHANCED HERO SECTION - Responsive */}
      <section className="relative mt-5 min-h-[350px] sm:min-h-[400px] lg:min-h-[450px] overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
        
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Background image with overlay */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200"
            alt="Doctor Profile"
            fill
            className="object-cover"
          />
        </div>

        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6"
          >
            <Link href="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <span>/</span>
            <Link href="/departments" className="hover:text-cyan-400 transition-colors">Departments</Link>
            <span>/</span>
            <span className="text-white truncate max-w-[150px] sm:max-w-none">{doctor.name}</span>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 lg:gap-8">
            {/* Doctor Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center sm:block"
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm mx-auto sm:mx-0">
                <img
                  src={getDoctorImage(doctor.image, doctor.id)}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://randomuser.me/api/portraits/${doctor.id % 2 === 0 ? "men" : "women"}/${(doctor.id * 17) % 90}.jpg`;
                  }}
                />
              </div>
              {/* Status badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-2 -right-1 sm:-bottom-3 sm:-right-3 bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg flex items-center gap-1 sm:gap-1.5"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></span>
                Available
              </motion.div>
            </motion.div>

            {/* Doctor Info */}
            <div className="flex-1 pb-2 sm:pb-4 text-center sm:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2"
              >
               {doctor.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg sm:text-xl md:text-2xl text-cyan-400 font-medium"
              >
                {doctor.specialization}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-3 sm:mt-4"
              >
                <span className="px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium border border-white/20">
                  {doctor.department}
                </span>
                {doctor.designation && (
                  <span className="px-3 py-1 sm:px-4 sm:py-2 bg-cyan-500/20 backdrop-blur-sm rounded-full text-cyan-300 text-xs sm:text-sm font-medium border border-cyan-500/30">
                    {doctor.designation}
                  </span>
                )}
                <span className="flex items-center gap-1 sm:gap-2 text-slate-300 text-xs sm:text-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {doctor.experience_years || 0}+ Years Experience
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom wave - hidden on mobile */}
        <div className="absolute bottom-0 left-0 right-0 hidden sm:block">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#paint0_linear)" fillOpacity="0.1"/>
            <defs>
              <linearGradient id="paint0_linear" x1="720" y1="0" x2="720" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06B6D4"/>
                <stop offset="1" stopColor="#3B82F6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-6 sm:py-8 lg:py-12 -mt-6 sm:-mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Quick Action Bar - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3 sm:gap-4"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFavorite}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-sm sm:text-base transition ${
                  isFavorite 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                    : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isFavorite ? 'Saved' : 'Save'}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareProfile}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm sm:text-base hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={printProfile}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm sm:text-base hover:bg-purple-50 hover:text-purple-600 transition"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </motion.button>
            </div>
            
            {/* Rating - hidden on very small screens */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-slate-600 font-medium text-sm sm:text-base">5.0</span>
              <span className="text-slate-400 text-xs sm:text-sm">(124 reviews)</span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              {/* Appointment Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mb-5 sm:mb-6 lg:sticky lg:top-24"
              >
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Book Appointment</h3>
                  <p className="text-cyan-100 text-xs sm:text-sm">Get expert medical care today</p>
                </div>
                <div className="p-4 sm:p-6">
                  {/* Visiting Time */}
                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm text-slate-500 mb-1 sm:mb-2">Visiting Time</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-800">{formatTimeToAMPM(doctor.visiting_time) || "9:00 AM - 2:00 PM"}</p>
                  </div>
                  
                  {/* Visiting Days */}
                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">Available Days</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {dayNames.map((day) => {
                        const isAvailable = visitingDaysArray.some(d => 
                          d.toLowerCase() === day.toLowerCase()
                        );
                        return (
                          <span 
                            key={day}
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold ${
                              isAvailable 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Serial Info */}
                  {doctor.serial_note && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                      <p className="text-xs sm:text-sm text-amber-600 font-medium">Serial Information</p>
                      <p className="text-amber-800 font-semibold mt-1 text-sm sm:text-base">{formatTimeToAMPM(doctor.serial_note)}</p>
                    </div>
                  )}

                  {/* Book Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link 
                      href="/appointment" 
                      className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-center text-sm sm:text-base hover:from-cyan-600 hover:to-blue-700 transition shadow-lg shadow-cyan-500/25"
                    >
                      Book Now
                    </Link>
                  </motion.div>

                  {/* Quick Contact */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100">
                    <p className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">Quick Contact</p>
                    <div className="space-y-2 sm:space-y-3">
                      {doctor.phone && (
                        <motion.a 
                          whileHover={{ scale: 1.02 }}
                          href={`tel:${doctor.phone}`}
                          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl hover:bg-green-50 transition"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <span className="text-slate-700 font-medium text-sm sm:text-base truncate">{doctor.phone}</span>
                        </motion.a>
                      )}
                      {doctor.email && (
                        <motion.a 
                          whileHover={{ scale: 1.02 }}
                          href={`mailto:${doctor.email}`}
                          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl hover:bg-purple-50 transition"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-slate-700 font-medium text-sm sm:text-base truncate">{doctor.email}</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Department Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-4">Department</h3>
                <Link
                  href={`/departments/${(doctor.department || 'medicine').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm sm:text-base">{doctor.department}</p>
                    <p className="text-xs sm:text-sm text-slate-500">View all doctors</p>
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {/* Tabs - Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex gap-1.5 sm:gap-2 mb-5 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide"
              >
                {['overview', 'schedule', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </motion.div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Info Cards Grid - Responsive */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {[
                      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'blue', label: 'Specialization', value: doctor.specialization },
                      { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'cyan', label: 'Degrees', value: doctor.degrees },
                      { icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'teal', label: 'Designation', value: doctor.designation },
                      { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'purple', label: 'Institute', value: doctor.institute },
                      { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', color: 'orange', label: 'Room No.', value: doctor.room_no || 'TBA' },
                      { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'rose', label: 'Experience', value: `${doctor.experience_years || 0} Years` },
                    ].map((item, index) => (
                      <motion.div 
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg border border-slate-100 hover:shadow-xl transition"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-${item.color}-100 rounded-lg sm:rounded-xl flex items-center justify-center`}>
                            <svg className={`w-4 h-4 sm:w-6 sm:h-6 text-${item.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-500">{item.label}</p>
                        </div>
                        <p className="text-slate-800 font-bold text-sm sm:text-lg line-clamp-2">{item.value || 'Not specified'}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* About Section */}
                  {doctor.description && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 mb-6 sm:mb-8"
                    >
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
                        About {doctor.name.split(' ')[1] || doctor.name}
                      </h3>
                      <div className="prose max-w-none">
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                          {doctor.description}
                        </p>
                      </div>
                      
                      {/* Achievement Badges */}
                      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100">
                        <p className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-4">Achievements & Certifications</p>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 rounded-full text-xs sm:text-sm font-medium border border-cyan-200">
                            ✓ Verified Profile
                          </span>
                          <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-xs sm:text-sm font-medium border border-green-200">
                            ★ Top Rated
                          </span>
                          <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-full text-xs sm:text-sm font-medium border border-purple-200">
                            🎓 Expert Member
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Education & Training */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                      <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></span>
                      Education & Training
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {doctor.degrees && doctor.degrees.split(',').map((degree, index) => (
                        <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm sm:text-base">{degree.trim()}</p>
                            <p className="text-xs sm:text-sm text-slate-500">{doctor.institute || 'Medical University'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Schedule Tab */}
              {activeTab === 'schedule' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Weekly Schedule</h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {dayNames.map((day, index) => {
                      const isAvailable = visitingDaysArray.some(d => 
                        d.toLowerCase() === day.toLowerCase()
                      );
                      return (
                        <motion.div
                          key={day}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-5 rounded-xl sm:rounded-2xl gap-3 sm:gap-0 ${
                            isAvailable 
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
                              : 'bg-slate-50 border-2 border-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${
                              isAvailable ? 'bg-green-500' : 'bg-slate-300'
                            }`}>
                              <span className="text-white font-bold text-sm sm:text-base">{day.slice(0, 2)}</span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm sm:text-base">{day}</p>
                              <p className={`text-xs sm:text-sm ${isAvailable ? 'text-green-600' : 'text-slate-400'}`}>
                                {isAvailable ? 'Available' : 'Not Available'}
                              </p>
                            </div>
                          </div>
                          {isAvailable && (
                            <div className="text-left sm:text-right pl-13 sm:pl-0">
                              <p className="font-bold text-green-700 text-sm sm:text-base">{formatTimeToAMPM(doctor.visiting_time) || "9:00 AM - 2:00 PM"}</p>
                              <p className="text-xs sm:text-sm text-green-600">Get appointment</p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Note */}
                  <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-amber-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-amber-800 text-sm sm:text-base">Important Note</p>
                        <p className="text-amber-700 mt-1 text-xs sm:text-sm">
                          {doctor.serial_note || "Please arrive 30 minutes before your scheduled appointment time. Emergency cases may cause delays."}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-5 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Patient Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-slate-800">5.0</span>
                      <span className="text-slate-500 text-xs sm:text-sm">(124 reviews)</span>
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-4 sm:space-y-6">
                    {[
                      { name: 'Sarah Johnson', date: '2 days ago', rating: 5, comment: 'Excellent doctor! Very knowledgeable and patient. Highly recommended for any medical issues.' },
                      { name: 'Michael Chen', date: '1 week ago', rating: 5, comment: 'Great experience. The doctor took time to explain everything and answer all my questions.' },
                      { name: 'Emily Davis', date: '2 weeks ago', rating: 5, comment: 'Very professional and caring. The treatment was effective and I recovered quickly.' },
                    ].map((review, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 sm:p-6 bg-slate-50 rounded-xl sm:rounded-2xl"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm sm:text-base">{review.name}</p>
                              <p className="text-xs sm:text-sm text-slate-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm sm:text-base">{review.comment}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Related Doctors - Responsive */}
              {relatedDoctors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 sm:mt-12"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></span>
                    Related Doctors
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {relatedDoctors.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-slate-100"
                      >
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 sm:p-6 text-center relative">
                          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img
                              src={getDoctorImage(doc.image, doc.id)}
                              alt={doc.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = `https://randomuser.me/api/portraits/${doc.id % 2 === 0 ? "men" : "women"}/${(doc.id * 17) % 90}.jpg`;
                              }}
                            />
                          </div>
                        </div>
                        <div className="p-4 sm:p-5 text-center">
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1">{doc.name}</h4>
                          <p className="text-cyan-600 font-medium text-xs sm:text-sm line-clamp-1">{doc.specialization}</p>
                          <Link
                            href={`/doctors/${doc.id}`}
                            className="mt-3 inline-block px-4 py-1.5 sm:px-5 sm:py-2 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:bg-cyan-500 hover:text-white transition"
                          >
                            View Profile
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Back Link */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 sm:mt-12 text-center"
              >
                <Link href="/" className="inline-flex items-center gap-1.5 sm:gap-2 text-cyan-600 hover:text-cyan-800 font-medium transition text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Share Modal - Responsive */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl mx-3 sm:mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Share Doctor Profile</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl hover:from-green-600 hover:to-green-700 transition shadow-lg shadow-green-500/25"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="font-semibold text-sm sm:text-base">Share on WhatsApp</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyToClipboard}
                  className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl sm:rounded-2xl hover:from-slate-800 hover:to-slate-900 transition shadow-lg"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold text-sm sm:text-base">Copy Link</span>
                </motion.button>
              </div>

              {/* URL Display */}
              <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
                <p className="text-xs sm:text-sm text-slate-500 mb-1 sm:mb-2">Profile Link</p>
                <p className="text-slate-700 font-medium text-xs sm:text-sm truncate">{typeof window !== 'undefined' ? window.location.href : ''}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}