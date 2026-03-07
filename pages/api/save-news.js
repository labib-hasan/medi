const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, content, image, id } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    let response;
    
    if (id) {
      // Update existing news
      response = await fetch(`${API_URL}/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, image }),
      });
    } else {
      // Create new news
      response = await fetch(`${API_URL}/api/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, image }),
      });
    }

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ 
        success: true, 
        message: id ? "News updated successfully" : "News created successfully" 
      });
    } else {
      return res.status(400).json({ error: data.message || "Failed to save news" });
    }
  } catch (error) {
    console.error("Error saving news:", error);
    return res.status(500).json({ error: "Failed to save news: " + error.message });
  }
}

