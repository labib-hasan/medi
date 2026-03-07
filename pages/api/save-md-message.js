const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lavender-monkey-429786.hostingersite.com';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, position, title, message } = req.body;

    const response = await fetch(`${API_URL}/api/md-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, position, title, message }),
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ 
        success: true, 
        data: { name, position, title, message }
      });
    } else {
      return res.status(400).json({ error: data.message || "Failed to save MD message" });
    }
  } catch (error) {
    console.error("Error saving MD message:", error);
    return res.status(500).json({ error: "Failed to save MD message: " + error.message });
  }
}

