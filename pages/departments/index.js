import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect } from "react";

// Hardcoded departments that have pages in /departments/[department].js
const departmentsList = [
  { id: "medicine", name: "Medicine", name_bn: "মেডিসিন", description: "Comprehensive Internal Medicine Healthcare Services", description_bn: "ব্যাপক অভ্যন্তরীণ চিকিৎসা স্বাস্থ্যসেবা", image: "" },
  { id: "cardiology", name: "Cardiology", name_bn: "কার্ডিওলজি", description: "Comprehensive Heart Care Services", description_bn: "ব্যাপক হৃদরোগ চিকিৎসা সেবা", image: "" },
  { id: "neuro-medicine", name: "Neuro Medicine", name_bn: "নিউরো মেডিসিন", description: "Advanced Neurological Care & Treatment", description_bn: "উন্নত নিউরোলজিক্যাল যত্ন ও চিকিৎসা", image: "" },
  { id: "gastroenterology", name: "Gastroenterology", name_bn: "গ্যাস্ট্রোএন্টারোলজি", description: "Advanced Digestive & Liver Care", description_bn: "উন্নত হজম ও লিভার যত্ন", image: "" },
  { id: "ent", name: "ENT", name_bn: "ENT", description: "Ear, Nose, Throat & Head-Neck Surgery", description_bn: "কান, নাক, গলা ও মাথা-গলা সার্জারি", image: "" },
  { id: "gynee-obs", name: "Gynecology & Obstetrics", name_bn: "গাইনি ও প্রসূতি", description: "Complete Women's Healthcare", description_bn: "সম্পূর্ণ মহিলা স্বাস্থ্যসেবা", image: "" },
  { id: "nephrology", name: "Nephrology", name_bn: "নেফ্রোলজি", description: "Comprehensive Kidney Care", description_bn: "ব্যাপক কিডনি যত্ন", image: "" },
  { id: "orthopedics", name: "Orthopedics", name_bn: "অর্থোপেডিক্স", description: "Bone, Joint & Trauma Care", description_bn: "হাড়, জয়েন্ট ও ট্রমা যত্ন", image: "" },
  { id: "oncology", name: "Oncology", name_bn: "অনকোলজি", description: "Comprehensive Cancer Care", description_bn: "ব্যাপক ক্যান্সার যত্ন", image: "" },
  { id: "psychiatry", name: "Psychiatry", name_bn: "সাইকিয়াট্রি", description: "Mental Health & Behavioral Sciences", description_bn: "মানসিক স্বাস্থ্য ও আচরণবিজ্ঞান", image: "" },
  { id: "pediatrics", name: "Pediatrics", name_bn: "পেডিয়াট্রিক্স", description: "Comprehensive Child Healthcare", description_bn: "ব্যাপক শিশু স্বাস্থ্যসেবা", image: "" },
  { id: "physical-medicine", name: "Physical Medicine", name_bn: "ফিজিক্যাল মেডিসিন", description: "Rehabilitation & Pain Management", description_bn: "পুনর্বাসন ও ব্যথা ব্যবস্থাপনা", image: "" },
  { id: "skin-vd", name: "Skin & VD", name_bn: "স্কিন ও VD", description: "Dermatology & Venereology Care", description_bn: "ডার্মাটোলজি ও ভেনেরিওলজি যত্ন", image: "" },
  { id: "surgery", name: "Surgery", name_bn: "সার্জারি", description: "Comprehensive Surgical Services", description_bn: "ব্যাপক শল্য চিকিৎসা সেবা", image: "" },
  { id: "urology", name: "Urology", name_bn: "ইউরোলজি", description: "Comprehensive Urological Care", description_bn: "ব্যাপক ইউরোলজিক্যাল যত্ন", image: "" }
];

