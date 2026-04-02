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

    const match = text.match(/{[\s\S]*}/);

    if (!match) {
      return res.status(500).json({
        error: "No JSON found",
        raw: text
      });
    }

    let data = JSON.parse(match[0]);

    let report = data.report_json;

    // 🔥 1. string → object
    if (typeof report === "string") {
      try {
        report = JSON.parse(report);
      } catch {
        report = {};
      }
    }

    // 🔥 2. nested text JSON
    if (report?.text) {
      try {
        const parsed = JSON.parse(report.text);
        report = { ...report, ...parsed };
      } catch {}
    }

    // 🔥 3. KLÍČOVÝ FIX — NEPŘEPISUJ, ALE ROZŠIŘUJ
    data.report_json = {
      ...report, // 🔥 TOTO JE TEN FIX

      score: report?.score || data.score || 70,
      main_leak: report?.main_leak || data.main_leak_1 || "",
      quick_fix: report?.quick_fix || data.quick_fix_1 || "",
      primary_failure: report?.primary_failure || "",

      issues: Array.isArray(report?.issues) ? report.issues : [],
      revenue_distribution: Array.isArray(report?.revenue_distribution)
        ? report.revenue_distribution
        : [],
      revenue_plan: Array.isArray(report?.revenue_plan)
        ? report.revenue_plan
        : [],
      execution_plan: Array.isArray(report?.execution_plan)
        ? report.execution_plan
        : [],

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
