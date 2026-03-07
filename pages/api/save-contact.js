const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const contactData = req.body;
    
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ 
        success: true, 
        message: "Contact saved successfully", 
        data: contactData 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: data.message || "Failed to save contact" 
      });
    }
  } catch (error) {
    console.error("Error saving contact:", error);
    return res.status(500).json({ success: false, message: "Error saving contact", error: error.message });
  }
}

