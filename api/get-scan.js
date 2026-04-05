export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const response = await fetch(
      `https://n8n-production-d989b.up.railway.app/webhook/get-scan?id=${id}`
    );

    const data = await response.json();

    // ✅ pokud nic nenajde
    if (!data || data.error) {
      return res.status(404).json({ error: "not_found" });
    }

    // ✅ vracíme data TAK JAK JSOU (bez rozbití struktury)
    return res.status(200).json({
      ...data,

      // optional mapping (pro jistotu kompatibility)
      main_leak: data.report_json?.main_leak || null,
      quick_fix: data.report_json?.quick_fix || null,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Fetch failed" });
  }
}
