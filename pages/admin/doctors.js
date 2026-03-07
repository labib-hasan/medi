import { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/AdminLayout";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon, 
  PhotoIcon,
  UserCircleIcon,
  PhoneIcon,
  BriefcaseIcon,
  ClockIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  AcademicCapIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DEPARTMENTS = [
  "Medicine",
  "Neuro Medicine", 
  "Cardiology",
  "Gastroenterology",
  "ENT",
  "Gynee & Obs.",
  "Nephrology",
  "Orthopedics",
  "Oncology",
  "Psychiatry",
  "Pediatrics",
  "Physical Medicine",
  "Skin & VD",
  "Surgery",
  "Urology",
  // Specialty Units
  "CCU - Critical Care Unit",
  "HDU - High Dependency Unit",
  "SDU - Step Down Unit",
  "NICU - Neonatal ICU",
  "ICU - Intensive Care Unit",
  "GYNAE - Gynecology",
  "PAEDI - Pediatric",
  "OT - Operation Theatre",
  "ED - Emergency Department",
  "Dialysis - Kidney Care",
  "Radiology",
  "Pathology"
];

const emptyForm = {
  name: "",
  specialization: "",
  degrees: "",
  designation: "",
  department: "",
  institute: "",
  room_no: "",
  serial_note: "",
  visiting_time: "",
  visiting_days: [],
  phone: "",
  email: "",
  experience_years: "",
  description: "",
  image: "",
};

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`);
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setPreview(null);
    setEditingDoctor(null);
    setShowForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await fetch("/api/upload-doctor", {
        method: "POST",
        body: formDataUpload,
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        throw new Error("Upload failed");
      }

      if (!res.ok) {
        throw new Error(data.error || "Upload error");
      }

      if (data.url) {
        setFormData({ ...formData, image: data.url });
        setPreview(data.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
      const localPreview = URL.createObjectURL(file);
      setFormData({ ...formData, image: localPreview });
      setPreview(localPreview);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingDoctor
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/${editingDoctor.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/doctors`;

    const method = editingDoctor ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok) {
        fetchDoctors();
        resetForm();
        // alert(editingDoctor ? "Doctor updated successfully!" : "Doctor added successfully!");
      } else {
        console.error("Server error:", data);
        alert("Error: " + (data.message || data.error || "Failed to save doctor."));
      }
    } catch (error) {
      console.error("Error saving doctor:", error);
      alert("Error saving doctor. Please check connection.");
    }
  };

  const handleEdit = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      ...doc,
      visiting_days: doc.visiting_days ? (typeof doc.visiting_days === 'string' ? JSON.parse(doc.visiting_days) : doc.visiting_days) : []
    });
    setPreview(doc.image);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors/${id}`, { method: "DELETE" });
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !filterDept || doc.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <AdminLayout>
      {/* PREMIUM HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-6 mb-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Doctors</h1>
            <p className="text-blue-200 mt-1 text-sm">Add, edit, and manage doctor profiles and departments</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Doctor
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Doctors</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{doctors.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <UserCircleIcon className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Departments</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{new Set(doctors.map(d => d.department)).size}</p>
          </div>
          <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600">
            <BuildingOfficeIcon className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Active Today</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{Math.max(0, doctors.length - 2)}</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <ClockIcon className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">New This Month</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">+{Math.min(doctors.length, 5)}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <BriefcaseIcon className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search doctors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
            />
          </div>
          <div className="relative min-w-[250px]">
            <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 appearance-none transition-all"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="absolute right-4 top-4 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* DOCTORS GRID */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <UserCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No doctors found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col">
              {/* Card Header / Image */}
              <div className="relative h-24 bg-gradient-to-r from-blue-600 to-cyan-600">
                <div className="absolute -bottom-12 left-6">
                  <div className="relative">
                    {doc.image ? (
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                        onError={(e) => { e.target.src = ''; }}
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center">
                        <UserCircleIcon className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                    {doc.department?.split(' - ')[0]}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-14 px-6 pb-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={doc.name}>{doc.name}</h3>
                  <p className="text-blue-600 text-sm font-medium line-clamp-1">{doc.specialization}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">{doc.designation}</p>
                </div>

                <div className="space-y-2.5 mb-6 flex-1">
                  {doc.room_no && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Room: {doc.room_no}</span>
                    </div>
                  )}
                  {doc.visiting_time && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{doc.visiting_time}</span>
                    </div>
                  )}
                  {doc.experience_years && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AcademicCapIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{doc.experience_years} years exp.</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition flex items-center justify-center"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-t-3xl p-6 text-white z-10 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">
                  {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
                </h3>
                <p className="text-blue-200 text-sm mt-1">
                  {editingDoctor ? 'Update doctor information below' : 'Fill in the doctor details'}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-white/20 rounded-xl transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              {/* Image Upload Section */}
              <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
                <div className="relative group">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Doctor preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                      onError={(e) => { e.target.src = ''; setPreview(null); }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-50 border-4 border-dashed border-gray-300 flex items-center justify-center">
                      <PhotoIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition">
                    <CloudArrowUpIcon className="w-5 h-5" />
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">Recommended: Square image, max 10MB</p>
              </div>

              {/* Personal Info */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <UserCircleIcon className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Doctor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Dr. John Doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specialization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      placeholder="e.g. Cardiologist"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Degrees
                    </label>
                    <input
                      type="text"
                      value={formData.degrees}
                      onChange={(e) => setFormData({...formData, degrees: e.target.value})}
                      placeholder="e.g. MBBS, FCPS, MD"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({...formData, designation: e.target.value})}
                      placeholder="e.g. Senior Consultant"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                  Professional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Institute / Hospital
                    </label>
                    <input
                      type="text"
                      value={formData.institute}
                      onChange={(e) => setFormData({...formData, institute: e.target.value})}
                      placeholder="e.g. Medical Center Hospital"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room No.
                    </label>
                    <input
                      type="text"
                      value={formData.room_no}
                      onChange={(e) => setFormData({...formData, room_no: e.target.value})}
                      placeholder="e.g. 302"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                      placeholder="e.g. 10"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                  Visiting Schedule
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Visiting Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Visiting Time (Start)
                    </label>
                    <input
                      type="time"
                      value={formData.visiting_time ? formData.visiting_time.split(' - ')[0]?.trim() : ''}
                      onChange={(e) => {
                        const startTime = e.target.value;
                        const endTime = formData.visiting_time?.split(' - ')[1]?.trim() || '17:00';
                        setFormData({...formData, visiting_time: `${startTime} - ${endTime}`});
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Visiting Time (End)
                    </label>
                    <input
                      type="time"
                      value={formData.visiting_time ? formData.visiting_time.split(' - ')[1]?.trim() : ''}
                      onChange={(e) => {
                        const endTime = e.target.value;
                        const startTime = formData.visiting_time?.split(' - ')[0]?.trim() || '09:00';
                        setFormData({...formData, visiting_time: `${startTime} - ${endTime}`});
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  
                  {/* Serial Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Serial Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.serial_note?.includes('-') ? formData.serial_note.split('-')[0]?.trim() : ''}
                      onChange={(e) => {
                        const startTime = e.target.value;
                        const endTime = formData.serial_note?.includes('-') ? formData.serial_note.split('-')[1]?.trim() || '10:00' : '10:00';
                        setFormData({...formData, serial_note: `${startTime} - ${endTime}`});
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Serial End Time
                    </label>
                    <input
                      type="time"
                      value={formData.serial_note?.includes('-') ? formData.serial_note.split('-')[1]?.trim() : ''}
                      onChange={(e) => {
                        const endTime = e.target.value;
                        const startTime = formData.serial_note?.includes('-') ? formData.serial_note.split('-')[0]?.trim() || '10:00' : '10:00';
                        setFormData({...formData, serial_note: `${startTime} - ${endTime}`});
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Visiting Days
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {DAYS.map(day => (
                        <label
                          key={day}
                          className={`px-4 py-2 rounded-xl cursor-pointer transition-all border ${
                            formData.visiting_days.includes(day)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={formData.visiting_days.includes(day)}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                visiting_days: formData.visiting_days.includes(day)
                                  ? formData.visiting_days.filter(d => d !== day)
                                  : [...formData.visiting_days, day],
                              })
                            }
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+880 123 4567890"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="doctor@hospital.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description / Bio
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description about the doctor..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg"
                >
                  {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
