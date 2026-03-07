import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";

const specialtiesList = [
  { 
    id: 'icu', 
    title: { en: "ICU – Intensive Care Unit", bn: "আইসিইউ - ইনটেনসিভ কেয়ার ইউনিট" }, 
    description: { en: "Specialized care for patients with life-threatening conditions.", bn: "জীবন-হুমকির সম্মুখীন রোগীদের জন্য বিশেষায়িত যত্ন।" },
    link: "/specialities/icu",
    icon: "🏥"
  },
  { 
    id: 'ccu', 
    title: { en: "CCU – Critical Care Unit", bn: "সিসিইউ - ক্রিটিক্যাল কেয়ার ইউনিট" }, 
    description: { en: "Specialized cardiac care for patients with heart conditions.", bn: "হৃদরোগে আক্রান্ত রোগীদের জন্য বিশেষায়িত কার্ডিয়াক যত্ন।" },
    link: "/specialities/ccu",
    icon: "💓"
  },
  { 
    id: 'hdu', 
    title: { en: "HDU – High Dependency Unit", bn: "এইচডিইউ - হাই ডিপেন্ডেন্সি ইউনিট" }, 
    description: { en: "Intermediate care for patients who require more monitoring than a general ward.", bn: "সাধারণ ওয়ার্ডের চেয়ে বেশি পর্যবেক্ষণের প্রয়োজন এমন রোগীদের জন্য মধ্যবর্তী যত্ন।" },
    link: "/specialities/hdu",
    icon: "🛏️"
  },
  { 
    id: 'sdu', 
    title: { en: "SDU – Step Down Unit", bn: "এসডিইউ - স্টেপ ডাউন ইউনিট" }, 
    description: { en: "Transitional care for patients moving from ICU/CCU to general wards.", bn: "আইসিইউ/সিসিইউ থেকে সাধারণ ওয়ার্ডে স্থানান্তরিত রোগীদের জন্য ট্রানজিশনাল কেয়ার।" },
    link: "/specialities/sdu",
    icon: "📉"
  },
  { 
    id: 'nicu', 
    title: { en: "NICU – Neonatal ICU", bn: "এনআইসিইউ - নিওনেটাল আইসিইউ" }, 
    description: { en: "Intensive care for ill or premature newborn infants.", bn: "অসুস্থ বা অকাল নবজাতক শিশুদের জন্য নিবিড় যত্ন।" },
    link: "/specialities/nicu",
    icon: "👶"
  },
  { 
    id: 'gynae', 
    title: { en: "GYNAE - Gynecology", bn: "গাইনি - গাইনোকোলজি" }, 
    description: { en: "Comprehensive care for women's reproductive health.", bn: "মহিলাদের প্রজনন স্বাস্থ্যের জন্য ব্যাপক যত্ন।" },
    link: "/specialities/gynae",
    icon: "👩"
  },
  { 
    id: 'paedi', 
    title: { en: "PAEDI - Pediatric", bn: "পেডি - শিশু বিভাগ" }, 
    description: { en: "Medical care for infants, children, and adolescents.", bn: "শিশু, কিশোর এবং কিশোর-কিশোরীদের জন্য চিকিৎসা সেবা।" },
    link: "/specialities/paedi",
    icon: "🧸"
  },
  { 
    id: 'ot', 
    title: { en: "OT - Operation Theatre", bn: "ওটি - অপারেশন থিয়েটার" }, 
    description: { en: "Advanced surgical suites for various procedures.", bn: "বিভিন্ন পদ্ধতির জন্য উন্নত সার্জিক্যাল স্যুট।" },
    link: "/specialities/ot",
    icon: "✂️"
  },
  { 
    id: 'ed', 
    title: { en: "ED - Emergency", bn: "ইডি - জরুরি বিভাগ" }, 
    description: { en: "24/7 emergency medical services.", bn: "২৪/৭ জরুরি চিকিৎসা সেবা।" },
    link: "/specialities/ed",
    icon: "🚑"
  },
  { 
    id: 'dialysis', 
    title: { en: "Dialysis - Kidney Care", bn: "ডায়ালাইসিস - কিডনি যত্ন" }, 
    description: { en: "Life-saving dialysis treatment for kidney failure patients.", bn: "কিডনি ফেইলিওর রোগীদের জন্য জীবন রক্ষাকারী ডায়ালাইসিস চিকিৎসা।" },
    link: "/specialities/dialysis",
    icon: "🩸"
  },
];

export default function Services() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <Head>
        <title>{language === "en" ? "Services - Medical Center" : "সেবাসমূহ - মেডিকেল সেন্টার"}</title>
      </Head>
      <Navbar />
      
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "en" ? "Our Services" : "আমাদের সেবাসমূহ"}
            </h1>
            <p className="text-lg opacity-90">
              {language === "en" 
                ? "World-class medical services for your health and well-being" 
                : "আপনার স্বাস্থ্য এবং সুস্থতার জন্য বিশ্বমানের চিকিৎসা সেবা"}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialtiesList.map((service) => (
              <Link 
                href={service.link}
                key={service.id}
                className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 block"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center text-2xl">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {service.title[language]}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {service.description[language]}
                </p>
                <span className="text-blue-600 font-semibold text-sm group-hover:underline flex items-center gap-1">
                  {language === "en" ? "Learn More" : "আরও জানুন"} 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
