import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const STATUS_LABELS = {
  playing: "Playing",
  completed: "Completed",
  want_to_play: "Want to Play",
  planned: "Planned",
  dropped: "Dropped",
};

const STATUS_COLORS = {
  playing: "#22c55e",
  completed: "#3b82f6",
  want_to_play: "#a855f7",
  planned: "#f59e0b",
  dropped: "#ef4444",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/library/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!stats) return <p>Failed to load stats.</p>;

  const maxVal = Math.max(
    ...Object.entries(stats)
      .filter(([k]) => k !== "total")
      .map(([, v]) => v),
    1
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          margin: "1.5rem 0",
        }}
      >
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div
            key={key}
            onClick={() => navigate("/library")}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "1rem",
              background: "var(--code-bg)",
              cursor: "pointer",
            }}
          >
            <p style={{ fontSize: "0.85rem", margin: 0 }}>{label}</p>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "0.25rem 0",
                color: STATUS_COLORS[key],
              }}
            >
              {stats[key]}
            </p>
          </div>
        ))}

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "1rem",
            background: "var(--code-bg)",
          }}
        >
          <p style={{ fontSize: "0.85rem", margin: 0 }}>Total</p>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "0.25rem 0",
              color: "var(--text-h)",
            }}
          >
            {stats.total}
          </p>
        </div>
      </div>

      <h3>Status Breakdown</h3>
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "1rem",
          background: "var(--code-bg)",
          maxWidth: "500px",
        }}
      >
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} style={{ marginBottom: "0.75rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                marginBottom: "0.25rem",
              }}
            >
              <span>{label}</span>
              <span>{stats[key]}</span>
            </div>
            <div
              style={{
                height: "8px",
                background: "var(--border)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(stats[key] / maxVal) * 100}%`,
                  height: "100%",
                  background: STATUS_COLORS[key],
                  borderRadius: "4px",
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
