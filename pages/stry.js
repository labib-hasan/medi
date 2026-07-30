import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function OurStory() {
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

  const milestones = [
    {
      year: "1995",
      icon: "🏥",
      titleEn: "The Beginning",
      titleBn: "শুরুর কথা",
      descEn: "Medical Centre Hospital Chattagram was founded with a vision to provide quality healthcare to the people of Chattogram.",
      descBn: "চট্টগ্রামের মানুষকে মানসম্পন্ন স্বাস্থ্যসেবা প্রদানের লক্ষ্যে মেডিকেল সেন্টার হাসপাতাল চট্টগ্রাম প্রতিষ্ঠিত হয়।"
    },
    {
      year: "2000",
      icon: "📈",
      titleEn: "Expansion & Growth",
      titleBn: "বিস্তার ও বৃদ্ধি",
      descEn: "Expanded our services with state-of-the-art diagnostic facilities and specialized departments.",
      descBn: "অত্যাধুনিক ডায়াগনস্টিক সুবিধা এবং বিশেষায়িত বিভাগ সহ আমাদের সেবা প্রসারিত করেছি।"
    },
    {
      year: "2005",
      icon: "🏆",
      titleEn: "Excellence in Care",
      titleBn: "যত্নে শ্রেষ্ঠত্ব",
      descEn: "Recognized as a leading healthcare provider in the region with ISO certification.",
      descBn: "আইএসও সার্টিফিকেশন সহ অঞ্চলের শীর্ষস্থানীয় স্বাস্থ্যসেবা প্রদানকারী হিসেবে স্বীকৃতি পেয়েছি।"
    },
    {
      year: "2010",
      icon: "🔬",
      titleEn: "Technology Advancement",
      titleBn: "প্রযুক্তিগত অগ্রগতি",
      descEn: "Introduced advanced medical technologies including MRI, CT Scan, and Digital Mammography.",
      descBn: "এমআরআই, সিটি স্ক্যান এবং ডিজিটাল ম্যামোগ্রাফি সহ উন্নত চিকিৎসা প্রযুক্তি চালু করেছি।"
    },
    {
      year: "2015",
      icon: "🎓",
      titleEn: "Nursing Institute",
      titleBn: "নার্সিং ইনস্টিটিউট",
      descEn: "Established our own Nursing Institute to train the next generation of healthcare professionals.",
      descBn: "স্বাস্থ্যসেবা পেশাদারদের পরবর্তী প্রজন্মকে প্রশিক্ষণ দেওয়ার জন্য আমাদের নিজস্ব নার্সিং ইনস্টিটিউট প্রতিষ্ঠা করেছি।"
    },
    {
      year: "2020",
      icon: "🌍",
      titleEn: "Digital Transformation",
      titleBn: "ডিজিটাল রূপান্তর",
      descEn: "Embraced digital healthcare solutions including telemedicine and online appointment systems.",
      descBn: "টেলিমেডিসিন এবং অনলাইন অ্যাপয়েন্টমেন্ট সিস্টেম সহ ডিজিটাল স্বাস্থ্যসেবা সমাধান গ্রহণ করেছি।"
    },
    {
      year: "2023",
      icon: "🫀",
      titleEn: "Cathlab & Cancer Center",
      titleBn: "ক্যাথল্যাব ও ক্যান্সার সেন্টার",
      descEn: "Launched advanced Cathlab and Comprehensive Cancer Center for specialized cardiac and oncology care.",
      descBn: "বিশেষায়িত কার্ডিয়াক এবং অনকোলজি যত্নের জন্য উন্নত ক্যাথল্যাব এবং ব্যাপক ক্যান্সার সেন্টার চালু করেছি।"
    },
    {
      year: "2024",
      icon: "⭐",
      titleEn: "Continuing Excellence",
      titleBn: "শ্রেষ্ঠত্ব অব্যাহত",
      descEn: "Continuing our commitment to excellence with cutting-edge technology and compassionate care.",
      descBn: "অত্যাধুনিক প্রযুক্তি এবং সহানুভূতিশীল যত্নের মাধ্যমে শ্রেষ্ঠত্বের প্রতিশ্রুতি অব্যাহত রাখছি।"
    }
  ];

  const stats = [
    { number: "28+", labelEn: "Years of Excellence", labelBn: "শ্রেষ্ঠত্বের বছর" },
    { number: "250+", labelEn: "Expert Doctors", labelBn: "বিশেষজ্ঞ ডাক্তার" },
    { number: "50K+", labelEn: "Happy Patients", labelBn: "সন্তুষ্ট রোগী" },
    { number: "30+", labelEn: "Departments", labelBn: "বিভাগ" },
    { number: "100%", labelEn: "Patient Satisfaction", labelBn: "রোগী সন্তুষ্টি" },
    { number: "24/7", labelEn: "Emergency Services", labelBn: "জরুরি সেবা" }
  ];

  return (
    <>
      <Head>
        <title>Our Story - Medical Centre Chattagram</title>
        <meta
          name="description"
          content="Learn about the journey of Medical Centre Chattagram - Over 28 years of excellence in healthcare"
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
                {language === "en" ? "Our Journey" : "আমাদের যাত্রা"}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {language === "en" ? "Our Story" : "আমাদের গল্প"}
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
                {language === "en"
                  ? "A journey of compassion, excellence, and commitment to healthcare since 1995"
                  : "১৯৯৫ সাল থেকে সহানুভূতি, শ্রেষ্ঠত্ব এবং স্বাস্থ্যসেবার প্রতি অঙ্গীকারের একটি যাত্রা"}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 -mt-8 relative z-20">
          {/* Image Section - Below Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[300px] md:h-[500px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Medical Centre Hospital Chattagram - Our Story"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-3xl"
                  >
                    <span className="inline-block px-4 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-3">
                      {language === "en" ? "Since 1995" : "১৯৯৫ সাল থেকে"}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
                      {language === "en"
                        ? "Medical Centre Hospital Chattagram"
                        : "মেডিকেল সেন্টার হাসপাতাল চট্টগ্রাম"}
                    </h2>
                    <p className="text-white/90 text-sm md:text-base max-w-2xl">
                      {language === "en"
                        ? "From humble beginnings to a premier healthcare institution, we've been serving the community with dedication and excellence."
                        : "নম্র শুরু থেকে একটি প্রধান স্বাস্থ্যসেবা প্রতিষ্ঠান পর্যন্ত, আমরা নিষ্ঠা ও শ্রেষ্ঠত্বের সাথে সম্প্রদায়কে সেবা দিয়ে আসছি।"}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="bg-white rounded-2xl shadow-lg p-4 text-center hover:shadow-2xl transition-all"
                >
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">{stat.number}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {language === "en" ? stat.labelEn : stat.labelBn}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* About Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-sm uppercase tracking-wider text-blue-600 font-semibold">
                    {language === "en" ? "About Us" : "আমাদের সম্পর্কে"}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
                    {language === "en"
                      ? "A Legacy of Healing"
                      : "আরোগ্যের উত্তরাধিকার"}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {language === "en"
                      ? "Medical Centre Hospital Chattagram has been a beacon of hope and healing in the community for over 28 years. What started as a small clinic has grown into a premier healthcare institution, equipped with cutting-edge technology and staffed by some of the most dedicated medical professionals in the region."
                      : "মেডিকেল সেন্টার হাসপাতাল চট্টগ্রাম ২৮ বছরেরও বেশি সময় ধরে সম্প্রদায়ের আশা ও আরোগ্যের আলোকবর্তিকা হয়ে আছে। যা একটি ছোট ক্লিনিক হিসেবে শুরু হয়েছিল তা একটি প্রধান স্বাস্থ্যসেবা প্রতিষ্ঠানে পরিণত হয়েছে, যা অত্যাধুনিক প্রযুক্তিতে সজ্জিত এবং অঞ্চলের সবচেয়ে নিবেদিত চিকিৎসা পেশাদারদের দ্বারা পরিচালিত।"}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "Our journey is marked by continuous growth, innovation, and an unwavering commitment to patient care. We've touched the lives of over 50,000 patients and counting."
                      : "আমাদের যাত্রা ক্রমাগত বৃদ্ধি, উদ্ভাবন এবং রোগী যত্নের প্রতি অটল প্রতিশ্রুতি দ্বারা চিহ্নিত। আমরা ৫০,০০০ এরও বেশি রোগীর জীবন স্পর্শ করেছি এবং আরও অনেকের।"}
                  </p>
                </div>
                <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Medical Centre Hospital - About"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Our Journey Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <span className="text-sm uppercase tracking-wider text-blue-600 font-semibold">
                {language === "en" ? "Timeline" : "সময়রেখা"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                {language === "en" ? "Our Journey Through Time" : "সময়ের সাথে আমাদের যাত্রা"}
              </h2>
              <p className="text-gray-600 mt-2">
                {language === "en"
                  ? "Key milestones in our history of healthcare excellence"
                  : "স্বাস্থ্যসেবা শ্রেষ্ঠত্বের ইতিহাসে গুরুত্বপূর্ণ মাইলফলক"}
              </p>
            </div>

            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 transform -translate-x-1/2"></div>

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-10">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                        <span className="text-xs md:text-sm font-bold">{index + 1}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"} pl-16 md:pl-0`}>
                      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{milestone.icon}</span>
                          <span className="text-2xl font-bold text-blue-600">{milestone.year}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {language === "en" ? milestone.titleEn : milestone.titleBn}
                        </h3>
                        <p className="text-gray-600 text-sm mt-2">
                          {language === "en" ? milestone.descEn : milestone.descBn}
                        </p>
                      </div>
                    </div>

                    {/* Empty space for alternate side */}
                    <div className="hidden md:block w-5/12"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Values & Culture */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
              <div className="text-center mb-8">
                <span className="text-sm uppercase tracking-wider text-white/80 font-semibold">
                  {language === "en" ? "Our Culture" : "আমাদের সংস্কৃতি"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">
                  {language === "en"
                    ? "What Drives Us Forward"
                    : "আমাদের এগিয়ে নিয়ে যায় যা"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">💙</div>
                  <h3 className="font-bold text-lg mb-2">
                    {language === "en" ? "Patient First" : "রোগী প্রথম"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {language === "en"
                      ? "Every decision we make is centered around what's best for our patients"
                      : "আমরা প্রতিটি সিদ্ধান্ত নিই রোগীদের জন্য সর্বোত্তম কি তার উপর কেন্দ্রীভূত"}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">🌟</div>
                  <h3 className="font-bold text-lg mb-2">
                    {language === "en" ? "Excellence" : "শ্রেষ্ঠত্ব"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {language === "en"
                      ? "We strive for excellence in everything we do, from diagnosis to recovery"
                      : "নির্ণয় থেকে পুনরুদ্ধার পর্যন্ত আমরা যা করি তাতে শ্রেষ্ঠত্বের জন্য চেষ্টা করি"}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition">
                  <div className="text-4xl mb-3">🤝</div>
                  <h3 className="font-bold text-lg mb-2">
                    {language === "en" ? "Community" : "সম্প্রদায়"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {language === "en"
                      ? "We're proud to be part of this community and give back whenever we can"
                      : "আমরা এই সম্প্রদায়ের অংশ হতে পেরে গর্বিত এবং যখনই পারি ফিরিয়ে দিতে চাই"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {language === "en"
                  ? "Be Part of Our Story"
                  : "আমাদের গল্পের অংশ হোন"}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                {language === "en"
                  ? "Whether you're a patient, a healthcare professional, or a community member, we invite you to be part of our continuing journey of healthcare excellence."
                  : "আপনি একজন রোগী, একজন স্বাস্থ্যসেবা পেশাদার বা একজন সম্প্রদায়ের সদস্য হোন না কেন, আমরা আপনাকে স্বাস্থ্যসেবা শ্রেষ্ঠত্বের আমাদের চলমান যাত্রার অংশ হওয়ার জন্য আমন্ত্রণ জানাচ্ছি।"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/appointment"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full hover:shadow-lg transition"
                >
                  {language === "en" ? "Book Appointment" : "অ্যাপয়েন্টমেন্ট বুক করুন"}
                </a>
                <a
                  href="/contact"
                  className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition"
                >
                  {language === "en" ? "Contact Us" : "যোগাযোগ করুন"}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
        <div className="flex items-center justify-center rounded-2xl overflow-hidden shadow-xl">
  <Image
    src="/v.jpeg"
    alt=""
    width={800}      // Set according to your image
    height={1200}    // Set according to your image
    className="h-auto w-auto max-h-screen object-contain"
    priority
  />
</div>
      <Footer />
    </>
  );
}