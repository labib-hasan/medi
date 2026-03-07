const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lavender-monkey-429786.hostingersite.com';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${API_URL}/api/md-image`);
    const data = await response.json();
    
    if (data.success && data.image) {
      // Return the MD image URL
      return res.status(200).json({
        image: data.image.url
      });
    } else {
      // Return empty if no image in database
      return res.status(200).json({
        image: null
      });
    }
  } catch (error) {
    console.error('Error fetching MD image from backend:', error);
    // Return empty on error
    return res.status(200).json({
      image: null
    });
  }
}

