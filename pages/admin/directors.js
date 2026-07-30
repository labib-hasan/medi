import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  ChatBubbleBottomCenterTextIcon,
  ChevronDownIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const directorProfiles = {
  "director-1": {
    label: "Director 1",
    name: "Director 1",
    position: "Director",
    title: "Message from Director 1",
  },
  "director-2": {
    label: "Director 2",
    name: "Director 2",
    position: "Director",
    title: "Message from Director 2",
  },
};

export default function AdminDirectors() {
  const [directorSlug, setDirectorSlug] = useState("director-1");
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const applyProfile = (profile = null) => {
      const fallback = directorProfiles[directorSlug];
      setImage(profile?.image_url || null);
      setName(profile?.name || fallback.name);
      setPosition(profile?.position || fallback.position);
      setTitle(profile?.title || fallback.title);
      setMessage(profile?.message || "");
    };

    const loadDirector = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/directors/${directorSlug}`);
        const data = await response.json();
        applyProfile(data.success ? data.director : null);
      } catch {
        applyProfile();
      } finally {
        setLoading(false);
      }
    };

    loadDirector();
  }, [directorSlug]);

  const handleDirectorChange = (event) => {
    setDirectorSlug(event.target.value);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/directors/${directorSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, position, title, message }),
      });
      const data = await response.json();

      if (!data.success) throw new Error(data.message);
      alert("Director profile saved successfully!");
    } catch {
      alert("Unable to save the director profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", directorSlug);

    try {
      const response = await fetch("/api/upload-director-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!data.success) throw new Error(data.error);
      setImage(data.url);
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const publicPage = `/directors/${directorSlug}`;

  return (
    <AdminLayout>
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Directors</h1>
            <p className="mt-1 text-sm text-blue-200">Update Director 1 and Director 2 profiles, messages, and photos</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:from-green-600 hover:to-emerald-600 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mb-8 max-w-md">
        <label htmlFor="director-profile" className="mb-2 block text-sm font-semibold text-gray-700">Choose director</label>
        <div className="relative">
          <select
            id="director-profile"
            value={directorSlug}
            onChange={handleDirectorChange}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(directorProfiles).map(([slug, profile]) => (
              <option key={slug} value={slug}>{profile.label}</option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg">
          <h2 className="mb-6 flex items-center justify-center gap-2 text-xl font-bold text-gray-800">
            <PhotoIcon className="h-6 w-6 text-blue-600" />
            Profile Photo
          </h2>
          <div className="relative mx-auto mb-6 h-48 w-48">
            <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-4 border-blue-50 bg-gray-100 shadow-inner">
              {image ? <img src={image} alt={name || directorProfiles[directorSlug].label} className="h-full w-full object-cover" /> : <UserCircleIcon className="h-24 w-24 text-gray-300" />}
            </div>
            {uploading && <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white" /></div>}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-50 px-6 py-2.5 font-semibold text-blue-600 transition hover:bg-blue-100">
            <CloudArrowUpIcon className="h-5 w-5" />
            {uploading ? "Uploading..." : "Upload New Photo"}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading || loading} className="hidden" />
          </label>
          <p className="mt-3 text-xs text-gray-400">Recommended: Square image (500x500px)</p>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg lg:col-span-2">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800">
            <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-blue-600" />
            Message Details
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Name</label>
                <input value={name} onChange={(event) => setName(event.target.value)} disabled={loading} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="e.g. Director Name" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Position</label>
                <input value={position} onChange={(event) => setPosition(event.target.value)} disabled={loading} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="e.g. Director" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Page Title</label>
              <input value={title} onChange={(event) => setTitle(event.target.value)} disabled={loading} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="e.g. Message from Director" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Message Content</label>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} disabled={loading} rows={12} className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="Write the full message here..." />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 text-center">
        <a href={publicPage} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800">
          View {directorProfiles[directorSlug].label} Live Page
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>
    </AdminLayout>
  );
}
