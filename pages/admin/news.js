import { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon, 
  NewspaperIcon,
  PhotoIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

export default function AdminNews() {
  const { language } = useLanguage();
  const t = translations[language];
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const fileInputRef = useRef(null);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload-news-image", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();

      if (data.success) {
        setFormData({ ...formData, image: data.imageUrl });
      }
    } catch (error) {
      alert("Image upload failed!");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/save-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          title: formData.title,
          content: formData.content,
          image: formData.image,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFormData({ title: "", content: "", image: "" });
        setShowForm(false);
        setEditingId(null);
        fetchNews();
      } else {
        alert(data.error || "Failed to save news!");
      }
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Failed to save news!");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      content: item.content,
      image: item.image || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this news?")) return;

    try {
      const res = await fetch("/api/delete-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        fetchNews();
      }
    } catch (error) {
      alert("Delete failed!");
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", content: "", image: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      {/* PREMIUM HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-6 mb-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">News Management</h1>
            <p className="text-blue-200 mt-1 text-sm">Publish latest updates and announcements</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5" />
            Add News
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 flex flex-col md:flex-row gap-6 border border-gray-100">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full md:w-48 h-48 md:h-32 object-cover rounded-xl flex-shrink-0"
                />
              ) : (
                <div className="w-full md:w-48 h-48 md:h-32 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <NewspaperIcon className="w-10 h-10 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg whitespace-nowrap ml-2">
                    {item.createdAt && new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                  {item.content}
                </p>
                
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition flex items-center gap-1"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition flex items-center gap-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {news.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <NewspaperIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No news articles yet</p>
              <p className="text-gray-400 text-sm mt-1">Share your first update with the world</p>
            </div>
          )}
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-t-3xl p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {editingId ? 'Edit News Article' : 'Create News Article'}
                </h3>
                <button onClick={handleCancel} className="p-2 hover:bg-white/20 rounded-xl transition">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Headline</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-black w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter news headline"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="text-black w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[150px]"
                  placeholder="Write the news content here..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image</label>
                
                <div className="flex items-start gap-6">
                  {formData.image ? (
                    <div className="relative group">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-32 h-32 rounded-xl object-cover border border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        ) : (
                          <>
                            <CloudArrowUpIcon className="w-8 h-8 text-blue-500 mb-2" />
                            <p className="text-sm text-gray-500 font-semibold">Click to upload image</p>
                            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingId ? 'Update News' : 'Publish News')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
