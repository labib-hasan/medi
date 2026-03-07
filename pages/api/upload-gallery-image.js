const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lavender-monkey-429786.hostingersite.com';

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

  // Create tmp directory if it doesn't exist
  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB
    keepExtensions: true,
    uploadDir: tmpDir,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable parse error:", err);
        return resolve(res.status(400).json({ error: "Invalid form data: " + err.message }));
      }

      try {
        const file = files?.file;
        if (!file) {
          return resolve(res.status(400).json({ error: "No file uploaded" }));
        }

        const uploadedFile = Array.isArray(file) ? file[0] : file;

        // Validate file
        if (!uploadedFile.mimetype?.startsWith("image/")) {
          return resolve(res.status(400).json({ error: "Only image files are allowed" }));
        }

        // Check if filepath exists
        if (!uploadedFile.filepath || !fs.existsSync(uploadedFile.filepath)) {
          console.error("File path does not exist:", uploadedFile.filepath);
          return resolve(res.status(400).json({ error: "File upload failed - please try again" }));
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(uploadedFile.filepath, {
          folder: "gallery",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        });

        console.log("Cloudinary upload successful:", result.secure_url);

        // Save to backend database
        const backendResponse = await fetch(`${API_URL}/api/gallery`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: result.secure_url,
            publicId: result.public_id,
          }),
        });

        const backendData = await backendResponse.json();
        console.log("Backend response:", backendData);

        // Clean up temp file
        try {
          if (uploadedFile.filepath && fs.existsSync(uploadedFile.filepath)) {
            fs.unlinkSync(uploadedFile.filepath);
          }
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }

        if (backendData.success) {
          return resolve(res.status(200).json({
            success: true,
            image: {
              id: backendData.imageId,
              url: result.secure_url,
              publicId: result.public_id,
              uploadedAt: new Date().toISOString(),
            },
          }));
        } else {
          // Rollback - delete the uploaded image
          try {
            await cloudinary.uploader.destroy(result.public_id);
          } catch (rollbackError) {
            console.error("Rollback error:", rollbackError);
          }
          return resolve(res.status(500).json({ error: backendData.message || "Failed to save to database" }));
        }

      } catch (error) {
        console.error("Upload error:", error);
        return resolve(res.status(500).json({ error: "Upload failed: " + error.message }));
      }
    });
  });
}

