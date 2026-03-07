const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lavender-monkey-429786.hostingersite.com';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: "Image ID is required" });
    }

    const response = await fetch(`${API_URL}/api/gallery/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ 
        success: true, 
        message: "Image deleted successfully" 
      });
    } else {
      return res.status(400).json({ error: data.message || "Failed to delete image" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: "Failed to delete image: " + error.message });
  }
}

