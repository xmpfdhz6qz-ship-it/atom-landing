export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    const response = await fetch(
      `https://n8n-production-d989b.up.railway.app/webhook/get-audit?token=${token}`
    );

    const text = await response.text();

    // fallback pokud n8n vrací bordel
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
    return res.status(500).json({ error: "Fetch failed" });
  }
}
