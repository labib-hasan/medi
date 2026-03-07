import { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";

export default function AdminGallery() {
  const { language } = useLanguage();
  const t = translations[language];
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/get-gallery-images");
      const data = await res.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError(language === "en" ? "Failed to load images" : "ছবি লোড করতে ব্যর্থ");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError(language === "en" ? "Only image files are allowed" : "শুধুমাত্র ছবি ফাইল অনুমোদিত");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(language === "en" ? "File size must be less than 10MB" : "ফাইলের আকার ১০ এমবি এর কম হতে হবে");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-gallery-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Refresh images from server
        await fetchImages();
        setSuccess(language === "en" ? "Image uploaded successfully!" : "ছবি সফলভাবে আপলোড হয়েছে!");
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(data.error || (language === "en" ? "Upload failed!" : "আপলোড ব্যর্থ!"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(language === "en" ? "Upload failed! Please try again." : "আপলোড ব্যর্থ! আবার চেষ্টা করুন।");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDelete = async (id, publicId) => {
    if (!confirm(language === "en" ? "Delete this image?" : "এই ছবি মুছবেন?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/delete-gallery-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, publicId }),
      });

      const data = await res.json();

      if (data.success) {
        setImages(images.filter(img => img.id !== id));
        setSuccess(language === "en" ? "Image deleted!" : "ছবি মুছে ফেলা হয়েছে!");
      } else {
        setError(language === "en" ? "Delete failed!" : "মুছতে ব্যর্থ!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError(language === "en" ? "Delete failed!" : "মুছতে ব্যর্থ!");
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {language === "en" ? "Photo Gallery Management" : "ফটো গ্যালারি পরিচালনা"}
            </h1>
            
            <button
              onClick={openFilePicker}
              disabled={uploading}
              className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                uploading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {language === "en" ? "Uploading..." : "আপলোড হচ্ছে..."}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {language === "en" ? "Upload Photo" : "ছবি আপলোড করুন"}
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 mb-8 text-center transition ${
              dragActive 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-gray-600">
              {language === "en" 
                ? "Drag and drop an image here, or click the Upload button above" 
                : "এখানে একটি ছবি টেনে আনুন, বা উপরের আপলোড বাটনে ক্লিক করুন"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {language === "en" ? "Supports: JPG, PNG, GIF (Max 10MB)" : "সমর্থন: JPG, PNG, GIF (সর্বোচ্চ ১০ এমবি)"}
            </p>
          </div>

          {/* Images Grid */}
          {loading ? (
            <div className="text-center py-20">
              <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="mt-4 text-gray-500">{language === "en" ? "Loading..." : "লোড হচ্ছে..."}</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-gray-500 text-lg">
                {language === "en" ? "No images yet" : "কোনো ছবি নেই"}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {language === "en" ? "Upload your first photo to get started" : "শুরু করতে আপনার প্রথম ছবি আপলোড করুন"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.title || "Gallery Image"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/file.svg";
                      }}
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                    <button
                      onClick={() => window.open(img.url, '_blank')}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      {language === "en" ? "View" : "দেখুন"}
                    </button>
                    <button
                      onClick={() => handleDelete(img.id, img.publicId)}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                    >
                      {language === "en" ? "Delete" : "মুছুন"}
                    </button>
                  </div>
                  
                  {/* Image info at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-xs truncate">
                      {img.title || (language === "en" ? "Gallery Image" : "গ্যালারি ছবি")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View Gallery Link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href="/our-clinic/photo-gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {language === "en" ? "View Photo Gallery Page" : "ফটো গ্যালারি পেজ দেখুন"}
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

