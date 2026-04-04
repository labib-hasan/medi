import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchDoctors, fetchServices, fetchDepartments } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";

import HeroImageUpload from "../components/HeroImageUpload";

const mockDoctors = [
  { id: 1, name: "Dr. Sarah Ahmed", specialization: "Cardiologist" },
  { id: 2, name: "Dr. James Miller", specialization: "Neurologist" },
  { id: 3, name: "Dr. Ayesha Rahman", specialization: "Dermatologist" },
  { id: 4, name: "Dr. Michael Lee", specialization: "Orthopedic" },
];

// Get doctor image - use database image or fallback to placeholder
const getDoctorImage = (doctor) => {
  if (doctor && doctor.image) {
    return doctor.image;
  }
  return '/placeholder-doctor.jpg';
};

export default function HomePage() {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef([]);
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [doctors, setDoctors] = useState(mockDoctors);
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const doctorsData = await fetchDoctors();
        if (doctorsData && doctorsData.length > 0) {
          setDoctors(doctorsData);
        } else {
          setDoctors(mockDoctors);
        }

        const servicesData = await fetchServices();
        setServices(servicesData || []);

        const departmentsData = await fetchDepartments();
        setDepartments(departmentsData || []);

      } catch (error) {
        console.error("API failed, using fallback doctors:", error);
        setDoctors(mockDoctors);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true,
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  
  // Days array for translations
  const weekDays = language === 'bn' 
    ? ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"]
    : ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const targetDepartments = [
    { key: "icu", match: ["icu"] },
    { key: "ccu", match: ["ccu"] },
    { key: "hdu", match: ["hdu"] },
    { key: "sdu", match: ["sdu"] },
    { key: "nicu", match: ["nicu"] },
    { key: "gynae", match: ["gynae", "gyne"] },
    { key: "pediatric", match: ["pediatric", "paedi"] },
    { key: "ot", match: ["ot", "operation"] },
    { key: "ed", match: ["ed", "emergency"] },
    { key: "dialysis", match: ["dialysis", "kidney"] },
  ];

  const selectedDoctors = targetDepartments
    .map((dept) =>
      doctors.find((doctor) => {
        const deptName = doctor.department?.toLowerCase() || "";
        const specName = doctor.specialization?.toLowerCase() || "";
        return dept.match.some((m) => deptName.includes(m) || specName.includes(m));
      })
    )
    .filter(Boolean);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-[88px] lg:pt-[120px]">
        <HeroImageUpload isAdmin={false} />
      </section>

      {/* Quick Access Tiles */}
      <section
        ref={(el) => (sectionRefs.current[0] = el)}
        data-section="tiles"
        className={`care-tiles transition-all duration-1000 ${
          visibleSections.tiles ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="care-tiles-wrap">
          <Link href="/departments" className="care-tile group hover-lift">
            <span className="tile-glow" />
            <Image
              src="https://i0.wp.com/parkview.com.bd/wp-content/uploads/2015/09/icon_tree_white.png"
              alt={t.tileDepartments}
              width={60}
              height={60}
              unoptimized
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <h3 className="font-bold text-lg mb-2">{t.tileDepartments}</h3>
            <p className="text-sm">{language === 'bn' ? 'আমাদের ক্লিনিকের মেরুদণ্ড' : 'The backbone of our clinic'}</p>
          </Link>

          <Link href="/services" className="care-tile group hover-lift">
            <span className="tile-glow" />
            <Image
              src="https://i0.wp.com/parkview.com.bd/wp-content/uploads/2015/09/icon_med_book_white.png"
              alt={t.tileServices}
              width={60}
              height={60}
              unoptimized
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <h3 className="font-bold text-lg mb-2">{t.tileServices}</h3>
            <p className="text-sm">{language === 'bn' ? 'সকল উপলব্ধ চিকিৎসা' : 'All available treatments'}</p>
          </Link>

          <Link href="/doctors" className="care-tile group hover-lift">
            <span className="tile-glow" />
            <Image
              src="https://i0.wp.com/parkview.com.bd/wp-content/uploads/2015/09/icon_doctor1.png"
              alt={t.tileDoctors}
              width={60}
              height={60}
              unoptimized
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <h3 className="font-bold text-lg mb-2">{t.tileDoctors}</h3>
            <p className="text-sm">{language === 'bn' ? 'আমাদের বিশেষজ্ঞদের দেখুন' : 'Browse our specialists'}</p>
          </Link>

          <Link href="/appointment" className="care-tile group hover-lift">
            <span className="tile-glow" />
            <Image
              src="https://i0.wp.com/parkview.com.bd/wp-content/uploads/2015/09/icon_help_desk1.png"
              alt={t.tileAppointment}
              width={60}
              height={60}
              unoptimized
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <h3 className="font-bold text-lg mb-2">{t.tileAppointment}</h3>
            <p className="text-sm">{language === 'bn' ? 'অনলাইন বুক বা অনুরোধ করুন' : 'Book or request online'}</p>
          </Link>
        </div>
      </section>

      <section
        ref={(el) => (sectionRefs.current[1] = el)}
        data-section="departments"
        className={`dept-modern transition-all duration-1000 ${
          visibleSections.departments ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="dept-wrap">
          <div className="dept-head">
            <span className="dept-eyebrow">{t.capabilities}</span>
            <h2>{t.departmentsTitle}</h2>
            <p>{language === 'bn' ? 'আমাদের হাসপাতালের শ্রেষ্ঠত্বের মূল স্তম্ভ' : 'The core pillars that power our hospital excellence'}</p>
          </div>

          <div className="dept-grid">
            <div className="dept-cards">
              {[
                {
                  title: language === 'bn' ? 'সার্জারি' : "Surgery",
                  img: "/sur.jpg",
                  link: "/specialities/ot",
                },
                {
                  title: language === 'bn' ? 'রেডিওলজি ও ইমেজিং' : "Radiology & Imaging",
                  img: "/rad.jpg",
                  link: "/diagnostic/radiology",
                },
                {
                  title: language === 'bn' ? 'প্যাথলজি' : "Pathology",
                  img: "/pat.jpg",
                  link: "/diagnostic/pathology",
                },
              ].map((d, i) => (
                <Link href={d.link} key={i}>
                  <div className="dept-card-modern group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <div
                      className="dept-bg transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${d.img})` }}
                    />
                    <div className="dept-overlay" />
                    <div className="dept-content">
                      <h3>{d.title}</h3>
                      <button className="dept-more">{t.explore}</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="dept-panel">
              <h3>{language === 'bn' ? 'উন্নত মেডিকেল অবকাঠামো' : 'Advanced Medical Infrastructure'}</h3>
              <p>
                {language === 'bn' 
                  ? 'আমাদের বিভাগগুলি অভিজ্ঞ বিশেষজ্ঞদের নেতৃত্বে এবং রোগী-কেন্দ্রিক যত্নের দর্শন দ্বারা সমর্থিত, সর্বপ্রজন্মের মেডিকেল প্রযুক্তির সাথে সজ্জিত।'
                  : 'Our departments are equipped with next-generation medical technology, led by experienced specialists, and supported by a deeply patient-centered care philosophy.'}
              </p>
              <ul className="dept-points">
                <li>✓ {language === 'bn' ? 'উচ্চ-নির্ভুল ডায়াগনস্টিক সিস্টেম' : 'High-precision diagnostic systems'}</li>
                <li>✓ {language === 'bn' ? 'আন্তর্জাতিক চিকিৎসা প্রোটোকল' : 'International treatment protocols'}</li>
                <li>✓ {language === 'bn' ? 'নিরবচ্ছিন্ন জরুরি প্রস্তুতি' : 'Continuous emergency readiness'}</li>
              </ul>
              <a href="/departments" className="dept-cta">
                {language === 'bn' ? 'সব বিভাগ দেখুন →' : 'View All Departments →'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-pro">
        <div className="services-wrapper">
          <div className="services-header">
            <span className="badge">{t.ourServices}</span>
            <h2>{language === 'bn' ? 'যত্নশীল স্বাস্থ্যসেবা' : 'Healthcare Services That Truly Care'}</h2>
            <p>
              {language === 'bn' 
                ? 'কমপাশন, প্রিসিশন এবং বিশ্ব-শ্রেণির বিশেষজ্ঞতার সাথে গড়ে তোলা উন্নত মেডিকেল সমাধান।'
                : 'Advanced medical solutions delivered with compassion, precision, and world-class expertise.'}
            </p>
          </div>

          <div className="services-grid">
            <div className="cards">
              {[
                {
                  title: language === 'bn' ? 'ডায়ালাইসিস ইউনিট' : "Dialysis Unit",
                  desc: language === 'bn' ? 'নিরাপদ, আধুনিক ও রোগী-কেন্দ্রিক রেনাল কেয়ার।' : "Safe, modern & patient-focused renal care.",
                  icon: "🩺",
                  link: "/specialities/dialysis",
                },
                {
                  title: language === 'bn' ? 'ফিজিওথেরাপি' : "Physiotherapy",
                  desc: language === 'bn' ? 'স্মার্ট সরঞ্জামের সাথে উন্নত পুনরুদ্ধার।' : "Advanced recovery with smart equipment.",
                  icon: "🏃‍♂️",
                  link: "/specialities/physiotherapy",
                },
                {
                  title: language === 'bn' ? 'জরুরি সেবা' : "Emergency Care",
                  desc: language === 'bn' ? '২৪/৭ দ্রুত প্রতিক্রিয়া ও ট্রমা সহায়তা।' : "24/7 rapid response & trauma support.",
                  icon: "🚑",
                  link: "/specialities/ed",
                },
              ].map((s, i) => (
                <Link href={s.link} key={i}>
                  <div className="pro-card group hover-lift">
                    <div className="icon">{s.icon}</div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <button className="pro-btn">
                      {t.explore} <span>→</span>
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            <div className="hours-box">
              <h3>{t.workingHours}</h3>
              <div className="hours-list">
                {weekDays.map((day, index) => (
                  <div className="hour-row" key={index}>
                    <span>{day}</span>
                    <strong>07:00 – 11:00</strong>
                  </div>
                ))}
              </div>
              <div className="emergency">
                <h4>{t.emergency}</h4>
                <p>
                  {language === 'bn' ? 'পূর্ণ সজ্জিত অ্যাম্বুলেন্স সহ' : 'Open'} <strong>{language === 'bn' ? '২৪ ঘণ্টা' : '24 Hours'}</strong> {language === 'bn' ? 'খোলা' : 'with fully equipped ambulance support.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
         ULTRA PREMIUM RESPONSIVE DOCTORS SECTION
         Optimized for Mobile, Tablet & Desktop
      ============================================ */}
      <section className="doctors-responsive-section">
        {/* Animated background elements */}
        <div className="responsive-bg-gradient"></div>
        <div className="responsive-bg-particles">
          <div className="r-particle p1"></div>
          <div className="r-particle p2"></div>
          <div className="r-particle p3"></div>
          <div className="r-particle p4"></div>
          <div className="r-particle p5"></div>
        </div>
        
        <div className="doctors-responsive-container">
          
          {/* PREMIUM HEADER - Fully Responsive */}
          <div className="doctors-responsive-header">
            <div className="responsive-header-badge">
              <span className="badge-star">✦</span>
              <span className="badge-text-responsive">{t.experts}</span>
              <span className="badge-star">✦</span>
            </div>
            <h2 className="responsive-title">
              {t.meetDoctors}
              <span className="title-responsive-underline"></span>
            </h2>
            <p className="responsive-subtitle">
              {language === 'bn' 
                ? 'আপনি বিশ্বাস করতে পারেন এমন অত্যন্ত দক্ষ চিকিৎসা পেশাদার।' 
                : 'Exceptional medical professionals, meticulously curated for your trust.'}
            </p>
          </div>

          {/* RESPONSIVE DOCTOR GRID - Mobile First */}
          <div className="doctors-responsive-grid">
            {selectedDoctors.map((doctor, index) => (
              <div 
                className="responsive-doctor-card" 
                key={doctor.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card effects */}
                <div className="card-responsive-glow"></div>
                <div className="card-responsive-border"></div>
                <div className="card-responsive-top-line"></div>

                {/* Doctor Image - Responsive sizing */}
                <div className="responsive-image-wrapper">
                  <div className="responsive-image-frame">
                    <div className="responsive-frame-ring"></div>
                    <img
                      src={getDoctorImage(doctor)}
                      alt={doctor.name}
                      className="responsive-doctor-image"
                      onError={(e) => {
                        e.target.src = "/placeholder-doctor.jpg";
                      }}
                    />
                    <div className="responsive-image-shine"></div>
                  </div>
                  
                  {/* Status indicator - responsive */}
                  <div className="responsive-status">
                    <div className="responsive-status-pulse"></div>
                    <div className="responsive-status-core"></div>
                  </div>
                </div>

                {/* Doctor Details - Responsive typography */}
                <div className="responsive-doctor-info">
                  <h3 className="responsive-doctor-name">{doctor.name}</h3>
                  <div className="responsive-specialty-wrapper">
                    <span className="responsive-specialty-dot"></span>
                    <p className="responsive-doctor-specialty">{doctor.specialization}</p>
                  </div>
                </div>

                {/* ANIMATED VIEW PROFILE BUTTON - Responsive */}
                <Link href={`/doctors/${doctor.id}`} className="responsive-cta-button">
                  <span className="responsive-btn-text-wrapper">
                    <span className="responsive-btn-text-default">{t.viewProfile}</span>
                    <span className="responsive-btn-text-hover">{t.viewProfile}</span>
                  </span>
                  <span className="responsive-btn-icon-wrapper">
                    <svg className="responsive-btn-icon-default" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg className="responsive-btn-icon-hover" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="responsive-btn-ripple"></span>
                </Link>

                {/* Decorative corners */}
                <div className="responsive-corner corner-tl-responsive"></div>
                <div className="responsive-corner corner-br-responsive"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment CTA Section - Fully Responsive */}
      <section
        ref={(el) => (sectionRefs.current[4] = el)}
        data-section="cta"
        className={`cta-responsive-wrapper transition-all duration-1000 ${
          visibleSections.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="cta-responsive-container">
          <div className="cta-responsive-card">
            {/* Animated background orbs */}
            <div className="cta-responsive-orb orb-1"></div>
            <div className="cta-responsive-orb orb-2"></div>
            <div className="cta-responsive-orb orb-3"></div>
            
            <div className="cta-responsive-content">
              <div className="cta-responsive-left">
                <div className="cta-responsive-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" strokeWidth="1.5"/>
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="15" r="1.5" fill="white"/>
                    <circle cx="16.5" cy="15" r="1.5" fill="white"/>
                    <circle cx="7.5" cy="15" r="1.5" fill="white"/>
                  </svg>
                </div>
                <div className="cta-responsive-text">
                  <h4>{language === 'bn' ? 'অ্যাপয়েন্টমেন্ট বুক করুন' : 'Book an Appointment'}</h4>
                  <p>{language === 'bn' ? 'বিশেষজ্ঞ ডাক্তার • বিশ্বস্ত যত্ন • দ্রুত বুকিং' : 'Expert doctors • Trusted care • Quick booking'}</p>
                </div>
              </div>
              <a href="/appointment" className="cta-responsive-button">
                <span>{t.bookNow}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        /* ============================================
           FULLY RESPONSIVE PREMIUM DOCTORS SECTION
           Optimized for Mobile (320px - 768px)
           Tablet (768px - 1024px)
           Desktop (1024px+)
        ============================================ */
        
        /* Base Section Styles */
        .doctors-responsive-section {
          padding: 3rem 0;
          background: linear-gradient(135deg, #0A0F1A 0%, #0C1220 50%, #0A0F1A 100%);
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        
        /* Responsive Container */
        .doctors-responsive-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
          position: relative;
          z-index: 2;
        }
        
        /* Tablet and Desktop padding adjustment */
        @media (min-width: 768px) {
          .doctors-responsive-section {
            padding: 4rem 0;
          }
          .doctors-responsive-container {
            padding: 0 1.5rem;
          }
        }
        
        @media (min-width: 1024px) {
          .doctors-responsive-section {
            padding: 6rem 0;
          }
          .doctors-responsive-container {
            padding: 0 2rem;
          }
        }
        
        /* Animated Background - Responsive */
        .responsive-bg-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 60%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .responsive-bg-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        
        .r-particle {
          position: absolute;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          animation: floatParticleResp 12s infinite linear;
        }
        
        .p1 { width: 3px; height: 3px; top: 15%; left: 5%; animation-delay: 0s; }
        .p2 { width: 4px; height: 4px; top: 70%; left: 90%; animation-delay: 2s; }
        .p3 { width: 2px; height: 2px; top: 85%; left: 15%; animation-delay: 5s; }
        .p4 { width: 5px; height: 5px; top: 25%; left: 85%; animation-delay: 8s; }
        .p5 { width: 3px; height: 3px; top: 50%; left: 50%; animation-delay: 11s; }
        
        @media (min-width: 768px) {
          .p1 { width: 4px; height: 4px; }
          .p2 { width: 5px; height: 5px; }
          .p3 { width: 3px; height: 3px; }
          .p4 { width: 6px; height: 6px; }
          .p5 { width: 4px; height: 4px; }
        }
        
        @keyframes floatParticleResp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(15px); opacity: 0; }
        }
        
        /* ========== RESPONSIVE HEADER ========== */
        .doctors-responsive-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        @media (min-width: 768px) {
          .doctors-responsive-header {
            margin-bottom: 3rem;
          }
        }
        
        @media (min-width: 1024px) {
          .doctors-responsive-header {
            margin-bottom: 4rem;
          }
        }
        
        .responsive-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        @media (min-width: 768px) {
          .responsive-header-badge {
            gap: 0.75rem;
            margin-bottom: 1.25rem;
          }
        }
        
        .badge-star {
          font-size: 0.7rem;
          color: #3B82F6;
          opacity: 0.7;
        }
        
        @media (min-width: 768px) {
          .badge-star {
            font-size: 0.875rem;
          }
        }
        
        .badge-text-responsive {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #60A5FA, #A78BFA);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        @media (min-width: 768px) {
          .badge-text-responsive {
            font-size: 0.75rem;
            letter-spacing: 0.15em;
          }
        }
        
        .responsive-title {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }
        
        @media (min-width: 480px) {
          .responsive-title {
            font-size: 2rem;
          }
        }
        
        @media (min-width: 768px) {
          .responsive-title {
            font-size: 2.5rem;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-title {
            font-size: 3rem;
          }
        }
        
        .title-responsive-underline {
          position: absolute;
          bottom: -6px;
          left: 20%;
          width: 60%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #3B82F6, #8B5CF6, #EC489A, #8B5CF6, #3B82F6, transparent);
          border-radius: 2px;
        }
        
        @media (min-width: 768px) {
          .title-responsive-underline {
            bottom: -8px;
          }
        }
        
        .responsive-subtitle {
          color: #64748B;
          font-size: 0.875rem;
          max-width: 90%;
          margin: 0 auto;
          line-height: 1.5;
        }
        
        @media (min-width: 768px) {
          .responsive-subtitle {
            font-size: 1rem;
            max-width: 560px;
            line-height: 1.6;
          }
        }
        
        /* ========== RESPONSIVE GRID ========== */
        .doctors-responsive-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        
        @media (min-width: 480px) {
          .doctors-responsive-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
        }
        
        @media (min-width: 768px) {
          .doctors-responsive-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }
        
        @media (min-width: 1024px) {
          .doctors-responsive-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.75rem;
          }
        }
        
        @media (min-width: 1280px) {
          .doctors-responsive-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
          }
        }
        
        /* ========== RESPONSIVE CARD ========== */
        .responsive-doctor-card {
          position: relative;
          background: linear-gradient(135deg, rgba(18, 25, 45, 0.95), rgba(12, 18, 32, 0.98));
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 1.25rem;
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          border: 1px solid rgba(59, 130, 246, 0.15);
          overflow: hidden;
          animation: cardResponsiveRise 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @media (min-width: 768px) {
          .responsive-doctor-card {
            border-radius: 24px;
            padding: 1.5rem;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-doctor-card {
            border-radius: 28px;
            padding: 2rem 1.75rem 1.75rem;
          }
        }
        
        @keyframes cardResponsiveRise {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .responsive-doctor-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.5);
        }
        
        @media (min-width: 768px) {
          .responsive-doctor-card:hover {
            transform: translateY(-6px);
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-doctor-card:hover {
            transform: translateY(-8px);
          }
        }
        
        .card-responsive-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.08), transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        
        .responsive-doctor-card:hover .card-responsive-glow {
          opacity: 1;
        }
        
        .card-responsive-border {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        @media (min-width: 768px) {
          .card-responsive-border {
            border-radius: 24px;
          }
        }
        
        @media (min-width: 1024px) {
          .card-responsive-border {
            border-radius: 28px;
          }
        }
        
        .responsive-doctor-card:hover .card-responsive-border {
          opacity: 1;
        }
        
        .card-responsive-top-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #3B82F6, #8B5CF6, #EC489A);
          transform: scaleX(0);
          transition: transform 0.4s ease;
          transform-origin: left;
        }
        
        .responsive-doctor-card:hover .card-responsive-top-line {
          transform: scaleX(1);
        }
        
        /* ========== RESPONSIVE IMAGE ========== */
        .responsive-image-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        @media (min-width: 768px) {
          .responsive-image-wrapper {
            margin-bottom: 1.25rem;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-image-wrapper {
            margin-bottom: 1.5rem;
          }
        }
        
        .responsive-image-frame {
          position: relative;
          width: 90px;
          height: 90px;
        }
        
        @media (min-width: 480px) {
          .responsive-image-frame {
            width: 100px;
            height: 100px;
          }
        }
        
        @media (min-width: 768px) {
          .responsive-image-frame {
            width: 110px;
            height: 110px;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-image-frame {
            width: 130px;
            height: 130px;
          }
        }
        
        .responsive-frame-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6, #EC489A);
          opacity: 0.4;
          transition: all 0.4s ease;
        }
        
        .responsive-doctor-card:hover .responsive-frame-ring {
          opacity: 0.8;
          filter: blur(4px);
        }
        
        .responsive-doctor-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid #1E2A3A;
          background: #0F172A;
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease;
        }
        
        @media (min-width: 768px) {
          .responsive-doctor-image {
            border-width: 3px;
          }
        }
        
        .responsive-doctor-card:hover .responsive-doctor-image {
          transform: scale(1.02);
        }
        
        .responsive-image-shine {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 3;
        }
        
        .responsive-doctor-card:hover .responsive-image-shine {
          opacity: 0.5;
        }
        
        /* Responsive Status */
        .responsive-status {
          position: absolute;
          bottom: 2px;
          right: calc(50% - 40px);
          width: 10px;
          height: 10px;
        }
        
        @media (min-width: 480px) {
          .responsive-status {
            bottom: 4px;
            right: calc(50% - 45px);
            width: 12px;
            height: 12px;
          }
        }
        
        @media (min-width: 768px) {
          .responsive-status {
            bottom: 6px;
            right: calc(50% - 50px);
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-status {
            bottom: 8px;
            right: calc(50% - 60px);
          }
        }
        
        .responsive-status-pulse {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: #22C55E;
          opacity: 0.6;
          animation: pulseRingResp 1.5s infinite;
        }
        
        .responsive-status-core {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #22C55E;
          box-shadow: 0 0 6px #22C55E;
        }
        
        @keyframes pulseRingResp {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        /* ========== RESPONSIVE DOCTOR INFO ========== */
        .responsive-doctor-info {
          text-align: center;
        }
        
        .responsive-doctor-name {
          font-size: 1rem;
          font-weight: 700;
          color: #F1F5F9;
          margin-bottom: 0.35rem;
          letter-spacing: -0.01em;
        }
        
        @media (min-width: 768px) {
          .responsive-doctor-name {
            font-size: 1.2rem;
            margin-bottom: 0.4rem;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-doctor-name {
            font-size: 1.35rem;
            margin-bottom: 0.5rem;
          }
        }
        
        .responsive-specialty-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }
        
        .responsive-specialty-dot {
          width: 3px;
          height: 3px;
          background: #3B82F6;
          border-radius: 50%;
        }
        
        @media (min-width: 768px) {
          .responsive-specialty-dot {
            width: 4px;
            height: 4px;
          }
        }
        
        .responsive-doctor-specialty {
          font-size: 0.7rem;
          color: #94A3B8;
          font-weight: 500;
        }
        
        @media (min-width: 768px) {
          .responsive-doctor-specialty {
            font-size: 0.8rem;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-doctor-specialty {
            font-size: 0.875rem;
          }
        }
        
        /* ========== RESPONSIVE ANIMATED BUTTON ========== */
        .responsive-cta-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          margin-top: 1rem;
          padding: 0.6rem 1rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.08));
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 100px;
          cursor: pointer;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        
        @media (min-width: 768px) {
          .responsive-cta-button {
            margin-top: 1.25rem;
            padding: 0.7rem 1.25rem;
            gap: 0.6rem;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-cta-button {
            margin-top: 1.5rem;
            padding: 0.8rem 1.5rem;
            gap: 0.75rem;
          }
        }
        
        /* Button Text Animation */
        .responsive-btn-text-wrapper {
          position: relative;
          overflow: hidden;
          height: 16px;
        }
        
        @media (min-width: 768px) {
          .responsive-btn-text-wrapper {
            height: 18px;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-btn-text-wrapper {
            height: 20px;
          }
        }
        
        .responsive-btn-text-default,
        .responsive-btn-text-hover {
          display: block;
          font-weight: 600;
          font-size: 0.7rem;
          transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        
        @media (min-width: 768px) {
          .responsive-btn-text-default,
          .responsive-btn-text-hover {
            font-size: 0.8rem;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-btn-text-default,
          .responsive-btn-text-hover {
            font-size: 0.875rem;
          }
        }
        
        .responsive-btn-text-default {
          color: #60A5FA;
          transform: translateY(0);
        }
        
        .responsive-btn-text-hover {
          position: absolute;
          top: 0;
          left: 0;
          color: #FFFFFF;
          transform: translateY(100%);
        }
        
        .responsive-cta-button:hover .responsive-btn-text-default {
          transform: translateY(-100%);
        }
        
        .responsive-cta-button:hover .responsive-btn-text-hover {
          transform: translateY(0);
        }
        
        /* Button Icon Animation */
        .responsive-btn-icon-wrapper {
          position: relative;
          overflow: hidden;
          width: 14px;
          height: 14px;
        }
        
        @media (min-width: 768px) {
          .responsive-btn-icon-wrapper {
            width: 16px;
            height: 16px;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-btn-icon-wrapper {
            width: 18px;
            height: 18px;
          }
        }
        
        .responsive-btn-icon-default,
        .responsive-btn-icon-hover {
          position: absolute;
          transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        
        .responsive-btn-icon-default {
          transform: translateX(0);
        }
        
        .responsive-btn-icon-hover {
          transform: translateX(100%);
        }
        
        .responsive-btn-icon-default svg,
        .responsive-btn-icon-hover svg {
          width: 100%;
          height: 100%;
        }
        
        .responsive-btn-icon-default svg {
          stroke: #60A5FA;
        }
        
        .responsive-btn-icon-hover svg {
          stroke: #FFFFFF;
        }
        
        .responsive-cta-button:hover .responsive-btn-icon-default {
          transform: translateX(-100%);
        }
        
        .responsive-cta-button:hover .responsive-btn-icon-hover {
          transform: translateX(0);
        }
        
        /* Button Ripple */
        .responsive-btn-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.5s, height 0.5s;
          pointer-events: none;
        }
        
        .responsive-cta-button:active .responsive-btn-ripple {
          width: 200px;
          height: 200px;
        }
        
        /* Button Hover State */
        .responsive-cta-button:hover {
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border-color: transparent;
          gap: 0.7rem;
          transform: scale(1.01);
          box-shadow: 0 6px 15px -6px rgba(59, 130, 246, 0.4);
        }
        
        @media (min-width: 768px) {
          .responsive-cta-button:hover {
            gap: 0.85rem;
            transform: scale(1.02);
          }
        }
        
        /* Card Corners */
        .responsive-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        @media (min-width: 768px) {
          .responsive-corner {
            width: 25px;
            height: 25px;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-corner {
            width: 30px;
            height: 30px;
          }
        }
        
        .corner-tl-responsive {
          top: 10px;
          left: 10px;
          border-top: 1.5px solid rgba(59, 130, 246, 0.4);
          border-left: 1.5px solid rgba(59, 130, 246, 0.4);
          border-radius: 8px 0 0 0;
        }
        
        @media (min-width: 768px) {
          .corner-tl-responsive {
            top: 12px;
            left: 12px;
            border-width: 2px;
            border-radius: 10px 0 0 0;
          }
        }
        
        @media (min-width: 1024px) {
          .corner-tl-responsive {
            top: 16px;
            left: 16px;
            border-radius: 12px 0 0 0;
          }
        }
        
        .corner-br-responsive {
          bottom: 10px;
          right: 10px;
          border-bottom: 1.5px solid rgba(139, 92, 246, 0.4);
          border-right: 1.5px solid rgba(139, 92, 246, 0.4);
          border-radius: 0 0 8px 0;
        }
        
        @media (min-width: 768px) {
          .corner-br-responsive {
            bottom: 12px;
            right: 12px;
            border-width: 2px;
            border-radius: 0 0 10px 0;
          }
        }
        
        @media (min-width: 1024px) {
          .corner-br-responsive {
            bottom: 16px;
            right: 16px;
            border-radius: 0 0 12px 0;
          }
        }
        
        .responsive-doctor-card:hover .responsive-corner {
          opacity: 1;
        }
        
        /* ========== RESPONSIVE CTA SECTION ========== */
        .cta-responsive-wrapper {
          margin-top: 1rem;
          padding: 0 1rem 2rem;
        }
        
        @media (min-width: 768px) {
          .cta-responsive-wrapper {
            margin-top: 1.5rem;
            padding: 0 1.5rem 3rem;
          }
        }
        
        @media (min-width: 1024px) {
          .cta-responsive-wrapper {
            margin-top: 2rem;
            padding: 0 2rem 4rem;
          }
        }
        
        .cta-responsive-container {
          max-width: 1280px;
          margin: 0 auto;
        }
        
        .cta-responsive-card {
          position: relative;
          background: linear-gradient(135deg, #0F172A, #1E1B4B);
          border-radius: 20px;
          overflow: hidden;
          isolation: isolate;
        }
        
        @media (min-width: 768px) {
          .cta-responsive-card {
            border-radius: 24px;
          }
        }
        
        @media (min-width: 1024px) {
          .cta-responsive-card {
            border-radius: 28px;
          }
        }
        
        .cta-responsive-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.3;
          pointer-events: none;
        }
        
        @media (min-width: 768px) {
          .cta-responsive-orb {
            filter: blur(50px);
          }
        }
        
        @media (min-width: 1024px) {
          .cta-responsive-orb {
            filter: blur(60px);
          }
        }
        
        .orb-1 {
          width: 150px;
          height: 150px;
          background: #3B82F6;
          top: -50px;
          left: -50px;
        }
        
        .orb-2 {
          width: 150px;
          height: 150px;
          background: #8B5CF6;
          bottom: -50px;
          right: -50px;
        }
        
        .orb-3 {
          width: 120px;
          height: 120px;
          background: #EC489A;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: blur(50px);
          opacity: 0.15;
        }
        
        @media (min-width: 768px) {
          .orb-1 { width: 200px; height: 200px; top: -80px; left: -80px; }
          .orb-2 { width: 200px; height: 200px; bottom: -80px; right: -80px; }
          .orb-3 { width: 150px; height: 150px; filter: blur(60px); }
        }
        
        @media (min-width: 1024px) {
          .orb-1 { width: 300px; height: 300px; top: -100px; left: -100px; }
          .orb-2 { width: 250px; height: 250px; bottom: -80px; right: -80px; }
          .orb-3 { width: 200px; height: 200px; filter: blur(80px); }
        }
        
        .cta-responsive-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          gap: 1rem;
          text-align: center;
        }
        
        @media (min-width: 640px) {
          .cta-responsive-content {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
            padding: 1.5rem;
          }
        }
        
        @media (min-width: 1024px) {
          .cta-responsive-content {
            padding: 2rem 2.5rem;
          }
        }
        
        .cta-responsive-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        @media (min-width: 640px) {
          .cta-responsive-left {
            flex-direction: row;
            gap: 1rem;
          }
        }
        
        .cta-responsive-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (min-width: 768px) {
          .cta-responsive-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
          }
        }
        
        @media (min-width: 1024px) {
          .cta-responsive-icon {
            width: 56px;
            height: 56px;
            border-radius: 18px;
          }
        }
        
        .cta-responsive-text h4 {
          font-size: 1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.2rem;
        }
        
        @media (min-width: 768px) {
          .cta-responsive-text h4 {
            font-size: 1.2rem;
          }
        }
        
        @media (min-width: 1024px) {
          .cta-responsive-text h4 {
            font-size: 1.35rem;
          }
        }
        
        .cta-responsive-text p {
          color: #A5B4FC;
          font-size: 0.7rem;
        }
        
        @media (min-width: 768px) {
          .cta-responsive-text p {
            font-size: 0.8rem;
          }
        }
        
        @media (min-width: 1024px) {
          .cta-responsive-text p {
            font-size: 0.875rem;
          }
        }
        
        .cta-responsive-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.6rem 1.2rem;
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.8rem;
          color: #0F172A;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        @media (min-width: 768px) {
          .cta-responsive-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
            gap: 0.6rem;
          }
        }
        
        @media (min-width: 1024px) {
          .cta-responsive-button {
            padding: 1rem 2rem;
            gap: 0.75rem;
          }
        }
        
        .cta-responsive-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -8px rgba(0, 0, 0, 0.3);
          gap: 0.7rem;
        }
        
        .cta-responsive-button:hover svg {
          transform: translateX(3px);
        }
        
        .cta-responsive-button svg {
          transition: transform 0.2s ease;
        }
      `}</style>
    </>
  );
}