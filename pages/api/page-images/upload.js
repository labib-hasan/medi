import { getStoredAdminToken } from '../../../utils/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getStoredAdminToken();
  if (!token) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }

  try {
    const formData = req.body;
const backendResponse = await fetch('https://lavender-monkey-429786.hostingersite.com/api/page-images/upload', {
      method: 'POST',
      headers: {
        'Cookie': `adminToken=${token}`,
      },
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return res.status(backendResponse.status).json(errorData);
    }

    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Upload proxy error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}

