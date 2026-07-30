import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MissionVision() {
  const { language } = useLanguage();
  const t = translations[language];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  const missionItems = [
    {
      icon: "🎯",
      titleEn: "Quality Healthcare",
      titleBn: "মানসম্পন্ন স্বাস্থ্যসেবা",
      descEn: "To provide accessible, affordable, and high-quality healthcare services to every patient with compassion and excellence.",
      descBn: "প্রতিটি রোগীকে সহানুভূতি ও শ্রেষ্ঠত্বের সাথে সাশ্রয়ী ও উচ্চমানের স্বাস্থ্যসেবা প্রদান করা।"
    },
    {
      icon: "🏥",
      titleEn: "Patient-Centered Care",
      titleBn: "রোগী-কেন্দ্রিক যত্ন",
      descEn: "To deliver patient-centered care that respects individual needs, values, and preferences in clinical decision-making.",
      descBn: "ক্লিনিকাল সিদ্ধান্ত গ্রহণে ব্যক্তিগত চাহিদা, মূল্যবোধ ও পছন্দকে সম্মান করে রোগী-কেন্দ্রিক যত্ন প্রদান করা।"
    },
    {
      icon: "🔬",
      titleEn: "Medical Excellence",
      titleBn: "চিকিৎসা শ্রেষ্ঠত্ব",
      descEn: "To continuously improve medical knowledge, technology, and skills to achieve excellence in diagnosis and treatment.",
      descBn: "রোগ নির্ণয় ও চিকিৎসায় শ্রেষ্ঠত্ব অর্জনের জন্য চিকিৎসা জ্ঞান, প্রযুক্তি ও দক্ষতা ক্রমাগত উন্নত করা।"
    }
  ];

  const visionItems = [
    {
      icon: "🌟",
      titleEn: "Healthcare Leadership",
      titleBn: "স্বাস্থ্যসেবা নেতৃত্ব",
      descEn: "To be the leading healthcare provider in the region, setting benchmarks for medical excellence and patient satisfaction.",
      descBn: "চিকিৎসা শ্রেষ্ঠত্ব ও রোগী সন্তুষ্টির মানদণ্ড স্থাপন করে অঞ্চলের শীর্ষস্থানীয় স্বাস্থ্যসেবা প্রদানকারী হওয়া।"
    },
    {
      icon: "🌍",
      titleEn: "Community Health",
      titleBn: "সম্প্রদায়ের স্বাস্থ্য",
      descEn: "To create a healthier community through preventive care, health education, and accessible medical services for all.",
      descBn: "সকলের জন্য প্রতিরোধমূলক যত্ন, স্বাস্থ্য শিক্ষা ও সহজলভ্য চিকিৎসা সেবার মাধ্যমে একটি স্বাস্থ্যকর সমাজ গঠন করা।"
    },
    {
      icon: "💡",
      titleEn: "Innovation & Research",
      titleBn: "উদ্ভাবন ও গবেষণা",
      descEn: "To foster innovation and research in medical science, contributing to global healthcare advancement.",
      descBn: "চিকিৎসা বিজ্ঞানে উদ্ভাবন ও গবেষণাকে উৎসাহিত করা, বৈশ্বিক স্বাস্থ্যসেবা অগ্রগতিতে অবদান রাখা।"
    }
  ];

  const coreValues = [
    { icon: "❤️", en: "Compassion", bn: "সহানুভূতি" },
    { icon: "⚡", en: "Excellence", bn: "শ্রেষ্ঠত্ব" },
    { icon: "🤝", en: "Integrity", bn: "সততা" },
    { icon: "🌱", en: "Innovation", bn: "উদ্ভাবন" },
    { icon: "👥", en: "Teamwork", bn: "দলগত কাজ" },
    { icon: "🎓", en: "Learning", bn: "শিক্ষা" },
  ];

  const departments = [
    {
      nameEn: "Cancer Department",
      nameBn: "ক্যান্সার বিভাগ",
      icon: "🎗️",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      descriptionEn: "Comprehensive cancer care with advanced oncology treatments, chemotherapy, radiotherapy, and supportive care services.",
      descriptionBn: "উন্নত অনকোলজি চিকিৎসা, কেমোথেরাপি, রেডিওথেরাপি এবং সহায়ক যত্ন সহ ব্যাপক ক্যান্সার যত্ন।",
      features: [
        { en: "Medical Oncology", bn: "মেডিকেল অনকোলজি" },
        { en: "Radiation Therapy", bn: "রেডিয়েশন থেরাপি" },
        { en: "Surgical Oncology", bn: "সার্জিক্যাল অনকোলজি" },
        { en: "Palliative Care", bn: "উপশমকারী যত্ন" },
        { en: "Cancer Screening", bn: "ক্যান্সার স্ক্রিনিং" }
      ]
    },
    {
      nameEn: "Nursing Institute",
      nameBn: "নার্সিং ইনস্টিটিউট",
      icon: "👩‍⚕️",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      descriptionEn: "World-class nursing education and training institute producing skilled healthcare professionals for the future.",
      descriptionBn: "ভবিষ্যতের জন্য দক্ষ স্বাস্থ্যসেবা পেশাদার তৈরি করে বিশ্বমানের নার্সিং শিক্ষা ও প্রশিক্ষণ ইনস্টিটিউট।",
      features: [
        { en: "BNSc Program", bn: "বিএনএসসি প্রোগ্রাম" },
        { en: "Diploma in Nursing", bn: "নার্সিং ডিপ্লোমা" },
        { en: "Clinical Training", bn: "ক্লিনিক্যাল প্রশিক্ষণ" },
        { en: "Research Facilities", bn: "গবেষণা সুবিধা" },
        { en: "International Collaboration", bn: "আন্তর্জাতিক সহযোগিতা" }
      ]
    },
    {
      nameEn: "Cathlab Department",
      nameBn: "ক্যাথল্যাব বিভাগ",
      icon: "🫀",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      descriptionEn: "State-of-the-art cardiac catheterization laboratory for advanced cardiac diagnostics and interventions.",
      descriptionBn: "উন্নত কার্ডিয়াক ডায়াগনস্টিকস এবং ইন্টারভেনশনের জন্য অত্যাধুনিক কার্ডিয়াক ক্যাথেটারাইজেশন ল্যাবরেটরি।",
      features: [
        { en: "Coronary Angiography", bn: "করোনারি অ্যাঞ্জিওগ্রাফি" },
        { en: "Angioplasty", bn: "অ্যাঞ্জিওপ্লাস্টি" },
        { en: "Stent Implantation", bn: "স্টেন্ট ইমপ্লান্টেশন" },
        { en: "Electrophysiology", bn: "ইলেক্ট্রোফিজিওলজি" },
        { en: "Pacemaker Implantation", bn: "পেসমেকার ইমপ্লান্টেশন" }
      ]
    },
    {
      nameEn: "Radiology & Imaging",
      nameBn: "রেডিওলজি ও ইমেজিং",
      icon: "📷",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      descriptionEn: "Advanced diagnostic imaging services including MRI, CT, Ultrasound, and X-ray for accurate diagnosis.",
      descriptionBn: "সঠিক রোগ নির্ণয়ের জন্য এমআরআই, সিটি, আল্ট্রাসাউন্ড এবং এক্স-রে সহ উন্নত ডায়াগনস্টিক ইমেজিং পরিষেবা।",
      features: [
        { en: "MRI Scan", bn: "এমআরআই স্ক্যান" },
        { en: "CT Scan", bn: "সিটি স্ক্যান" },
        { en: "Ultrasound", bn: "আল্ট্রাসাউন্ড" },
        { en: "Digital X-Ray", bn: "ডিজিটাল এক্স-রে" },
        { en: "Color Doppler", bn: "কালার ডপলার" }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Mission & Vision - Medical Centre Chattagram</title>
        <meta
          name="description"
          content="Our mission, vision, and core values at Medical Centre Chattagram - Committed to excellence in healthcare"
        />
      </Head>

      <Navbar />

      <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-600 py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-semibold mb-4">
                {language === "en" ? "Our Commitment" : "আমাদের অঙ্গীকার"}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {language === "en" ? "Mission & Vision" : "মিশন ও ভিশন"}
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
                {language === "en"
                  ? "Shaping the future of healthcare through excellence, innovation, and compassion"
                  : "শ্রেষ্ঠত্ব, উদ্ভাবন এবং সহানুভূতির মাধ্যমে স্বাস্থ্যসেবার ভবিষ্যৎ গঠন"}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 -mt-8 relative z-20">
          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl">
                    🎯
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {language === "en" ? "Our Mission" : "আমাদের মিশন"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {language === "en" ? "What we strive for" : "আমরা যা করার জন্য সংগ্রাম করি"}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  {missionItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <div className="text-3xl flex-shrink-0">{item.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {language === "en" ? item.titleEn : item.titleBn}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {language === "en" ? item.descEn : item.descBn}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl">
                    🌟
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {language === "en" ? "Our Vision" : "আমাদের ভিশন"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {language === "en" ? "Where we're going" : "আমরা কোথায় যাচ্ছি"}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  {visionItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <div className="text-3xl flex-shrink-0">{item.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {language === "en" ? item.titleEn : item.titleBn}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {language === "en" ? item.descEn : item.descBn}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Core Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <span className="text-sm uppercase tracking-wider text-blue-600 font-semibold">
                {language === "en" ? "Our Foundation" : "আমাদের ভিত্তি"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                {language === "en" ? "Core Values" : "মূল্যবোধ"}
              </h2>
              <p className="text-gray-600 mt-2">
                {language === "en"
                  ? "The principles that guide everything we do"
                  : "নীতিগুলো যা আমাদের সবকিছুকে গাইড করে"}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all"
                >
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <p className="font-bold text-gray-800 text-sm">
                    {language === "en" ? value.en : value.bn}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Departments Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <span className="text-sm uppercase tracking-wider text-blue-600 font-semibold">
                {language === "en" ? "Our Facilities" : "আমাদের সুবিধাসমূহ"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                {language === "en" ? "Departments & Institutes" : "বিভাগ ও ইনস্টিটিউট"}
              </h2>
              <p className="text-gray-600 mt-2">
                {language === "en"
                  ? "World-class healthcare facilities for comprehensive patient care"
                  : "ব্যাপক রোগী যত্নের জন্য বিশ্বমানের স্বাস্থ্যসেবা সুবিধা"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all"
                >
                  <div className={`h-2 bg-gradient-to-r ${dept.color}`}></div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 ${dept.bgColor} rounded-2xl flex items-center justify-center text-4xl`}>
                        {dept.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {language === "en" ? dept.nameEn : dept.nameBn}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {language === "en" ? "Department" : "বিভাগ"}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {language === "en" ? dept.descriptionEn : dept.descriptionBn}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {dept.features.map((feature, fIndex) => (
                        <span
                          key={fIndex}
                          className={`px-3 py-1 ${dept.bgColor} rounded-full text-xs font-medium text-gray-700`}
                        >
                          {language === "en" ? feature.en : feature.bn}
                        </span>
                      ))}
                    </div>

                    {/* <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`mt-4 w-full py-3 bg-gradient-to-r ${dept.color} text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition`}
                    >
                      {language === "en" ? "Learn More" : "আরও জানুন"} →
                    </motion.button> */}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Why Choose Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
              <div className="text-center mb-8">
                <span className="text-sm uppercase tracking-wider text-white/80 font-semibold">
                  {language === "en" ? "Why Choose Us" : "কেন আমাদের বেছে নিন"}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mt-2">
                  {language === "en"
                    ? "Excellence in Every Aspect of Care"
                    : "যত্নের প্রতিটি দিকেই শ্রেষ্ঠত্ব"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="font-bold text-lg mb-2">
                    {language === "en" ? "Quality Assurance" : "মান নিশ্চিতকরণ"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {language === "en"
                      ? "ISO certified healthcare with international standards"
                      : "আন্তর্জাতিক মান সহ আইএসও প্রত্যয়িত স্বাস্থ্যসেবা"}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">👨‍⚕️</div>
                  <h3 className="font-bold text-lg mb-2">
                    {language === "en" ? "Expert Team" : "বিশেষজ্ঞ দল"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {language === "en"
                      ? "Highly qualified and experienced medical professionals"
                      : "উচ্চ যোগ্য ও অভিজ্ঞ চিকিৎসা পেশাদার"}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">💊</div>
                  <h3 className="font-bold text-lg mb-2">
                    {language === "en" ? "Advanced Technology" : "উন্নত প্রযুক্তি"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {language === "en"
                      ? "State-of-the-art medical equipment for accurate diagnosis"
                      : "সঠিক রোগ নির্ণয়ের জন্য অত্যাধুনিক চিকিৎসা যন্ত্রপাতি"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}