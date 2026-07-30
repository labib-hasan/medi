const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://lavender-monkey-429786.hostingersite.com";

const allowedSlugs = new Set(["director-1", "director-2"]);

export default async function handler(req, res) {
  const { slug } = req.query;

  if (typeof slug !== "string" || !allowedSlugs.has(slug)) {
    return res.status(404).json({ success: false, message: "Director profile not found" });
  }

  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const response = await fetch(`${API_URL}/api/directors/${slug}`, {
      method: req.method,
      headers: req.method === "POST" ? { "Content-Type": "application/json" } : undefined,
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(502).json({ success: false, message: "Unable to reach the director service" });
  }
}
