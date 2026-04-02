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

    // 👉 najdi JSON v odpovědi
    const match = text.match(/{[\s\S]*}/);

    if (!match) {
      return res.status(500).json({
        error: "No JSON found",
        raw: text
      });
    }

    let data = JSON.parse(match[0]);

    // 🔥 NORMALIZACE report_json
    let report = data.report_json;

    // 👉 pokud je string → parse
    if (typeof report === "string") {
      try {
        report = JSON.parse(report);
      } catch (e) {
        console.error("report_json parse failed");
        report = {};
      }
    }

    // 👉 pokud je nested JSON v text
    if (report?.text) {
      try {
        const parsed = JSON.parse(report.text);
        report = { ...report, ...parsed };
      } catch (e) {
        console.error("nested parse failed");
      }
    }

    // 👉 fallback struktura (CRITICAL)
    data.report_json = {
      score: report?.score || data.score || 70,
      main_leak: report?.main_leak || data.main_leak_1 || "",
      quick_fix: report?.quick_fix || data.quick_fix_1 || "",
      primary_failure: report?.primary_failure || "",

      issues: report?.issues || [],
      revenue_distribution: report?.revenue_distribution || [],
      revenue_plan: report?.revenue_plan || [],
      execution_plan: report?.execution_plan || [],

      revenue_calculation: report?.revenue_calculation || {
        monthly_loss_value: 10000,
        daily_loss_value: 333
      },

      analysis_confidence: report?.analysis_confidence || "medium"
    };

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Fetch failed" });
  }
}
