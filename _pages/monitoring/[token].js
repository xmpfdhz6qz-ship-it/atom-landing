import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Monitoring() {
  const router = useRouter();
  const { token } = router.query;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch(`https://n8n-production-d989b.up.railway.app/webhook/monitoring?token=${token}`)
      .then(res => res.json())
      .then(setData);
  }, [token]);

  if (!data) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 800, margin: "0 auto" }}>
      
      <h1>{data.store}</h1>

      <h2 style={{ color: "green" }}>
        Conversion Score: {data.score}
      </h2>

      <p>
        Estimated monthly loss: <strong>${data.monthly_loss}</strong>
      </p>

      <h3>Issues:</h3>
      <ul>
        {data.issues.length === 0 && <li>No issues detected</li>}
        {data.issues.map((issue, i) => (
          <li key={i}>{issue}</li>
        ))}
      </ul>

      <h3>Performance trend:</h3>
      <ul>
        {data.history.map((h, i) => (
          <li key={i}>
            {new Date(h.created_at).toLocaleDateString()} → {h.score}
          </li>
        ))}
      </ul>

      <a
        href="https://buy.stripe.com/test_eVq7sLceB5Eq8ylfsWfUQ05"
        style={{
          display: "inline-block",
          marginTop: 30,
          padding: "15px 25px",
          background: "orange",
          color: "white",
          fontWeight: "bold",
          textDecoration: "none",
          borderRadius: 8
        }}
      >
        Fix all issues → Get full audit ($399)
      </a>

    </div>
  );
}
