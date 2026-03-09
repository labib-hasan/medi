import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from "../../components/AdminLayout";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon, 
  BuildingOfficeIcon,
  HeartIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

// Hardcoded departments that have pages
const defaultDepartments = [
  { id: "medicine", name: "Medicine", name_bn: "মেডিসিন", description: "Comprehensive Internal Medicine Healthcare Services", description_bn: "ব্যাপক অভ্যন্তরীণ চিকিৎসা স্বাস্থ্যসেবা", image: "", head_doctor: "" },
  { id: "cardiology", name: "Cardiology", name_bn: "কার্ডিওলজি", description: "Comprehensive Heart Care Services", description_bn: "ব্যাপক হৃদরোগ চিকিৎসা সেবা", image: "", head_doctor: "" },
  { id: "neuro-medicine", name: "Neuro Medicine", name_bn: "নিউরো মেডিসিন", description: "Advanced Neurological Care", description_bn: "উন্নত নিউরোলজিক্যাল যত্ন", image: "", head_doctor: "" },
  { id: "gastroenterology", name: "Gastroenterology", name_bn: "গ্যাস্ট্রোএন্টারোলজি", description: "Advanced Digestive & Liver Care", description_bn: "উন্নত হজম ও লিভার যত্ন", image: "", head_doctor: "" },
  { id: "ent", name: "ENT", name_bn: "ENT", description: "Ear, Nose, Throat & Head-Neck Surgery", description_bn: "কান, নাক, গলা ও মাথা-গলা সার্জারি", image: "", head_doctor: "" },
  { id: "gynee-obs", name: "Gynecology & Obstetrics", name_bn: "গাইনি ও প্রসূতি", description: "Complete Women's Healthcare", description_bn: "সম্পূর্ণ মহিলা স্বাস্থ্যসেবা", image: "", head_doctor: "" },
  { id: "nephrology", name: "Nephrology", name_bn: "নেফ্রোলজি", description: "Comprehensive Kidney Care", description_bn: "ব্যাপক কিডনি যত্ন", image: "", head_doctor: "" },
  { id: "orthopedics", name: "Orthopedics", name_bn: "অর্থোপেডিক্স", description: "Bone, Joint & Trauma Care", description_bn: "হাড়, জয়েন্ট ও ট্রমা যত্ন", image: "", head_doctor: "" },
  { id: "oncology", name: "Oncology", name_bn: "অনকোলজি", description: "Comprehensive Cancer Care", description_bn: "ব্যাপক ক্যান্সার যত্ন", image: "", head_doctor: "" },
  { id: "psychiatry", name: "Psychiatry", name_bn: "সাইকিয়াট্রি", description: "Mental Health & Behavioral Sciences", description_bn: "মানসিক স্বাস্থ্য ও আচরণবিজ্ঞান", image: "", head_doctor: "" },
  { id: "pediatrics", name: "Pediatrics", name_bn: "পেডিয়াট্রিক্স", description: "Comprehensive Child Healthcare", description_bn: "ব্যাপক শিশু স্বাস্থ্যসেবা", image: "", head_doctor: "" },
  { id: "physical-medicine", name: "Physical Medicine", name_bn: "ফিজিক্যাল মেডিসিন", description: "Rehabilitation & Pain Management", description_bn: "পুনর্বাসন ও ব্যথা ব্যবস্থাপনা", image: "", head_doctor: "" },
  { id: "skin-vd", name: "Skin & VD", name_bn: "স্কিন ও VD", description: "Dermatology & Venereology Care", description_bn: "ডার্মাটোলজি ও ভেনেরিওলজি যত্ন", image: "", head_doctor: "" },
  { id: "surgery", name: "Surgery", name_bn: "সার্জারি", description: "Comprehensive Surgical Services", description_bn: "ব্যাপক শল্য চিকিৎসা সেবা", image: "", head_doctor: "" },
  { id: "urology", name: "Urology", name_bn: "ইউরোলজি", description: "Comprehensive Urological Care", description_bn: "ব্যাপক ইউরোলজিক্যাল যত্ন", image: "", head_doctor: "" }
];

