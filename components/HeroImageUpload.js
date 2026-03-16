import { useEffect, useState, useRef } from "react";
import HeroButtons from "../components/HeroButtons";

const TOTAL_SLOTS = 4;

export default function HeroImageUpload({ isAdmin = false }) {
  const [images, setImages] = useState(Array(TOTAL_SLOTS).fill(null));
  const [imageErrors, setImageErrors] = useState(Array(TOTAL_SLOTS).fill(false));
  const sliderRef = useRef(null);

  // Fetch hero images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/get-hero");
        const data = await res.json();
        if (data?.images) {
          setImages(data.images);
          // Reset error states when new images are loaded
          setImageErrors(Array(TOTAL_SLOTS).fill(false));
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      }
    };

    fetchImages();
  }, []);

  // Auto slider (disabled in admin panel)
  useEffect(() => {
    if (isAdmin) return; // ❌ disable auto scroll for admin

    const interval = setInterval(() => {
      if (!sliderRef.current) return;

      const slider = sliderRef.current;
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft >= maxScrollLeft) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: slider.clientWidth, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  // Handle image load error
  const handleImageError = (index) => {
    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  // Upload image
  const handleUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 10MB for HD images)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload to Cloudinary with HD transformation
      const uploadRes = await fetch("/api/upload-hero", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData?.url) return;

      // Transform URL for HD quality
      // This adds Cloudinary parameters for better quality
      const hdUrl = uploadData.url.replace('/upload/', '/upload/q_auto:best/f_auto/');

      // Update UI instantly
      const updated = [...images];
      updated[index] = hdUrl;
      setImages(updated);
      
      // Reset error state for this index
      setImageErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = false;
        return newErrors;
      });

      // Save to database
      await fetch("/api/save-hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: index,
          url: hdUrl, // Save HD URL
          publicId: uploadData.publicId,
        }),
      });

    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    }
  };

  // Get HD image URL with proper transformations
  const getHdImageUrl = (url) => {
    if (!url) return '';
    
    // If it's a Cloudinary URL, add quality and format optimization
    if (url.includes('cloudinary')) {
      return url.replace('/upload/', '/upload/q_auto:best/f_auto/');
    }
    
    // For other URLs, return as is
    return url;
  };

  return (
    <section className="relative w-full bg-gray-200">

      {/* HERO SLIDER */}
      <div className="relative h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <div
          ref={sliderRef}
          className={`flex overflow-x-auto snap-x h-full scrollbar-hide ${
            isAdmin ? "" : "scroll-smooth"
          }`}
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {images.map((img, index) => {
            const hdImageUrl = getHdImageUrl(img);
            const hasError = imageErrors[index];
            
            return (
              <div
                key={index}
                className="relative min-w-full snap-center flex items-start justify-center bg-gray-300"
                style={{ scrollSnapAlign: 'start' }}
              >
                {img && !hasError ? (
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={hdImageUrl}
                      alt={`Hero ${index + 1}`}
                      className="w-full h-full object-cover object-top"
                      style={{
                        minHeight: '100%',
                        minWidth: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        imageRendering: '-webkit-optimize-contrast', // Sharper rendering
                      }}
                      loading="eager" // Load immediately for hero images
                      onError={() => handleImageError(index)}
                    />
                    
                    {/* Optional: Add overlay gradient for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-gray-600">
                    <div className="w-24 h-24 border-4 border-dashed border-gray-400 rounded-lg mb-4" />
                    <p className="font-semibold">Image Slot {index + 1}</p>
                    <p className="text-sm">
                      {hasError ? 'Failed to load image' : 'No image uploaded'}
                    </p>
                  </div>
                )}

                {isAdmin && (
                  <label className="absolute top-4 right-4 z-30 bg-white text-blue-600 px-4 py-2 rounded shadow cursor-pointer hover:bg-blue-600 hover:text-white transition">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleUpload(e, index)}
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>

        {/* ✅ HERO BUTTONS – ALWAYS VISIBLE */}
        <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center">
          <HeroButtons />
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (sliderRef.current) {
                  sliderRef.current.scrollTo({
                    left: index * sliderRef.current.clientWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}