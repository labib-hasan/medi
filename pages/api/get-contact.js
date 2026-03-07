const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${API_URL}/api/contact`);
    const data = await response.json();
    
    if (data.success && data.contact) {
      // Return the contact data directly
      return res.status(200).json(data.contact);
    } else {
      // Return default values if no contact in database
      return res.status(200).json({
        phone: "+880222222222",
        emergencyPhone: "+8809610-818888",
        hotline: "+8809610-818888",
        email: "info@mccht.org",
        address: "Agrabad Access Road, Beside BP Chattogram, Chattogram",
        addressBn: "আগ্রাবাদ অ্যাক্সেস রোড, বিপি চট্টগ্রামের পাশে, চট্টগ্রাম",
        lat: 22.333341,
        lng: 91.831056,
      });
    }
  } catch (error) {
    console.error('Error fetching contact from backend:', error);
    // Return default values on error
    return res.status(200).json({
      phone: "+880222222222",
      emergencyPhone: "+8809610-818888",
      hotline: "+8809610-818888",
      email: "info@mccht.org",
      address: "Agrabad Access Road, Beside BP Chattogram, Chattogram",
      addressBn: "আগ্রাবাদ অ্যাক্সেস রোড, বিপি চট্টগ্রামের পাশে, চট্টগ্রাম",
      lat: 22.333341,
      lng: 91.831056,
    });
  }
}

