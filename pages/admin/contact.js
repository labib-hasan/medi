import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  GlobeAltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

export default function AdminContact() {
  const { language } = useLanguage();
  const t = translations[language];
  const [contact, setContact] = useState({
    phone: "",
    emergencyPhone: "",
    hotline: "",
    email: "",
    address: "",
    addressBn: "",
    lat: "22.333341",
    lng: "91.831056",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/get-contact")
      .then((res) => res.json())
      .then((data) => {
        setContact({
          phone: data.phone || "",
          emergencyPhone: data.emergencyPhone || "",
          hotline: data.hotline || "",
          email: data.email || "",
          address: data.address || "",
          addressBn: data.addressBn || "",
          lat: data.lat || "22.333341",
          lng: data.lng || "91.831056",
        });
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await fetch("/api/save-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      const data = await res.json();

      if (data.success) {
        alert("Contact info saved successfully!");
      } else {
        alert("Save failed: " + data.message);
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
            <h1 className="text-3xl font-bold tracking-tight">Contact Information</h1>
            <p className="text-blue-200 mt-1 text-sm">Manage hospital contact details and location</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="mt-4 md:mt-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <PhoneIcon className="w-6 h-6 text-blue-600" />
            Communication Channels
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">General Phone</label>
              <div className="relative">
                <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition"
                  placeholder="+880..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Phone</label>
              <div className="relative">
                <DevicePhoneMobileIcon className="w-5 h-5 text-red-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={contact.emergencyPhone}
                  onChange={(e) => setContact({ ...contact, emergencyPhone: e.target.value })}
                  className="w-full text-black pl-12 pr-4 py-3 border border-red-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50/30 transition"
                  placeholder="+880..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hotline</label>
              <div className="relative">
                <PhoneIcon className="w-5 h-5 text-orange-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={contact.hotline}
                  onChange={(e) => setContact({ ...contact, hotline: e.target.value })}
                  className="text-black w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="106..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="text-black w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="info@hospital.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MapPinIcon className="w-6 h-6 text-blue-600" />
            Location Details
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address (English)</label>
              <textarea
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                rows={3}
                className="text-black w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                placeholder="Full address in English"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address (Bengali)</label>
              <textarea
                value={contact.addressBn}
                onChange={(e) => setContact({ ...contact, addressBn: e.target.value })}
                rows={3}
                className="text-black w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                placeholder="বাংলায় পূর্ণ ঠিকানা"
              />
            </div>

            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                <div className="relative">
                  <GlobeAltIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={contact.lat}
                    onChange={(e) => setContact({ ...contact, lat: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                <div className="relative">
                  <GlobeAltIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={contact.lng}
                    onChange={(e) => setContact({ ...contact, lng: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Preview Link */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          target="_blank"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
        >
          View Contact Page Live
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </AdminLayout>
  );
}
