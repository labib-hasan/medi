const API_URL =
process.env.NEXT_PUBLIC_API_URL ||
"https://hospital-production-c3b0.up.railway.app";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { position, url, publicId } = req.body;

  try {

    const response = await fetch(`${API_URL}/api/hero-images/by-position`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        position,
        url,
        publicId,
      }),
    });

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Save failed" });
  }
}