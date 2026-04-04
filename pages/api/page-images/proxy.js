// Simple proxy for page images API
// Usage: /api/page-images/active/department/medicine
// Usage: /api/page-images/upload (POST with formData)

export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://lavender-monkey-429786.hostingersite.com';
  
  try {
    const proxyUrl = `${backendUrl}/api/page-images${req.url.replace('/api/page-images', '')}`;
    
    const response = await fetch(proxyUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        ...(req.cookies.adminToken && { Cookie: `adminToken=${req.cookies.adminToken}` }),
      },
      body: req.method !== 'GET' ? req.body : undefined,
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed' });
  }
}

