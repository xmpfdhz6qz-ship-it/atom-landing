export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: "Missing domain" });
  }

  try {
    const response = await fetch(
      `https://n8n-production-0a8f.up.railway.app/webhook/store-get?domain=${domain}`
    );

    const text = await response.text();

    console.log("RAW:", text);

    // 👇 pokud vrací HTML nebo XML, vezmeme jen první objekt
    const match = text.match(/{[\s\S]*}/);

    if (!match) {
      return res.status(500).json({
        error: "No JSON found",
        raw: text
      });
    }

    const data = JSON.parse(match[0]);

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Fetch failed" });
  }
}
