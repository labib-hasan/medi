import { useEffect, useState } from "react";

export default function MdImageUpload({ isAdmin = false }) {
  const [mdImage, setMdImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/get-md-image")
      .then((res) => res.json())
      .then((data) => {
        if (data.image) setMdImage(data.image);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/upload-md-image", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (uploadData.url) {
      setMdImage(uploadData.url);
    }
  };

  if (!isAdmin) {
    // If not admin, don't show the upload button
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">MD Photo</h3>
      
      <div className="flex flex-col items-center">
        <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
          {loading ? (
            <div className="animate-pulse bg-gray-200 w-full h-full"></div>
          ) : mdImage ? (
            <img
              src={mdImage}
              alt="MD Photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          )}
        </div>
        
        <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition">
          Upload MD Photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
          />
        </label>
        
        <p className="text-xs text-gray-500 mt-2">
          Recommended: Square image, JPG or PNG format
        </p>
      </div>
    </div>
  );
}
