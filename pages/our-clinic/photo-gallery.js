import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import { useState, useEffect } from "react";

export default function PhotoGallery() {
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/get-gallery-images");
      const data = await res.json();
      console.log("Gallery images response:", data);
      setImages(data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError(language === "en" ? "Failed to load images" : "ছবি লোড করতে ব্যর্থ");
    } finally {
      setLoading(false);
    }
  };

  const galleryImages = images.map((img, index) => ({
    id: img.id || index,
    title: img.title || (language === "en" ? "Gallery Image" : "গ্যালারি ছবি"),
    category: "gallery",
    src: img.url,
  }));

  const categories = [
    { id: "all", label: language === "en" ? "All" : "সব" },
    { id: "gallery", label: language === "en" ? "Gallery" : "গ্যালারি" },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredImages = activeCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <>
      <Head>
        <title>Photo Gallery - Medical Center</title>
        <meta name="description" content="Photo Gallery of Medical Center Chattagram" />
      </Head>

      <Navbar />

      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section with Message */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {language === "en" ? "Photo Gallery" : "ফটো গ্যালারি"}
            </h1>
            <p className="text-white/90 text-lg">
              {language === "en"
                ? "Explore Our State-of-the-Art Facilities"
                : "আমাদের আধুনিক সুবিধা এক্সপ্লোর করুন"}
            </p>
            <div className="mt-6 bg-white/10 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-white text-sm">
                {language === "en"
                  ? "Welcome to Medical Centre Chattagram's photo gallery. Browse through our collection of images showcasing our facilities, equipment, and patient care services."
                  : "মেডিকেল সেন্টার চট্টগ্রামের ফটো গ্যালারিতে আপনাকে স্বাগতম। আমাদের সুবিধা, সরঞ্জাম এবং রোগীর যত্ন পরিষেবা প্রদর্শন করা ছবির সংগ্রহ ব্রাউজ করুন।"}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{language === "en" ? "Loading..." : "লোড হচ্ছে..."}</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">
                {language === "en"
                  ? "No images yet. Please check back later!"
                  : "এখনও কোনো ছবি নেই। পরে আবার চেক করুন!"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {language === "en"
                  ? "Admin can upload photos from the admin panel"
                  : "অ্যাডমিন প্যানেল থেকে ছবি আপলোড করতে পারেন"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-white"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold text-sm">{image.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredImages.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {language === "en"
                  ? "No images found in this category"
                  : "এই বিভাগে কোনো ছবি পাওয়া যায়নি"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <p className="text-white text-center mt-4 text-lg font-semibold">
              {selectedImage.title}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

