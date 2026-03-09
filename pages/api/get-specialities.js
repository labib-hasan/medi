export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // This will be called from the client side to get localStorage data
  // In production, this should be stored in a database
  res.status(200).json({ 
    message: 'Use localStorage.getItem("hospital_specialities") on client side',
    note: 'For server-side, consider using database storage'
  });
}

