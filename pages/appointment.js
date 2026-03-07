import { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";

export default function Appointment() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    department: "",
    doctor: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to an API
    alert(language === "en" ? "Appointment request submitted!" : "অ্যাপয়েন্টমেন্ট অনুরোধ জমা দেওয়া হয়েছে!");
    setFormData({
      name: "",
      phone: "",
      email: "",
      date: "",
      department: "",
      doctor: "",
      message: ""
    });
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <>
      <Head>
        <title>{language === "en" ? "Book Appointment - Medical Center" : "অ্যাপয়েন্টমেন্ট বুক করুন - মেডিকেল সেন্টার"}</title>
      </Head>
      <Navbar />
      
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "en" ? "Book an Appointment" : "অ্যাপয়েন্টমেন্ট বুক করুন"}
            </h1>
            <p className="text-lg opacity-90">
              {language === "en" 
                ? "Schedule your visit with our expert doctors" 
                : "আমাদের বিশেষজ্ঞ ডাক্তারদের সাথে আপনার সাক্ষাতের সময় নির্ধারণ করুন"}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "en" ? "Patient Name" : "রোগীর নাম"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === "en" ? "Enter full name" : "পুরো নাম লিখুন"}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "en" ? "Phone Number" : "ফোন নম্বর"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === "en" ? "Enter phone number" : "ফোন নম্বর লিখুন"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "en" ? "Email (Optional)" : "ইমেইল (ঐচ্ছিক)"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "en" ? "Preferred Date" : "পছন্দের তারিখ"}
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "en" ? "Department" : "বিভাগ"}
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">{language === "en" ? "Select Department" : "বিভাগ নির্বাচন করুন"}</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {language === "en" ? "Doctor (Optional)" : "ডাক্তার (ঐচ্ছিক)"}
                  </label>
                  <input
                    type="text"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === "en" ? "Doctor's name" : "ডাক্তারের নাম"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {language === "en" ? "Message / Symptoms" : "বার্তা / লক্ষণ"}
                </label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder={language === "en" ? "Describe your problem..." : "আপনার সমস্যা বর্ণনা করুন..."}
                ></textarea>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {language === "en" ? "Confirm Appointment" : "অ্যাপয়েন্টমেন্ট নিশ্চিত করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
