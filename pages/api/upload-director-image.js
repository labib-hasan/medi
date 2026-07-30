import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://lavender-monkey-429786.hostingersite.com";
const allowedSlugs = new Set(["director-1", "director-2"]);

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

  const tempDirectory = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true });
  }

  const form = formidable({
    maxFileSize: 10 * 1024 * 1024,
    keepExtensions: true,
    uploadDir: tempDirectory,
  });

  form.parse(req, async (parseError, fields, files) => {
    if (parseError) {
      return res.status(400).json({ error: "Invalid form data" });
    }

    const slug = Array.isArray(fields.slug) ? fields.slug[0] : fields.slug;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!allowedSlugs.has(slug)) {
      return res.status(400).json({ error: "Invalid director profile" });
    }

    if (!file || !file.mimetype?.startsWith("image/") || !fs.existsSync(file.filepath)) {
      return res.status(400).json({ error: "Please upload an image file" });
    }

    try {
      const upload = await cloudinary.uploader.upload(file.filepath, {
        folder: "director-profiles",
        resource_type: "image",
        transformation: [
          { width: 500, height: 500, crop: "fill", gravity: "face" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      const backendResponse = await fetch(`${API_URL}/api/directors/${slug}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: upload.secure_url, publicId: upload.public_id }),
      });

      const backendData = await backendResponse.json();
      if (!backendData.success) {
        await cloudinary.uploader.destroy(upload.public_id);
        return res.status(500).json({ error: "Failed to save the director image" });
      }

      return res.status(200).json({ success: true, url: upload.secure_url });
    } catch (error) {
      return res.status(500).json({ error: "Image upload failed" });
    } finally {
      try {
        fs.unlinkSync(file.filepath);
      } catch {
        // The temporary file may already have been removed by the upload handler.
      }
    }
  });
}
