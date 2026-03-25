export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: "Missing domain" });
  }

  try {
    const response = await fetch(
      `https://n8n-production-0a8f.up.railway.app/webhook/store-get?domain=${domain}`
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
