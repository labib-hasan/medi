import { useEffect, useState } from "react";
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
      // Use department field to filter for specialty units
      const deptName = doctor.department?.toLowerCase() || "";
      return dept.match.some((m) => deptName.includes(m));
    })
  )
  .filter(Boolean);
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative md:pt-17 pt-14 ">
        <HeroImageUpload isAdmin={false} />
      </section>

     {/* Quick Access Tiles */}
<section className="care-tiles">
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

      <section className="dept-modern">
  <div className="dept-wrap">

    {/* HEADER */}
    <div className="dept-head">
      <span className="dept-eyebrow">{t.capabilities}</span>
      <h2>{t.departmentsTitle}</h2>
      <p>{language === 'bn' ? 'আমাদের হাসপাতালের শ্রেষ্ঠত্বের মূল স্তম্ভ' : 'The core pillars that power our hospital excellence'}</p>
    </div>

    {/* BODY */}
    <div className="dept-grid">

      {/* LEFT – DEPARTMENTS */}
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

      {/* Background Image */}
      <div
        className="dept-bg transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${d.img})` }}
      />

      {/* Dark Overlay */}
      <div className="dept-overlay" />

      {/* Content */}
      <div className="dept-content">
        <h3>{d.title}</h3>
        <button className="dept-more">{t.explore}</button>
      </div>

    </div>
  </Link>
        ))}
      </div>

      {/* RIGHT – INFO */}
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
        {/* HEADER */}
        <div className="services-header">
          <span className="badge">{t.ourServices}</span>
          <h2>{language === 'bn' ? 'যত্নশীল স্বাস্থ্যসেবা' : 'Healthcare Services That Truly Care'}</h2>
          <p>
            {language === 'bn' 
              ? 'কমপাশন, প্রিসিশন এবং বিশ্ব-শ্রেণির বিশেষজ্ঞতার সাথে geliৎসিত উন্নত মেডিকেল সমাধান।'
              : 'Advanced medical solutions delivered with compassion, precision, and world-class expertise.'}
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="services-grid">
          {/* SERVICE CARDS */}
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
                <div className="pro-card group hover-lift" key={i}>
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
         

          {/* WORKING HOURS */}
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

      {/* Doctors Section */}
    <section className="doctors-section">
  <div className="doctors-container">

    {/* HEADER */}
    <div className="doctors-header">
      <span className="doctors-eyebrow">{t.experts}</span>
      <h2>{t.meetDoctors}</h2>
      <p>{language === 'bn' ? 'আপনি বিশ্বাস করতে পারেন এমন অত্যন্ত দক্ষ চিকিৎসা পেশাদার।' : 'Highly skilled medical professionals you can trust.'}</p>
    </div>

    {/* GRID - Show 7 doctors from different specialty sections */}
    <div className="doctors-grid">
  {selectedDoctors.map((doctor) => (
    <div className="doctor-card" key={doctor.id}>
      <div className="doctor-avatar">
        <img
          src={getDoctorImage(doctor)}
          alt={doctor.name}
          onError={(e) => {
            e.target.src = "/placeholder-doctor.jpg";
          }}
        />
      </div>

      <h3>{doctor.name}</h3>
      <span className="doctor-role">{doctor.specialization}</span>

      <Link
        href={`/doctors/${doctor.id}`}
        className="doctor-btn"
      >
        {t.viewProfile}
        <span>View profile →</span>
      </Link>
    </div>
  ))}
</div>

  </div>
 </section>


     {/* Appointment CTA Section */}
<section className="cta-texture-zone">
  <section className="cta-float">
    <div className="cta-float-wrap">
      <div className="cta-float-left">
        <span className="cta-dot" />
        <div>
          <h4>{language === 'bn' ? 'অ্যাপয়েন্টমেন্ট বুক করুন' : 'Book an Appointment'}</h4>
          <p>{language === 'bn' ? 'বিশেষজ্ঞ ডাক্তার • বিশ্বস্ত যত্ন • দ্রুত বুকিং' : 'Expert doctors • Trusted care • Quick booking'}</p>
        </div>
      </div>

      <a href="/appointment" className="cta-float-btn">
        {t.bookNow}
        <span>→</span>
      </a>
    </div>
  </section>
</section>


      {/* Footer */}
      <Footer />
    </>
  );
}
