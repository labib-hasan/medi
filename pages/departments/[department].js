import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";

// Department data (keep as is from your original code)
const departmentData = { /* ... your existing department data ... */ };

// Department mapping (keep as is)
const departmentMap = { /* ... your existing mapping ... */ };

// Fallback doctors (keep as is)
const allFallbackDoctors = [ /* ... your existing fallback doctors ... */ ];

// Utility functions (keep as is)
const getDoctorImage = (id) => `https://randomuser.me/api/portraits/${id % 2 === 0 ? "men" : "women"}/${(id * 17) % 90}.jpg`;

const formatTimeToAMPM = (timeString) => { /* ... your existing function ... */ };

const getVisitingDaysArray = (days) => { /* ... your existing function ... */ };

// Optimized Floating Particle with reduced animation complexity
const FloatingParticle = ({ delay = 0, size = 4, left = "0%", top = "0%" }) => (
  <motion.div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: "rgba(59, 130, 246, 0.2)",
      left,
      top,
      filter: "blur(1px)",
      willChange: "transform",
      pointerEvents: "none"
    }}
    animate={{
      y: [0, -20, 0],
      opacity: [0.2, 0.4, 0.2]
    }}
    transition={{
      duration: 6,
      delay,
      repeat: Infinity,
      ease: "linear",
      repeatType: "mirror"
    }}
  />
);

