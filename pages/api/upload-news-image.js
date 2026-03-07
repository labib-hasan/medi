const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dd20ni4kl",
  api_key: process.env.CLOUDINARY_API_KEY || "614819924383186",
  api_secret: process.env.CLOUDINARY_API_SECRET || "13F7yur_2VWTVWGifuHWejsZQdk",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({
    maxFileSize: 10 * 1024 * 1024,
    keepExtensions: true,
    uploadDir: path.join(process.cwd(), "tmp"),
  });

  // Ensure tmp directory exists
  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable parse error:", err);
      return res.status(400).json({ error: "Invalid form data: " + err.message });
    }

    try {
      console.log("Files received:", files);

      const file = files?.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const uploadedFile = Array.isArray(file) ? file[0] : file;
      
      console.log("Uploaded file info:", {
        originalFilename: uploadedFile.originalFilename,
        mimetype: uploadedFile.mimetype,
        filepath: uploadedFile.filepath,
        size: uploadedFile.size
      });

      if (!uploadedFile.mimetype?.startsWith("image/")) {
        return res.status(400).json({ error: "Only image files allowed" });
      }

      // Check if filepath exists
      if (!uploadedFile.filepath || !fs.existsSync(uploadedFile.filepath)) {
        console.error("File path does not exist:", uploadedFile.filepath);
        return res.status(400).json({ error: "File upload failed - no file path" });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(uploadedFile.filepath, {
        folder: "news",
        resource_type: "image",
        transformation: [
          { width: 800, height: 600, crop: "fill", gravity: "auto" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      console.log("Cloudinary upload result:", result.secure_url);

      // Clean up temp file
      try {
        fs.unlinkSync(uploadedFile.filepath);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }

      return res.status(200).json({
        success: true,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      return res.status(500).json({ error: "Image upload failed: " + error.message });
    }
  });
}