// Hardcoded specialities
const defaultSpecialities = [
  { id: 'ot', name: 'OT', name_bn: 'ওটি', description: 'Operation Theatre for surgeries', description_bn: 'সার্জারির জন্য অপারেশন থিয়েটার', image: '' },
  { id: 'icu', name: 'ICU', name_bn: 'আইসিইউ', description: 'Intensive Care Unit for critically ill patients', description_bn: 'গুরুতর অসুস্থ রোগীদের জন্য নিবিড় পরিচর্যা কেন্দ্র', image: '' },
  { id: 'ccu', name: 'CCU', name_bn: 'সিসিইউ', description: 'Coronary Care Unit for heart patients', description_bn: 'হৃদরোগীদের জন্য কোরোনারি কেয়ার ইউনিট', image: '' },
  { id: 'nicu', name: 'NICU', name_bn: 'নিসিইউ', description: 'Neonatal Intensive Care Unit for newborns', description_bn: 'নবজাতকদের জন্য নিওনেটাল ইন্টেন্সিভ কেয়ার ইউনিট', image: '' },
  { id: 'hdu', name: 'HDU', name_bn: 'এইচডিইউ', description: 'High Dependency Unit for serious but stable patients', description_bn: 'গুরুতর কিন্তু স্থিতিশীল রোগীদের জন্য হাই ডিপেন্ডেন্সি ইউনিট', image: '' },
  { id: 'ed', name: 'ED', name_bn: 'ইডি', description: 'Emergency Department for urgent care', description_bn: 'জরুরি চিকিৎসার জন্য জরুরি বিভাগ', image: '' },
  { id: 'dialysis', name: 'Dialysis', name_bn: 'ডায়ালাইসিস', description: 'Kidney dialysis services', description_bn: 'কিডনি ডায়ালাইসিস সেবা', image: '' },
  { id: 'gynae', name: 'Gynecology', name_bn: 'গাইনোকোলজি', description: "Women's health and maternity care", description_bn: 'মহিলাদের স্বাস্থ্য এবং মাতৃত্ব যত্ন', image: '' },
  { id: 'paedi', name: 'Pediatrics', name_bn: 'শিশু বিভাগ', description: 'Child healthcare services', description_bn: 'শিশু স্বাস্থ্যসেবা', image: '' },
  { id: 'sdu', name: 'SDU', name_bn: 'এসডিইউ', description: 'Special Care Unit for specific medical needs', description_bn: 'নির্দিষ্ট চিকিৎসা প্রয়োজনের জন্য স্পেশাল কেয়ার ইউনিট', image: '' },
];

// Hardcoded diagnostics
const defaultDiagnostics = [
  { id: 'radiology', name: 'Radiology', name_bn: 'রেডিওলজি', description: 'X-Ray, CT Scan, MRI, Ultrasound imaging services', description_bn: 'এক্স-রে, সিটি স্ক্যান, এমআরআই, আল্ট্রাসাউন্ড ইমেজিং সেবা', image: '' },
  { id: 'pathology', name: 'Pathology', name_bn: 'প্যাথলজি', description: 'Laboratory tests and diagnostic services', description_bn: 'ল্যাবরেটরি পরীক্ষা এবং ডায়াগনস্টিক সেবা', image: '' },
];

