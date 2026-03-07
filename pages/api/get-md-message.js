const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${API_URL}/api/md-message`);
    const data = await response.json();
    
    if (data.success && data.message) {
      // Return the MD message data directly
      return res.status(200).json({
        name: data.message.name || "",
        position: data.message.position || "",
        title: data.message.title || "Message from Managing Director",
        message: data.message.message || ""
      });
    } else {
      // Return default values if no message in database
      return res.status(200).json({ 
        title: "Message from Managing Director",
        message: "Welcome to Medical Centre Chattagram. We are committed to providing quality healthcare services to our patients."
      });
    }
  } catch (error) {
    console.error('Error fetching MD message from backend:', error);
    // Return default values on error
    return res.status(200).json({ 
      title: "Message from Managing Director",
      message: "Welcome to Medical Centre Chattagram. We are committed to providing quality healthcare services to our patients."
    });
  }
}

