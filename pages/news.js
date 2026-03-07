import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";
import { useState, useEffect } from "react";

export default function NewsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/get-news");
      const data = await res.json();
      setNews(data.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) + " • " + date.toLocaleTimeString(language === "bn" ? "bn-BD" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Head>
        <title>{language === "en" ? "News - Medical Center" : "খবর - মেডিকেল সেন্টার"}</title>
        <meta name="description" content="Latest news from Medical Center Chattagram" />
      </Head>

      <Navbar />

      <main className="pt-20 min-h-screen mb-70 bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800  to-slate-900 py-12 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {language === "en" ? "Latest News" : "সর্বশেষ খবর"}
            </h1>
            <p className="text-slate-300 text-sm">
              {language === "en"
                ? "Stay Updated with Medical Center Chattagram"
                : "মেডিকেল সেন্টার চট্টগ্রামের সাথে আপডেট থাকুন"}
            </p>
          </div>
        </div>

        {/* News List - Slim Row-wise Design */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4">{language === "en" ? "Loading..." : "লোড হচ্ছে..."}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {language === "en" ? "No news yet" : "এখনও কোনো খবর নেই"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {language === "en" ? "Please check back later!" : "পরে আবার চেক করুন!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedNews(item)}
                >
                  <div className="flex gap-4">
                    {/* Small Thumbnail */}
                    {item.image && (
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 py-1">
                      {/* Date & Time */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDateTime(item.createdAt)}</span>
                      </div>
                      
                      {/* Headline */}
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      {/* Text Preview */}
                      <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex items-center justify-center w-8 flex-shrink-0">
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* News Detail Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedNews(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors"
            onClick={() => setSelectedNews(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero Image */}
            {selectedNews.image && (
              <div className="relative h-56 overflow-hidden">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}
            
            <div className="p-6 md:p-8">
              {/* Date Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium mb-4">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDateTime(selectedNews.createdAt)}
              </div>
              
              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {selectedNews.title}
              </h2>
              
              {/* Content */}
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {selectedNews.content}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
