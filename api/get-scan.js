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

    return res.status(200).json({
      ...data,

      // 🔥 mapping pro frontend
      main_leak: data.main_leak_1,
      quick_fix: data.quick_fix_1
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Fetch failed" });
  }
}