// Optimized Gradient Orb with GPU acceleration
const GradientOrb = ({ position, color1 = "#3b82f6", color2 = "#06b6d4", size = 300, blur = 100 }) => (
  <motion.div
    style={{
      position: "absolute",
      ...position,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color1} 0%, ${color2} 70%, transparent 100%)`,
      filter: `blur(${blur}px)`,
      opacity: 0.15,
      zIndex: 0,
      pointerEvents: "none",
      willChange: "transform"
    }}
    animate={{
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.5, 1]
    }}
  />
);

// Optimized Section Header with reduced animation complexity
const SectionHeader = ({ title, subtitle, icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: "48px", position: "relative" }}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        style={{
          width: 64,
          height: 64,
          margin: "0 auto 16px",
          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          boxShadow: "0 20px 30px -10px rgba(59, 130, 246, 0.3)",
          transform: "rotate(45deg)",
          willChange: "transform"
        }}
      >
        <span style={{ transform: "rotate(-45deg)", fontSize: 28 }}>{icon}</span>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          fontSize: "clamp(28px, 5vw, 40px)",
          fontWeight: 800,
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 8
        }}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          style={{
            color: "#64748b",
            fontSize: 18,
            maxWidth: 600,
            margin: "0 auto"
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

// Optimized Stat Card with hover optimization
const StatCard = ({ icon, value, label, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ 
        y: -3, 
        boxShadow: "0 25px 35px -12px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.15 }
      }}
      style={{
        background: "white",
        padding: 20,
        borderRadius: 20,
        boxShadow: "0 15px 30px -12px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(226, 232, 240, 0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "default",
        willChange: "transform"
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: "linear-gradient(135deg, #dbeafe, #e0f2fe)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>{value}</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>
      </div>
    </motion.div>
  );
};

// Custom hook for scroll animations
const useInView = (ref, options = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isInView;
};

export default function DepartmentPage() {
  const [coverImages, setCoverImages] = useState({});
  const router = useRouter();
  const { department } = router.query;
  const [doctors, setDoctors] = useState(allFallbackDoctors);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const heroRef = useRef(null);
  
  // Smooth scroll animation
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const springConfig = { stiffness: 100, damping: 30, mass: 0.5 };
  const smoothHeroScale = useSpring(heroScale, springConfig);
  const smoothHeroOpacity = useSpring(heroOpacity, springConfig);

  const t = translations[language] || translations.en;
  const deptConfig = useMemo(() => departmentData[department] || departmentData["medicine"], [department]);
  const isBangla = language === 'bn';

  // Memoize translations
  const getTitle = useCallback((obj) => obj[language] || obj.en, [language]);
  const getIntro = useCallback((obj) => obj[language] || obj.en, [language]);

  const MAX_VISIBLE_DOCTORS = 6; // Reduced for better performance
  const displayedDoctors = useMemo(() => 
    showAll ? doctors : doctors.slice(0, MAX_VISIBLE_DOCTORS),
    [doctors, showAll]
  );
  const hasMoreDoctors = doctors.length > MAX_VISIBLE_DOCTORS;

  // Optimized data fetching
  useEffect(() => {
    if (department) {
      fetchDoctors();
    }
  }, [department]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hospital_cover_images");
      if (saved) {
        try {
          setCoverImages(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing cover images", e);
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
      
      // Use AbortController for cleanup
      const controller = new AbortController();
      const signal = controller.signal;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`, { signal });
      if (!response.ok) {
        console.log("API response not ok, using fallback data");
        const standardDeptName = departmentMap[department] || department.replace(/-/g, ' ').replace(/&/g, 'and');
        const filteredFallback = allFallbackDoctors.filter(doc => {
          const docDept = (doc.department || '');
          return docDept === standardDeptName;
        });
        if (filteredFallback.length > 0) {
          setDoctors(filteredFallback);
        }
        setLoading(false);
        return;
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const standardDeptName = departmentMap[department] || department.replace(/-/g, ' ').replace(/&/g, 'and');
        const standardDeptNameLower = standardDeptName.toLowerCase();
        const urlDeptNameLower = department.replace(/-/g, ' ').replace(/&/g, 'and').toLowerCase();
        
        const filteredDoctors = data.filter(doc => {
          const docDept = (doc.department || '').toLowerCase().trim();
          const docDeptRaw = (doc.department || '').trim();
          
          const match1 = docDept === standardDeptNameLower;
          const match2 = docDept === urlDeptNameLower;
          const match3 = docDeptRaw === standardDeptName;
          
          return match1 || match2 || match3;
        });

        if (filteredDoctors.length > 0) {
          setDoctors(filteredDoctors);
        } else {
          const filteredFallback = allFallbackDoctors.filter(doc => {
            const docDept = (doc.department || '');
            return docDept === standardDeptName;
          });
          if (filteredFallback.length > 0) {
            setDoctors(filteredFallback);
          } else {
            setDoctors([]);
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching doctors:", error);
        const standardDeptName = departmentMap[department] || department.replace(/-/g, ' ').replace(/&/g, 'and');
        const filteredFallback = allFallbackDoctors.filter(doc => {
          const docDept = (doc.department || '');
          return docDept === standardDeptName;
        });
        if (filteredFallback.length > 0) {
          setDoctors(filteredFallback);
        } else {
          setDoctors([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getCoverImage = useCallback(() => {
    const key = `dept_${department}`;
    return (
      coverImages[key] ||
      deptConfig.image ||
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200"
    );
  }, [coverImages, department, deptConfig]);

  // Translation helpers
  const dayNames = useMemo(() => isBangla 
    ? ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"]
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    [isBangla]
  );

  // Premium Stats
  const departmentStats = useMemo(() => [
    { icon: "👨‍⚕️", value: doctors.length, label: isBangla ? "বিশেষজ্ঞ ডাক্তার" : "Specialists" },
    { icon: "🏥", value: "24/7", label: isBangla ? "সেবা" : "Service" },
    { icon: "⭐", value: "15+", label: isBangla ? "বছরের অভিজ্ঞতা" : "Years Experience" },
    { icon: "🛏️", value: "50+", label: isBangla ? "শয্যা" : "Beds" }
  ], [doctors.length, isBangla]);

  return (
    <>
      <Navbar />
      
      <div style={{ paddingTop: "80px" }}>
        
        {/* Premium Hero Section with Smooth Parallax */}
        <section
          ref={heroRef}
          style={{
            position: "relative",
            height: "clamp(400px, 80vh, 500px)",
            overflow: "hidden",
            background: "#0f172a"
          }}
        >
          {/* Background Image with Smooth Parallax */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${getCoverImage()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.4) saturate(1.2)",
              scale: smoothHeroScale,
              opacity: smoothHeroOpacity,
              willChange: "transform"
            }}
          />
          
          {/* Animated Gradient Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%)"
            }}
          />
          
          {/* Floating Particles - Reduced count for performance */}
          <FloatingParticle left="10%" top="20%" delay={0} size={6} />
          <FloatingParticle left="80%" top="40%" delay={2} size={5} />
          
          {/* Content */}
          <div style={{
            position: "relative",
            height: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            zIndex: 10
          }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: 800 }}
            >
              {/* Breadcrumb */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: 14,
                fontWeight: 500
              }}>
                <Link href="/" style={{ color: "white", opacity: 0.8, textDecoration: "none" }}>
                  {isBangla ? "হোম" : "Home"}
                </Link>
                <span style={{ color: "#3b82f6" }}>•</span>
                <span style={{ color: "white" }}>{getTitle(deptConfig.title)}</span>
              </div>
              
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  fontSize: "clamp(36px, 7vw, 64px)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginBottom: 12,
                  background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                {getTitle(deptConfig.title)}
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  fontSize: 18,
                  color: "rgba(255, 255, 255, 0.8)",
                  maxWidth: 600,
                  marginBottom: 28,
                  lineHeight: 1.5
                }}
              >
                {getTitle(deptConfig.subtitle)}
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{
                    padding: "14px 28px",
                    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                    border: "none",
                    borderRadius: 36,
                    color: "white",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 15px 25px -8px rgba(59, 130, 246, 0.4)"
                  }}
                >
                  {isBangla ? "এপয়েন্টমেন্ট নিন" : "Book Appointment"}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{
                    padding: "14px 28px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 36,
                    color: "white",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    backdropFilter: "blur(8px)"
                  }}
                >
                  {isBangla ? "ডাক্তার দেখুন" : "View Doctors"}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Bottom Gradient */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(to top, #f8fafc, transparent)"
          }} />
        </section>

        {/* Main Content */}
        <main style={{
          position: "relative",
          background: "#f8fafc",
          padding: "60px 0",
          overflow: "hidden"
        }}>
          {/* Background Decorative Elements - Reduced for performance */}
          <GradientOrb position={{ top: "-150px", right: "-150px" }} size={300} blur={100} />
          <GradientOrb position={{ bottom: "-150px", left: "-150px" }} color1="#f97316" color2="#fbbf24" size={300} blur={100} />
          
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
            
            {/* Quick Stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
              marginBottom: 60
            }}>
              {departmentStats.map((stat, index) => (
                <StatCard key={index} {...stat} delay={index * 0.05} />
              ))}
            </div>

            {/* Department Introduction */}
            {deptConfig.intro && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
                style={{
                  background: "white",
                  borderRadius: 32,
                  padding: 40,
                  marginBottom: 60,
                  boxShadow: "0 25px 50px -15px rgba(0, 0, 0, 0.15)",
                  border: "1px solid rgba(226, 232, 240, 0.6)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Decorative Element */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 250,
                  height: 250,
                  background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
                  borderRadius: "50%",
                  pointerEvents: "none"
                }} />
                
                <div style={{ position: "relative", zIndex: 2 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 70 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{
                      height: 4,
                      background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                      borderRadius: 2,
                      marginBottom: 20
                    }}
                  />
                  <p style={{
                    fontSize: 17,
                    lineHeight: 1.7,
                    color: "#334155",
                    margin: 0
                  }}>
                    {getIntro(deptConfig.intro)}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Tabs Navigation */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginBottom: 40,
              flexWrap: "wrap"
            }}>
              {[
                { id: "overview", label: isBangla ? "ওভারভিউ" : "Overview", icon: "📊" },
                { id: "services", label: isBangla ? "সেবাসমূহ" : "Services", icon: "⚕️" },
                { id: "facilities", label: isBangla ? "সুবিধা" : "Facilities", icon: "🏥" },
                { id: "doctors", label: isBangla ? "ডাক্তার" : "Doctors", icon: "👨‍⚕️" }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{
                    padding: "10px 24px",
                    background: activeTab === tab.id 
                      ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                      : "white",
                    border: activeTab === tab.id ? "none" : "1px solid #e2e8f0",
                    borderRadius: 36,
                    color: activeTab === tab.id ? "white" : "#64748b",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: activeTab === tab.id 
                      ? "0 15px 25px -8px rgba(59, 130, 246, 0.4)"
                      : "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                    transition: "background 0.2s"
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Services Grid */}
                  <SectionHeader 
                    title={isBangla ? "আমাদের সেবাসমূহ" : "Our Services"}
                    subtitle={isBangla ? "আমরা প্রদান করি এমন বিশেষায়িত সেবা" : "Specialized care we provide"}
                    icon="⚕️"
                  />
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 20
                  }}>
                    {deptConfig.services.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        whileHover={{ 
                          y: -4, 
                          boxShadow: "0 25px 40px -15px rgba(0, 0, 0, 0.15)",
                          transition: { duration: 0.15 }
                        }}
                        style={{
                          background: "white",
                          borderRadius: 20,
                          padding: 28,
                          boxShadow: "0 15px 30px -12px rgba(0, 0, 0, 0.1)",
                          border: "1px solid rgba(226, 232, 240, 0.6)",
                          position: "relative",
                          overflow: "hidden",
                          cursor: "default",
                          willChange: "transform"
                        }}
                      >
                        {/* Icon */}
                        <div style={{
                          width: 44,
                          height: 44,
                          background: "linear-gradient(135deg, #dbeafe, #e0f2fe)",
                          borderRadius: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          marginBottom: 14
                        }}>
                          {String.fromCodePoint(0x1F489 + i)}
                        </div>
                        
                        <h3 style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: 6
                        }}>
                          {getTitle(item.title)}
                        </h3>
                        
                        <p style={{
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: "#64748b",
                          margin: 0
                        }}>
                          {getIntro(item.desc)}
                        </p>
                        
                        {/* Hover Effect Line */}
                        <motion.div
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            height: 3,
                            background: "linear-gradient(90deg, #3b82f6, #06b6d4)"
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "services" && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionHeader 
                    title={isBangla ? "বিস্তারিত সেবা" : "Detailed Services"}
                    subtitle={isBangla ? "আমাদের বিশেষায়িত চিকিৎসা সেবা" : "Our specialized medical services"}
                    icon="🔬"
                  />
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: 16
                  }}>
                    {deptConfig.services.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        whileHover={{ 
                          y: -3,
                          boxShadow: "0 20px 35px -12px rgba(0, 0, 0, 0.12)",
                          transition: { duration: 0.15 }
                        }}
                        style={{
                          background: "white",
                          borderRadius: 18,
                          padding: 20,
                          boxShadow: "0 8px 20px -8px rgba(0, 0, 0, 0.08)",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                          cursor: "default",
                          willChange: "transform"
                        }}
                      >
                        <div style={{
                          width: 36,
                          height: 36,
                          background: "#3b82f6",
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: 18
                        }}>
                          {i + 1}
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
                          {getTitle(item.title)}
                        </h3>
                        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                          {getIntro(item.desc)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "facilities" && (
                <motion.div
                  key="facilities"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionHeader 
                    title={isBangla ? "সুবিধা ও সেবা" : "Facilities & Services"}
                    subtitle={isBangla ? "আধুনিক সুবিধাসমূহ" : "Modern amenities and features"}
                    icon="🏛️"
                  />
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12
                  }}>
                    {Array.isArray(deptConfig.facilities) && deptConfig.facilities.map((f, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ delay: i * 0.02, duration: 0.25 }}
                        whileHover={{ 
                          scale: 1.03, 
                          backgroundColor: "#f0f9ff",
                          boxShadow: "0 10px 20px -8px rgba(0, 0, 0, 0.08)",
                          transition: { duration: 0.15 }
                        }}
                        style={{
                          background: "white",
                          borderRadius: 14,
                          padding: 16,
                          textAlign: "center",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                          border: "1px solid #e2e8f0",
                          cursor: "default",
                          transition: "background 0.2s",
                          willChange: "transform"
                        }}
                      >
                        <div style={{
                          fontSize: 28,
                          marginBottom: 6
                        }}>
                          {String.fromCodePoint(0x1F3E5 + i % 10)}
                        </div>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#1e293b"
                        }}>
                          {typeof f === 'object' ? (f[language] || f.en) : f}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "doctors" && (
                <motion.div
                  key="doctors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionHeader 
                    title={isBangla ? "আমাদের বিশেষজ্ঞ ডাক্তার" : "Our Specialist Doctors"}
                    subtitle={`${doctors.length} ${isBangla ? "জন ডাক্তার উপলব্ধ" : "doctors available"}`}
                    icon="👥"
                  />

                  {loading ? (
                    <div style={{ textAlign: "center", padding: 50 }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: 40,
                          height: 40,
                          border: "3px solid #e2e8f0",
                          borderTopColor: "#3b82f6",
                          borderRadius: "50%",
                          margin: "0 auto"
                        }}
                      />
                    </div>
                  ) : displayedDoctors.length > 0 ? (
                    <>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 20
                      }}>
                        {displayedDoctors.map((doctor, index) => {
                          const visitingDaysArray = getVisitingDaysArray(doctor.visiting_days);
                          const visitingDaysText = visitingDaysArray.length > 0 
                            ? `${isBangla ? "শুধুমাত্র " : "Only "}${visitingDaysArray.join(", ")}` 
                            : (isBangla ? "নির্দিষ্ট নয়" : "Not specified");
                          
                          return (
                            <motion.div
                              key={doctor.id || index}
                              initial={{ opacity: 0, y: 15 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-30px" }}
                              transition={{ duration: 0.2, delay: index * 0.03 }}
                              whileHover={{
                                y: -4,
                                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)"
                              }}
                              style={{
                                maxWidth: "280px",
                                borderRadius: "24px",
                                overflow: "hidden",
                                background: "#f9fafb",
                                margin: "0 auto",
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                boxShadow: "0 10px 25px -8px rgba(0, 0, 0, 0.1)",
                                transition: "box-shadow 0.2s",
                                willChange: "transform"
                              }}
                            >
                              {/* IMAGE */}
                              <div style={{ position: "relative" }}>
                                <img
                                  src={doctor.image || getDoctorImage(doctor.id || index + 1)}
                                  alt={doctor.name}
                                  style={{
                                    width: "100%",
                                    clipPath: "polygon(0 0, 100% 0, 100% 75%, 0% 100%)",
                                    height: "260px",
                                    objectFit: "cover",
                                    objectPosition: "top center",
                                    transition: "transform 0.3s"
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
                                    background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(150, 159, 186, 0.25) 100%)"
                                  }}
                                />

                                {/* availability */}
                               <div style={{
                                  position: "absolute",
                                  top: 8,
                                  left: 8,
                                  background: "#10b981",
                                  color: "white",
                                  fontSize: "9px",
                                  fontWeight: 600,
                                  padding: "3px 8px",
                                  borderRadius: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4
                                }}>
                                  <span style={{
                                    width: 6,
                                    height: 6,
                                    background: "white",
                                    borderRadius: "50%",
                                    animation: "pulse 2s infinite"
                                  }}></span>
                                  {isBangla ? "উপলব্ধ" : "Available"}
                                </div>

                                {/* circle button */}
                                <motion.div
                                  initial={{ scale: 0 }}
                                  whileInView={{ scale: 1 }}
                                  transition={{ delay: index * 0.03 + 0.1 }}
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  style={{
                                    position: "absolute",
                                    bottom: 20,
                                    right: 20,
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    boxShadow: "0 8px 16px -4px rgba(0,0,0,0.2)",
                                    cursor: "pointer",
                                    zIndex: 20,
                                    willChange: "transform"
                                  }}
                                  onClick={() => window.location.href = `/doctors/${doctor.id}`}
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7z" />
                                  </svg>
                                </motion.div>
                              </div>

                              {/* CONTENT */}
                              <div style={{ padding: "12px", display: "flex", flexDirection: "column", flexGrow: 1 }}>

                                <h3 style={{
                                  fontWeight: 700,
                                  fontSize: 18,
                                  marginTop: "auto",
                                  color: "#1e293b",
                                  textAlign: "center"
                                }}>
                                  {doctor.name}
                                </h3>

                                <p style={{
                                  color: "#2563eb",
                                  fontSize: "11px",
                                  textAlign: "center",
                                  marginTop: "auto"
                                }}>
                                  {doctor.degrees || doctor.specialization}
                                </p>

                                <p style={{
                                  color: "#64748b",
                                  fontSize: "11px",
                                  textAlign: "center",
                                  marginTop: "auto"
                                }}>
                                  {doctor.designation || (isBangla ? "পরামর্শক" : "Consultant")}
                                </p>

                                {/* stats */}
                                <div style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(3, 1fr)",
                                  textAlign: "center",
                                  borderTop: "1px solid #e2e8f0",
                                  borderBottom: "1px solid #e2e8f0",
                                  marginTop: "auto",
                                  fontSize: "10px"
                                }}>

                                  <div style={{ textAlign: "center", padding: "6px 0" }}>
                                    <p style={{ color: "#94a3b8", fontSize: "9px", margin: 0 }}>
                                      {isBangla ? "অভিজ্ঞতা" : "Experience"}
                                    </p>
                                    <p style={{ fontWeight: 600, color: "#1e293b", margin: 0 }}>
                                      {doctor.experience_years || "5"}
                                      <span style={{ fontSize: 9, marginLeft: 2 }}>
                                        {isBangla ? "বছর" : "yrs"}
                                      </span>
                                    </p>
                                  </div>

                                  <div style={{
                                    textAlign: "center",
                                    borderLeft: "1px solid #e2e8f0",
                                    borderRight: "1px solid #e2e8f0",
                                    padding: "6px 0"
                                  }}>
                                    <p style={{ color: "#94a3b8", fontSize: "9px", margin: 0 }}>
                                      {isBangla ? "রুম নং" : "Room"}
                                    </p>
                                    <p style={{ fontWeight: 600, color: "#1e293b", margin: 0 }}>
                                      {doctor.room_no || (isBangla ? "টিবিএ" : "TBA")}
                                    </p>
                                  </div>

                                  <div style={{ textAlign: "center", padding: "6px 0" }}>
                                    <p style={{ color: "#94a3b8", fontSize: "9px", margin: 0 }}>
                                      {isBangla ? "সময়" : "Time"}
                                    </p>
                                    <p style={{ fontWeight: 600, color: "#1e293b", fontSize: "10px", margin: 0 }}>
                                      {formatTimeToAMPM(doctor.visiting_time) || "9 AM"}
                                    </p>
                                  </div>

                                </div>

                                {/* hospital */}
                                <p style={{
                                  color: "#64748b",
                                  fontSize: "10px",
                                  textAlign: "center",
                                  marginTop: "auto",
                                  padding: "6px 0"
                                }}>
                                  <span style={{ fontWeight: 500, color: "#475569" }}>
                                    {isBangla ? "হাসপাতাল:" : "Hospital:"}
                                  </span>{" "}
                                  {doctor.institute || "Medical Center"}
                                </p>

                                {/* phone */}
                                {doctor.phone && (
                                  <p style={{
                                    color: "#4b5563",
                                    fontSize: "11px",
                                    textAlign: "center",
                                    marginTop: "auto",
                                    padding: "2px 0 6px"
                                  }}>
                                    <span style={{ fontWeight: 500, color: "#475569" }}>
                                      {isBangla ? "ফোন:" : "Phone:"}
                                    </span>{" "}
                                    {doctor.phone}
                                  </p>
                                )}

                                {/* BUTTON */}
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  style={{ marginTop: "auto" }}
                                >
                                  <Link
                                    href={`/doctors/${doctor.id}`}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: 8,
                                      width: "100%",
                                      padding: "10px 0",
                                      background: "linear-gradient(90deg, #2563eb, #0891b2)",
                                      color: "white",
                                      borderRadius: "24px",
                                      fontWeight: 600,
                                      fontSize: 13,
                                      textDecoration: "none",
                                      boxShadow: "0 8px 16px -4px rgba(37, 99, 235, 0.2)"
                                    }}
                                  >
                                    {isBangla ? "সম্পূর্ণ প্রোফাইল দেখুন" : "View Full Profile"}
                                  </Link>
                                </motion.div>

                              </div>

                            </motion.div>
                          );
                        })}
                      </div>

                      {/* View All / Show Less Button */}
                      {(hasMoreDoctors || showAll) && (
                        <div style={{ textAlign: "center", marginTop: 40 }}>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowAll(!showAll)}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            style={{
                              padding: "14px 36px",
                              background: showAll ? "white" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
                              border: showAll ? "2px solid #3b82f6" : "none",
                              borderRadius: 36,
                              color: showAll ? "#3b82f6" : "white",
                              fontSize: 15,
                              fontWeight: 600,
                              cursor: "pointer",
                              boxShadow: showAll 
                                ? "none"
                                : "0 15px 25px -8px rgba(59, 130, 246, 0.4)"
                            }}
                          >
                            {showAll 
                              ? (isBangla ? "কম দেখুন ↑" : "Show Less ↑")
                              : (isBangla ? `সব ${doctors.length} জন ডাক্তার দেখুন →` : `View All ${doctors.length} Doctors →`)}
                          </motion.button>
                        </div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        textAlign: "center",
                        padding: 50,
                        background: "white",
                        borderRadius: 28,
                        boxShadow: "0 15px 30px -12px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      <div style={{ fontSize: 44, marginBottom: 12 }}>👨‍⚕️</div>
                      <p style={{ fontSize: 16, color: "#64748b" }}>
                        {isBangla ? "কোনো বিশেষজ্ঞ পাওয়া যায়নি" : "No specialists found"}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Premium CTA Section */}
        <section style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden"
        }}>
          <GradientOrb position={{ top: "-150px", right: "-150px" }} color1="#3b82f6" color2="#06b6d4" size={400} blur={120} />
          <GradientOrb position={{ bottom: "-150px", left: "-150px" }} color1="#f97316" color2="#fbbf24" size={400} blur={120} />
          
          <div style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 2,
            textAlign: "center"
          }}>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              style={{
                fontSize: "clamp(28px, 4.5vw, 42px)",
                fontWeight: 700,
                color: "white",
                marginBottom: 20,
                maxWidth: 700,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              {isBangla 
                ? "আপনার স্বাস্থ্য আমাদের অগ্রাধিকার" 
                : "Your Health is Our Priority"}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 32,
                maxWidth: 500,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              {isBangla 
                ? "আজই অ্যাপয়েন্টমেন্ট নিন এবং বিশেষজ্ঞ ডাক্তারের পরামর্শ নিন" 
                : "Book an appointment today and consult with our specialist doctors"}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 25px 35px -12px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  padding: "16px 42px",
                  background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  border: "none",
                  borderRadius: 40,
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 15px 25px -8px rgba(59, 130, 246, 0.4)"
                }}
              >
                {isBangla ? "এপয়েন্টমেন্ট নিন" : "Book Appointment"}
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        img {
          image-rendering: -webkit-optimize-contrast;
        }
      `}</style>
    </>
  );
}