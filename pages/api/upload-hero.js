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

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {

    if (err) return res.status(400).json({ error: err.message });

    try {

      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "hero",
      });

      fs.unlinkSync(file.filepath);

      res.status(200).json({
        url: result.secure_url,
        publicId: result.public_id,
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  });

}