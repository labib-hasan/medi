import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import { 
  UserCircleIcon, 
  ChatBubbleBottomCenterTextIcon, 
  PhotoIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

export default function AdminMdMessage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [mdImage, setMdImage] = useState(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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
      })
      .catch(() => {});
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-md-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setMdImage(data.url);
      }
    } catch (error) {
      alert("Upload failed!");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveMessage = async () => {
    setSaving(true);

    try {
      const res = await fetch("/api/save-md-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, position, title, message }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Message saved successfully!");
      }
    } catch (error) {
      alert("Save failed!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      {/* PREMIUM HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-6 mb-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MD Message</h1>
            <p className="text-blue-200 mt-1 text-sm">Update Managing Director's profile and message</p>
          </div>
          <button 
            onClick={handleSaveMessage}
            disabled={saving}
            className="mt-4 md:mt-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Photo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
              <PhotoIcon className="w-6 h-6 text-blue-600" />
              Profile Photo
            </h2>

            <div className="relative group mx-auto w-48 h-48 mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 border-4 border-blue-50 shadow-inner flex items-center justify-center">
                {mdImage ? (
                  <img
                    src={mdImage}
                    alt="MD"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-24 h-24 text-gray-300" />
                )}
              </div>
              
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <label className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl font-semibold cursor-pointer hover:bg-blue-100 transition">
              <CloudArrowUpIcon className="w-5 h-5" />
              {uploading ? "Uploading..." : "Upload New Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            
            <p className="text-xs text-gray-400 mt-3">
              Recommended: Square image (500x500px)
            </p>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-blue-600" />
              Message Details
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-black w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="e.g. Dr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="text-black w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="e.g. Managing Director"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Page Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-black w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="e.g. Message from Managing Director"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={12}
                  className="text-black w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  placeholder="Write the full message here..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Link */}
      <div className="mt-8 text-center">
        <a
          href="/our-clinic/md-message"
          target="_blank"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
        >
          View Live Page
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </AdminLayout>
  );
}