// Hardcoded specialities that have pages in /specialities/*.js
const specialitiesList = [
  { id: "ot", name: "OT", name_bn: "ওটি", description: "Operation Theatre for surgeries", description_bn: "সার্জারির জন্য অপারেশন থিয়েটার", image: "" },
  { id: "icu", name: "ICU", name_bn: "আইসিইউ", description: "Intensive Care Unit for critically ill patients", description_bn: "গুরুতর অসুস্থ রোগীদের জন্য নিবিড় পরিচর্যা কেন্দ্র", image: "" },
  { id: "ccu", name: "CCU", name_bn: "সিসিইউ", description: "Coronary Care Unit for heart patients", description_bn: "হৃদরোগীদের জন্য কোরোনারি কেয়ার ইউনিট", image: "" },
  { id: "nicu", name: "NICU", name_bn: "নিসিইউ", description: "Neonatal Intensive Care Unit for newborns", description_bn: "নবজাতকদের জন্য নিওনেটাল ইন্টেন্সিভ কেয়ার ইউনিট", image: "" },
  { id: "hdu", name: "HDU", name_bn: "এইচডিইউ", description: "High Dependency Unit for serious but stable patients", description_bn: "গুরুতর কিন্তু স্থিতিশীল রোগীদের জন্য হাই ডিপেন্ডেন্সি ইউনিট", image: "" },
  { id: "ed", name: "ED", name_bn: "ইডি", description: "Emergency Department for urgent care", description_bn: "জরুরি চিকিৎসার জন্য জরুরি বিভাগ", image: "" },
  { id: "dialysis", name: "Dialysis", name_bn: "ডায়ালাইসিস", description: "Kidney dialysis services", description_bn: "কিডনি ডায়ালাইসিস সেবা", image: "" },
  { id: "gynae", name: "Gynecology", name_bn: "গাইনোকোলজি", description: "Women's health and maternity care", description_bn: "মহিলাদের স্বাস্থ্য এবং মাতৃত্ব যত্ন", image: "" },
  { id: "paedi", name: "Pediatrics", name_bn: "শিশু বিভাগ", description: "Child healthcare services", description_bn: "শিশু স্বাস্থ্যসেবা", image: "" },
  { id: "sdu", name: "SDU", name_bn: "এসডিইউ", description: "Special Care Unit for specific medical needs", description_bn: "নির্দিষ্ট চিকিৎসা প্রয়োজনের জন্য স্পেশাল কেয়ার ইউনিট", image: "" }
];

// Hardcoded diagnostics that have pages in /diagnostic/*.js
const diagnosticsList = [
  { id: "radiology", name: "Radiology", name_bn: "রেডিওলজি", description: "X-Ray, CT Scan, MRI, Ultrasound imaging services", description_bn: "এক্স-রে, সিটি স্ক্যান, এমআরআই, আল্ট্রাসাউন্ড ইমেজিং সেবা", image: "" },
  { id: "pathology", name: "Pathology", name_bn: "প্যাথলজি", description: "Laboratory tests and diagnostic services", description_bn: "ল্যাবরেটরি পরীক্ষা এবং ডায়াগনস্টিক সেবা", image: "" }
];

// Default cover images
const defaultImages = {
  departments: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200",
  specialities: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200",
  diagnostics: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200"
};

// Storage key for cover images
const COVER_IMAGES_KEY = 'hospital_cover_images';

export default function Departments() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('departments');
  const [coverImages, setCoverImages] = useState({});

  // Load cover images from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COVER_IMAGES_KEY);
      if (saved) {
        try {
          setCoverImages(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing cover images:', e);
        }
      }
    }
  }, []);

  const getCurrentItems = () => {
    if (activeTab === 'departments') return departmentsList;
    if (activeTab === 'specialities') return specialitiesList;
    return diagnosticsList;
  };

  const getItemName = (item) => {
    if (language === 'bn' && item.name_bn) return item.name_bn;
    return item.name;
  };

  const getItemDescription = (item) => {
    if (language === 'bn' && item.description_bn) return item.description_bn;
    return item.description;
  };

  const getItemLink = (item) => {
    if (activeTab === 'departments') return `/departments/${item.id}`;
    if (activeTab === 'specialities') return `/specialities/${item.id}`;
    return `/diagnostic/${item.id}`;
  };

  const getDefaultImage = () => {
    if (activeTab === 'departments') return defaultImages.departments;
    if (activeTab === 'specialities') return defaultImages.specialities;
    return defaultImages.diagnostics;
  };

  const getItemImage = (item) => {
    // Check if there's a custom cover image saved
    const type = activeTab === 'departments' ? 'dept' : activeTab === 'specialities' ? 'spec' : 'diag';
    const key = `${type}_${item.id}`;
    return coverImages[key] || getDefaultImage();
  };

  return (
    <>
      <Head>
        <title>{language === "en" ? "Departments - Medical Center" : "বিভাগসমূহ - মেডিকেল সেন্টার"}</title>
      </Head>
      <Navbar />
      
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "en" ? "Our Departments" : "আমাদের বিভাগসমূহ"}
            </h1>
            <p className="text-lg opacity-90">
              {language === "en" 
                ? "Comprehensive medical services across specialized departments" 
                : "বিভিন্ন বিশেষায়িত বিভাগ জুড়ে ব্যাপক চিকিৎসা সেবা"}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'departments' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {language === "en" ? "Departments" : "বিভাগ"}
            </button>
            <button
              onClick={() => setActiveTab('specialities')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'specialities' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {language === "en" ? "Specialities" : "বিশেষায়িত বিভাগ"}
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'diagnostics' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {language === "en" ? "Diagnostic Services" : "ডায়াগনস্টিক সেবা"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getCurrentItems().map((item) => (
              <Link 
                href={getItemLink(item)}
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 block"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getItemImage(item)}
                    alt={getItemName(item)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => e.target.src = getDefaultImage()}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{getItemName(item)}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {getItemDescription(item) || "No description available."}
                  </p>
                  <span className="text-blue-600 font-semibold text-sm group-hover:underline">
                    {language === "en" ? "Learn More →" : "আরও জানুন →"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

