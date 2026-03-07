import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";

const departmentsList = [
  { id: 'medicine', name: { en: "Medicine", bn: "মেডিসিন" }, description: { en: "Comprehensive internal medicine care.", bn: "ব্যাপক অভ্যন্তরীণ চিকিৎসা সেবা।" }, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200" },
  { id: 'neuro-medicine', name: { en: "Neuro Medicine", bn: "নিউরো মেডিসিন" }, description: { en: "Advanced neurological care.", bn: "উন্নত স্নায়বিক সেবা।" }, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200" },
  { id: 'cardiology', name: { en: "Cardiology", bn: "কার্ডিওলজি" }, description: { en: "Heart care and surgery.", bn: "হৃদরোগ ও সার্জারি।" }, image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200" },
  { id: 'gastroenterology', name: { en: "Gastroenterology", bn: "গ্যাস্ট্রোএন্টারোলজি" }, description: { en: "Digestive system health.", bn: "পাচনতন্ত্রের স্বাস্থ্য।" }, image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200" },
  { id: 'ent', name: { en: "ENT", bn: "নাক, কান ও গলা" }, description: { en: "Ear, Nose, and Throat care.", bn: "নাক, কান এবং গলার যত্ন।" }, image: "https://images.unsplash.com/photo-1584063366292-4c8e9f1a5c0e?w=1200" },
  { id: 'gynee-obs', name: { en: "Gynecology & Obstetrics", bn: "গাইনি ও প্রসূতি" }, description: { en: "Women's health and maternity.", bn: "মহিলাদের স্বাস্থ্য এবং মাতৃত্ব।" }, image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200" },
  { id: 'nephrology', name: { en: "Nephrology", bn: "নেফ্রোলজি" }, description: { en: "Kidney care and dialysis.", bn: "কিডনি যত্ন এবং ডায়ালাইসিস।" }, image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200" },
  { id: 'orthopedics', name: { en: "Orthopedics", bn: "অর্থোপেডিক্স" }, description: { en: "Bone and joint care.", bn: "হাড় এবং জয়েন্টের যত্ন।" }, image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200" },
  { id: 'oncology', name: { en: "Oncology", bn: "অনকোলজি" }, description: { en: "Cancer treatment and care.", bn: "ক্যান্সার চিকিৎসা এবং যত্ন।" }, image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200" },
  { id: 'psychiatry', name: { en: "Psychiatry", bn: "মানসিক রোগ" }, description: { en: "Mental health services.", bn: "মানসিক স্বাস্থ্য সেবা।" }, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200" },
  { id: 'pediatrics', name: { en: "Pediatrics", bn: "শিশু বিভাগ" }, description: { en: "Child healthcare services.", bn: "শিশু স্বাস্থ্যসেবা।" }, image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1200" },
  { id: 'physical-medicine', name: { en: "Physical Medicine", bn: "ফিজিক্যাল মেডিসিন" }, description: { en: "Rehabilitation and therapy.", bn: "পুনর্বাসন এবং থেরাপি।" }, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200" },
  { id: 'skin-vd', name: { en: "Skin & VD", bn: "চর্ম ও যৌন রোগ" }, description: { en: "Dermatology and venereology.", bn: "চর্মরোগ এবং যৌনরোগ।" }, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200" },
  { id: 'surgery', name: { en: "Surgery", bn: "সার্জারি" }, description: { en: "General and specialized surgery.", bn: "সাধারণ এবং বিশেষায়িত সার্জারি।" }, image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200" },
  { id: 'urology', name: { en: "Urology", bn: "ইউরোলজি" }, description: { en: "Urinary tract health.", bn: "মূত্রনালীর স্বাস্থ্য।" }, image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200" },
];

export default function Departments() {
  const { language } = useLanguage();
  const t = translations[language];

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

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departmentsList.map((dept) => (
              <Link 
                href={`/departments/${dept.id}`}
                key={dept.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 block"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.name[language]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => e.target.src = "/placeholder-department.jpg"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{dept.name[language]}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {dept.description[language]}
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
