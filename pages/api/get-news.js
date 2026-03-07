const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lavender-monkey-429786.hostingersite.com';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${API_URL}/api/news`);
    const data = await response.json();
    
    if (data.success) {
      // Transform backend data to match frontend expected format
      const news = data.news.map(item => ({
        ...item,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      return res.status(200).json({ news });
    } else {
      return res.status(200).json({ news: [] });
    }
  } catch (error) {
    console.error('Error fetching news from backend:', error);
    return res.status(200).json({ news: [] });
  }
}

