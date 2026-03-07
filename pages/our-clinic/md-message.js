import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import { useState, useEffect } from "react";

export default function MdMessage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [mdImage, setMdImage] = useState(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch MD image
    fetch("/api/get-md-image")
      .then((res) => res.json())
      .then((data) => {
        if (data.image) setMdImage(data.image);
      })
      .catch(() => {});

    // Fetch MD message
    fetch("/api/get-md-message")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setPosition(data.position || "");
        setTitle(data.title || "");
        setMessage(data.message || "");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Message from MD - Medical Center</title>
        <meta name="description" content="Message from Managing Director of Medical Center Chattagram" />
      </Head>

      <Navbar />

      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {title || (language === "en" ? "Message from Managing Director" : "ব্যবস্থাপনা পরিচালকের বার্তা")}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* MD Photo - Top */}
            <div className="bg-gradient-to-b from-blue-50 to-white p-8 flex flex-col items-center">
              <div className="w-56 h-56 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                {mdImage ? (
                  <img
                    src={mdImage}
                    alt="Managing Director"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-28 h-28 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>

              {/* Name & Position */}
              <div className="text-center mt-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {name || (language === "en" ? "Managing Director" : "ব্যবস্থাপনা পরিচালক")}
                </h2>
                <p className="text-blue-600 font-semibold mt-1">
                  {position || (language === "en" ? "Managing Director" : "ব্যবস্থাপনা পরিচালক")}
                </p>
              </div>

              {/* Medical Name */}
              <div className="mt-4 bg-white/50 px-6 py-2 rounded-full">
                <p className="text-gray-700 font-medium">
                  {language === "en" ? "Medical Centre Chattagram" : "মেডিকেল সেন্টার চট্টগ্রাম"}
                </p>
              </div>
            </div>

            {/* MD Message - Bottom */}
            <div className="p-8">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-500">
                    {language === "en" ? "Loading..." : "লোড হচ্ছে..."}
                  </p>
                </div>
              ) : message ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {message}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-500">
                    {language === "en" 
                      ? "No message available. Please check back later!" 
                      : "কোনো মেসেজ পাওয়া যায়নি। পরে আবার চেক করুন!"}
                  </p>
                </div>
              )}

              {/* Signature */}
              {message && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-gray-800 font-script text-xl">
                    {language === "en" ? "Sincerely," : "ধন্যবাদান্তে,"}
                  </p>
                  <p className="text-blue-600 font-semibold mt-2">
                    {name || (language === "en" ? "Managing Director" : "ব্যবস্থাপনা পরিচালক")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800">
                {language === "en" ? "24/7 Service" : "২৪/৭ সেবা"}
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                {language === "en" 
                  ? "Round the clock healthcare" 
                  : "সার্বক্ষণিক স্বাস্থ্যসেবা"}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800">
                {language === "en" ? "Expert Team" : "বিশেষজ্ঞ দল"}
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                {language === "en" 
                  ? "Qualified professionals" 
                  : "যোগ্য পেশাদার"}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800">
                {language === "en" ? "Patient Care" : "রোগীর যত্ন"}
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                {language === "en" 
                  ? "Compassionate care" 
                  : "সহানুভূতিপূর্ণ যত্ন"}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
