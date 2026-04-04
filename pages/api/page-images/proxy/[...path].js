// Frontend API Proxy for Page Images - Cloudinary Backend
import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/api/page-images/proxy': '/api/page-images',
  },
  onProxyReq: (proxyReq, req, res) => {
    // Forward auth cookies for protected routes
    if (req.cookies.adminToken) {
      proxyReq.setHeader('Cookie', `adminToken=${req.cookies.adminToken}`);
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});