// Storage key for cover images
const COVER_IMAGES_KEY = 'hospital_cover_images';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState(defaultDepartments);
  const [specialities, setSpecialities] = useState(defaultSpecialities);
  const [diagnostics, setDiagnostics] = useState(defaultDiagnostics);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('departments');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [coverImages, setCoverImages] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    description: '',
    description_bn: '',
    image: '',
    icon: ''
  });
  const router = useRouter();

  // Load cover images from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COVER_IMAGES_KEY);
      if (saved) {
        try {
          setCoverImages(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing cover images:', e);
        }
      }
    }
  }, []);

  // Save cover images to localStorage
  const saveCoverImage = (type, id, imageUrl) => {
    const key = `${type}_${id}`;
    const newCoverImages = { ...coverImages, [key]: imageUrl };
    setCoverImages(newCoverImages);
   try {
  localStorage.setItem(COVER_IMAGES_KEY, JSON.stringify(newCoverImages));
} catch (e) {
  console.warn("LocalStorage quota exceeded. Clearing old cover images.");
  localStorage.removeItem(COVER_IMAGES_KEY);
  localStorage.setItem(COVER_IMAGES_KEY, JSON.stringify({ [key]: imageUrl }));
}
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Convert to base64 and save to localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData({ ...formData, image: base64 });
        setUploadingImage(false);
      };
      reader.onerror = () => {
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'departments') {
      const newDept = {
        id: editingItem ? editingItem.id : formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        name_bn: formData.name_bn,
        description: formData.description,
        description_bn: formData.description_bn,
        image: formData.image,
        head_doctor: formData.icon
      };
      
      if (editingItem) {
        setDepartments(departments.map(d => d.id === editingItem.id ? newDept : d));
      } else {
        setDepartments([...departments, newDept]);
      }
      
      // Save cover image
      if (formData.image) {
        saveCoverImage('dept', newDept.id, formData.image);
      }
    } else if (activeTab === 'specialities') {
      const newSpec = {
        id: editingItem ? editingItem.id : formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        name_bn: formData.name_bn,
        description: formData.description,
        description_bn: formData.description_bn,
        image: formData.image
      };
      
      if (editingItem) {
        setSpecialities(specialities.map(s => s.id === editingItem.id ? newSpec : s));
      } else {
        setSpecialities([...specialities, newSpec]);
      }
      
      // Save cover image
      if (formData.image) {
        saveCoverImage('spec', newSpec.id, formData.image);
      }
    } else {
      const newDiag = {
        id: editingItem ? editingItem.id : formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        name_bn: formData.name_bn,
        description: formData.description,
        description_bn: formData.description_bn,
        image: formData.image
      };
      
      if (editingItem) {
        setDiagnostics(diagnostics.map(d => d.id === editingItem.id ? newDiag : d));
      } else {
        setDiagnostics([...diagnostics, newDiag]);
      }
      
      // Save cover image
      if (formData.image) {
        saveCoverImage('diag', newDiag.id, formData.image);
      }
    }
    
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      name_bn: item.name_bn || '',
      description: item.description || '',
      description_bn: item.description_bn || '',
      image: item.image || '',
      icon: item.head_doctor || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    if (activeTab === 'departments') {
      setDepartments(departments.filter(d => d.id !== id));
    } else if (activeTab === 'specialities') {
      setSpecialities(specialities.filter(s => s.id !== id));
    } else {
      setDiagnostics(diagnostics.filter(d => d.id !== id));
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      name: '',
      name_bn: '',
      description: '',
      description_bn: '',
      image: '',
      icon: ''
    });
  };

  const getCurrentItems = () => {
    if (activeTab === 'departments') return departments;
    if (activeTab === 'specialities') return specialities;
    return diagnostics;
  };

  // Get cover image for display
  const getItemImage = (item) => {
    const type = activeTab === 'departments' ? 'dept' : activeTab === 'specialities' ? 'spec' : 'diag';
    const key = `${type}_${item.id}`;
    return coverImages[key] || item.image || null;
  };

  return (
    <AdminLayout>
      {/* PREMIUM HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-6 mb-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Departments</h1>
            <p className="text-blue-200 mt-1 text-sm">Organize hospital departments, specialities & diagnostic services</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5" />
            Add {activeTab === 'departments' ? 'Department' : activeTab === 'specialities' ? 'Speciality' : 'Service'}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'departments' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BuildingOfficeIcon className="w-5 h-5" />
          Departments
        </button>
        <button
          onClick={() => setActiveTab('specialities')}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'specialities' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <HeartIcon className="w-5 h-5" />
          Specialities
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'diagnostics' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BeakerIcon className="w-5 h-5" />
          Diagnostic Services
        </button>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getCurrentItems().map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col">
            <div className="h-32 bg-gradient-to-br from-blue-50 to-cyan-50 relative">
              {getItemImage(item) ? (
                <img src={getItemImage(item)} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {activeTab === 'departments' && <BuildingOfficeIcon className="w-12 h-12 text-blue-200" />}
                  {activeTab === 'specialities' && <HeartIcon className="w-12 h-12 text-red-200" />}
                  {activeTab === 'diagnostics' && <BeakerIcon className="w-12 h-12 text-purple-200" />}
                </div>
              )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                {item.description || "No description provided."}
              </p>
              
              <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition flex items-center justify-center gap-1"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-t-3xl p-6 text-white sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {editingItem ? 'Edit' : 'Add New'} {activeTab === 'departments' ? 'Department' : activeTab === 'specialities' ? 'Speciality' : 'Diagnostic Service'}
                </h3>
                <button onClick={resetForm} className="p-2 hover:bg-white/20 rounded-xl transition">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="e.g. Cardiology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name (Bangla)</label>
                  <input
                    type="text"
                    value={formData.name_bn}
                    onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="e.g. কার্ডিওলজি"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description (English)</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    placeholder="Brief description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Bangla)</label>
                  <textarea
                    rows={3}
                    value={formData.description_bn}
                    onChange={(e) => setFormData({...formData, description_bn: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    placeholder="বিবরণ..."
                  />
                </div>
              </div>

              {/* Cover Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 mb-3">
                  {formData.image ? (
                    <div className="relative">
                      <img src={formData.image} alt="Cover" className="w-full h-48 object-cover rounded-lg mx-auto" />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, image: ''})}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="cover-upload"
                          />
                          <label htmlFor="cover-upload" className="cursor-pointer block">
                            <BuildingOfficeIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm text-center">Click to upload cover photo</p>
                          </label>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {/* Alternative: Image URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Or paste image URL here..."
                  />
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, image: ''})}
                      className="px-3 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {activeTab === 'departments' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Head Doctor</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Dr. Name"
                  />
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

