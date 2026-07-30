import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "../context/LanguageContext";

const informationCards = [
  {
    title: { en: "24/7 Service", bn: "২৪/৭ সেবা" },
    description: { en: "Round the clock healthcare", bn: "সার্বক্ষণিক স্বাস্থ্যসেবা" },
    icon: "clock",
  },
  {
    title: { en: "Expert Team", bn: "বিশেষজ্ঞ দল" },
    description: { en: "Qualified professionals", bn: "যোগ্য পেশাদার" },
    icon: "team",
  },
  {
    title: { en: "Patient Care", bn: "রোগীর যত্ন" },
    description: { en: "Compassionate care", bn: "সহানুভূতিপূর্ণ যত্ন" },
    icon: "heart",
  },
];

const CardIcon = ({ type }) => {
  const paths = {
    clock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    team: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  };

  return <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">{paths[type]}</svg>;
};

export default function DirectorMessagePage({ director }) {
  const { language } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/directors/${director.slug}`);
        const data = await response.json();
        if (data.success && data.director) setProfile(data.director);
      } catch {
        // The default labels are shown until the director profile is saved in admin.
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [director.slug]);

  const title = profile?.title || director.title;
  const name = profile?.name || director.name;
  const position = profile?.position || director.position;
  const message = profile?.message || "";
  const image = profile?.image_url || null;

  return (
    <>
      <Head>
        <title>{title} - Medical Center</title>
        <meta name="description" content={`${title} of Medical Center Chattagram`} />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="flex flex-col items-center bg-gradient-to-b from-blue-50 to-white p-8">
              <div className="flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                {image ? (
                  <img src={image} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <svg className="h-28 w-28 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 4 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>

              <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
                <p className="mt-1 font-semibold text-blue-600">{position}</p>
              </div>

              <div className="mt-4 rounded-full bg-white/50 px-6 py-2">
                <p className="font-medium text-gray-700">
                  {language === "en" ? "Medical Centre Chattagram" : "মেডিকেল সেন্টার চট্টগ্রাম"}
                </p>
              </div>
            </div>

            <div className="p-8">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-gray-500">{language === "en" ? "Loading..." : "লোড হচ্ছে..."}</p>
                </div>
              ) : message ? (
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">{message}</p>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-gray-500">
                    {language === "en" ? "No message available. Please check back later!" : "কোনো মেসেজ পাওয়া যায়নি। পরে আবার চেক করুন!"}
                  </p>
                </div>
              )}

              {message && (
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <p className="text-xl text-gray-800">{language === "en" ? "Sincerely," : "ধন্যবাদান্তে,"}</p>
                  <p className="mt-2 font-semibold text-blue-600">{name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {informationCards.map((card) => (
              <div key={card.icon} className="rounded-xl bg-white p-6 text-center shadow">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <CardIcon type={card.icon} />
                </div>
                <h4 className="font-semibold text-gray-800">{card.title[language]}</h4>
                <p className="mt-1 text-sm text-gray-500">{card.description[language]}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
