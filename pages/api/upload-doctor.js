import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

/**
 * REQUIRED for Next.js 16 + Turbopack
 */
export const runtime = "nodejs";

/**
 * Disable bodyParser for multipart
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Cloudinary config
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dd20ni4kl",
  api_key: process.env.CLOUDINARY_API_KEY || "614819924383186",
  api_secret: process.env.CLOUDINARY_API_SECRET || "13F7yur_2VWTVWGifuHWejsZQdk",
});

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ❌ DO NOT use keepExtensions or multiples
  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 2MB
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(400).json({ error: "Invalid form data" });
      }

      const file = files?.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const uploadedFile = Array.isArray(file) ? file[0] : file;

      if (!uploadedFile.mimetype?.startsWith("image/")) {
        return res.status(400).json({ error: "Only image files allowed" });
      }

      const result = await cloudinary.uploader.upload(
        uploadedFile.filepath,
        {
          folder: "doctors",
          resource_type: "image",
          transformation: [
            { width: 600, height: 600, crop: "fill", gravity: "face" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        }
      );

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      return res.status(500).json({ error: "Image upload failed" });
    }
  });
}