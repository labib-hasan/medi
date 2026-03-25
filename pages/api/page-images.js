import db from '../../lib/db';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { pageName } = req.query;
      
      if (pageName) {
        // Get single page image
        const [rows] = await db.execute(
          'SELECT * FROM page_images WHERE page_name = ?',
          [pageName]
        );
        
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Image not found' });
        }
        
        return res.status(200).json(rows[0]);
      } else {
        // Get all page images
        const [rows] = await db.execute(
          'SELECT * FROM page_images ORDER BY page_name'
        );
        return res.status(200).json(rows);
      }
    } catch (error) {
      console.error('Error fetching page image:', error);
      return res.status(500).json({ error: 'Database error: ' + error.message });
    }
  } 
  else if (req.method === 'POST') {
    try {
      const { pageName, imageUrl } = req.body;
      
      if (!pageName || !imageUrl) {
        return res.status(400).json({ error: 'pageName and imageUrl are required' });
      }

      // First, ensure the table exists
      try {
        await db.execute(`
          CREATE TABLE IF NOT EXISTS page_images (
            id INT NOT NULL AUTO_INCREMENT,
            page_name VARCHAR(100) NOT NULL UNIQUE,
            image_url TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            INDEX idx_page_name (page_name)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);
      } catch (tableError) {
        console.error('Error creating table:', tableError);
      }

      // Upsert the image
      const [result] = await db.execute(
        `INSERT INTO page_images (page_name, image_url) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE 
         image_url = VALUES(image_url), 
         updated_at = CURRENT_TIMESTAMP`,
        [pageName, imageUrl]
      );

      return res.status(200).json({ 
        success: true, 
        message: 'Image saved successfully',
        pageName,
        imageUrl
      });
    } catch (error) {
      console.error('Error saving page image:', error);
      return res.status(500).json({ error: 'Database error: ' + error.message });
    }
  }
  else if (req.method === 'DELETE') {
    try {
      const { pageName } = req.query;
      
      if (!pageName) {
        return res.status(400).json({ error: 'pageName is required' });
      }

      const [result] = await db.execute(
        'DELETE FROM page_images WHERE page_name = ?',
        [pageName]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Image not found' });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Image deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting page image:', error);
      return res.status(500).json({ error: 'Database error: ' + error.message });
    }
  }
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}