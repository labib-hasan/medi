export default async function handler(req, res) {
  const { pageType, pageId } = req.query;
  
  try {
const response = await fetch(`https://lavender-monkey-429786.hostingersite.com/api/page-images/${pageType}/${pageId}/active`);
    if (!response.ok) {
      return res.status(404).json({ error: 'No active image found' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Active image fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}

