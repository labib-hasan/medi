import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";
import { useState, useEffect } from "react";

export default function Contact() {
  const { language } = useLanguage();
  const t = translations[language];
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/get-contact")
      .then((res) => res.json())
      .then((data) => {
        setContact(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !contact) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  const defaultAddress =
    language === "en"
      ? "Agrabad Access Road, Beside BP Chattogram, Chattogram"
      : "আগ্রাবাদ অ্যাক্সেস রোড, বিপি চট্টগ্রামের পাশে, চট্টগ্রাম";

  const displayAddress = contact.address || defaultAddress;

  // Map coordinates - Updated to user's location: 9R5F+Q5 Chattogram
  const lat = contact.lat || 22.3365;
  const lng = contact.lng || 91.8350;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <>
      <Head>
        <title>Contact Us - Medical Centre Chattagram</title>
        <meta
          name="description"
          content="Contact Medical Centre Chattagram for appointments and inquiries"
        />
      </Head>

      <Navbar />

      <main className="pt-20 min-h-screen mb-70 bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-500 py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {language === "en" ? "Contact Us" : "যোগাযোগ করুন"}
            </h1>
            <p className="text-white/90 text-lg md:text-xl">
              {language === "en"
                ? "We're Here to Help You 24/7"
                : "আমরা আপনাকে ২৪/৭ সাহায্য করতে এখানে আছি"}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 -mt-8 relative z-20">
          {/* Emergency Banner */}
          {contact.hotline && (
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-2xl p-8 mb-12 text-white shadow-2xl transform hover:scale-[1.01] transition-transform">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/90 text-sm font-medium">
                      {language === "en"
                        ? "24/7 Emergency Hotline"
                        : "২৪/৭ জরুরি হটলাইন"}
                    </p>
                    <p className="text-3xl md:text-4xl font-bold">
                      {contact.hotline || "+8809610-818888"}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${contact.hotline || "+8809610818888"}`}
                  className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {language === "en" ? "Call Now" : "এখন কল করুন"}
                </a>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {language === "en" ? "Get in Touch" : "যোগাযোগ করুন"}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Phone */}
                {contact.phone && (
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        {language === "en" ? "Phone" : "ফোন"}
                      </p>
                      <p className="text-gray-800 font-semibold text-lg">
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Emergency Phone */}
                {contact.emergencyPhone && (
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        {language === "en" ? "Emergency" : "জরুরি"}
                      </p>
                      <p className="text-gray-800 font-semibold text-lg">
                        {contact.emergencyPhone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Email */}
                {contact.email && (
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        {language === "en" ? "Email" : "ইমেইল"}
                      </p>
                      <p className="text-gray-800 font-semibold text-lg">
                        {contact.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Address */}
                {contact.address && (
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        {language === "en" ? "Address" : "ঠিকানা"}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {language === "en"
                          ? displayAddress
                          : contact.addressBn || displayAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {language === "en" ? "Working Hours" : "কর্মঘণ্টা"}
                </h2>
              </div>

              <div className="space-y-4">
                {/* Always Open */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">
                      {language === "en" ? "Always Open" : "সবসময় খোলা"}
                    </span>
                  </div>
                  <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    24 Hours
                  </span>
                </div>

                {/* 7 Days a Week */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">
                      {language === "en" ? "Every Day" : "প্রতিদিন"}
                    </span>
                  </div>
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    7 Days
                  </span>
                </div>

                {/* 365 Days Service */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">
                      {language === "en" ? "365 Days Service" : "৩৬৫ দিন সেবা"}
                    </span>
                  </div>
                  <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {language === "en" ? "Round the Clock" : "সার্বক্ষণিক"}
                  </span>
                </div>

                {/* 24/7 Support */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">
                      {language === "en" ? "24/7 Support" : "২৪/৭ সাপোর্ট"}
                    </span>
                  </div>
                  <span className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Always
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {language === "en" ? "Find Us on Map" : "ম্যাপে আমাদের খুঁজুন"}
                </h2>
                <p className="text-gray-500 mt-1">
                  {language === "en"
                    ? "Visit our location for in-person consultation"
                    : "ব্যক্তিগত পরামর্শের জন্য আমাদের লোকেশনে যান"}
                </p>
              </div>
             
            </div>

            <div className="h-[450px] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1844.9225522446363!2d91.8218063579523!3d22.359476796323232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd9642a7a89ad%3A0x5a27dec74fd7cc24!2sMedical+Centre+Pvt.+Hospital!5e0!3m2!1sen!2sbd!4v1563738852407!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Medical Centre Pvt. Hospital Location"
              ></iframe>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "en" ? "Quality Care" : "মানসম্পন্ন যত্ন"}
              </h3>
              <p className="text-white/80">
                {language === "en"
                  ? "ISO certified healthcare services"
                  : "আইএসও প্রত্যয়িত স্বাস্থ্যসেবা"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "en" ? "Expert Doctors" : "বিশেষজ্ঞ ডাক্তার"}
              </h3>
              <p className="text-white/80">
                {language === "en"
                  ? "Experienced medical professionals"
                  : "অভিজ্ঞ চিকিৎসা পেশাদার"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "en" ? "Patient First" : "রোগী প্রথম"}
              </h3>
              <p className="text-white/80">
                {language === "en"
                  ? "Compassionate healthcare"
                  : "সহানুভূতিপূর্ণ স্বাস্থ্যসেবা"}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
