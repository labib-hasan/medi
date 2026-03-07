const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lavender-monkey-429786.hostingersite.com';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${API_URL}/api/gallery`);
    const data = await response.json();
    
    if (data.success) {
      // Transform Railway database columns to frontend format
      // Railway: id, image_url, public_id, uploaded_at, title
      const images = data.images.map(item => ({
        id: item.id,
        url: item.image_url,
        publicId: item.public_id,
        title: item.title || '',
        createdAt: item.uploaded_at,
        uploadedAt: item.uploaded_at
      }));
      return res.status(200).json({ images });
    } else {
      return res.status(200).json({ images: [] });
    }
  } catch (error) {
    console.error('Error fetching gallery images from backend:', error);
    return res.status(200).json({ images: [] });
  }
}

