const API_URL =
process.env.NEXT_PUBLIC_API_URL ||
"https://lavender-monkey-429786.hostingersite.com";

export default async function handler(req, res) {

  try {

    const response = await fetch(`${API_URL}/api/hero-images`);
    const data = await response.json();

    const images = [null, null, null, null];

    if (data.success && data.images) {
      data.images.forEach((img) => {
        if (img.position < 4) {
          images[img.position] = img.image_url;
        }
      });
    }

    res.status(200).json({ images });

  } catch (error) {
    console.error(error);
    res.status(500).json({ images: [null, null, null, null] });
  }

}