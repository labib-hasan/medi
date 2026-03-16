import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Configure formidable with size limit (10MB)
  const form = formidable({ 
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
    filter: ({ mimetype }) => {
      // Allow only images
      return mimetype && mimetype.includes('image');
    }
  });

  form.parse(req, async (err, fields, files) => {

    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Upload with HD quality settings
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "hero",
        // Quality and format optimization
        quality: "auto:best",
        fetch_format: "auto",
        dpr: "auto",
        responsive: true,
        
        // Image dimensions for HD
        width: 1920,
        height: 1080,
        crop: "limit",
        
        // Additional optimizations
        flags: "progressive",
        format: "jpg", // Convert to JPEG for better compression
        transformation: [
          { quality: "auto:best" },
          { fetch_format: "auto" }
        ],
        
        // Ensure HD quality
        eager: [
          { width: 1920, height: 1080, crop: "pad" },
          { width: 1280, height: 720, crop: "pad" },
          { width: 640, height: 360, crop: "pad" }
        ],
        
        // Store transformation info
        eager_async: true,
      });

      // Clean up temp file
      fs.unlinkSync(file.filepath);

      // Generate HD URL with transformations
      const hdUrl = result.secure_url.replace(
        '/upload/',
        '/upload/q_auto:best/f_auto/c_scale,w_1920/'
      );

      res.status(200).json({
        url: hdUrl,
        publicId: result.public_id,
        originalUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
      });

    } catch (error) {
      console.error("Upload error:", error);
      
      // Clean up temp file if it exists
      if (files?.file?.filepath && fs.existsSync(files.file.filepath)) {
        try {
          fs.unlinkSync(files.file.filepath);
        } catch (unlinkError) {
          console.error("Error deleting temp file:", unlinkError);
        }
      }
      
      res.status(500).json({ error: error.message });
    }
  });
}