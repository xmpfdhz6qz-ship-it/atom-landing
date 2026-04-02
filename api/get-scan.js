export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const response = await fetch(
      `https://n8n-production-d989b.up.railway.app/webhook/get-report-by-id?id=${id}`
    );

    const text = await response.text();

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
