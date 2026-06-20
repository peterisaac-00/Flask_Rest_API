import { useState, useEffect } from "react";
import api from "../api/axios";

const STATUSES = ["All", "playing", "completed", "want_to_play", "planned", "dropped"];

export default function MyLibrary() {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const res = await api.get("/library");
      setGames(res.data || []);
    } catch {
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const CHANGE_STATUSES = ["playing", "completed", "want_to_play", "planned", "dropped"];

  const handleDelete = async (gameId) => {
    try {
      await api.delete(`/library/${gameId}`);
      fetchLibrary();
    } catch {
      // ignore
    }
  };

  const handleStatusChange = async (gameId, newStatus) => {
    try {
      await api.patch(`/library/${gameId}`, { status: newStatus });
      fetchLibrary();
    } catch {
      // ignore
    }
  };

  const filtered =
    filter === "All"
      ? games
      : games.filter((g) => g.status === filter);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Library</h2>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "0.3rem 0.8rem",
              cursor: "pointer",
              background: filter === s ? "var(--accent)" : "var(--code-bg)",
              color: filter === s ? "#fff" : "var(--text-h)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
            }}
          >
            {s === "All" ? "All" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {!loading && filtered.length === 0 && <p>No games found.</p>}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1rem"
      }}>
        {filtered.map((g) => (
          <div
            key={g.game_id}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "8px",
              overflow: "hidden",
              background: "var(--code-bg)"
            }}
          >
            {g.cover && (
              <img
                src={g.cover}
                alt={g.name}
                style={{ width: "100%", height: "140px", objectFit: "cover" }}
              />
            )}
            <div style={{ padding: "0.5rem" }}>
              <strong>{g.name}</strong>
              {g.genres && g.genres.length > 0 && (
                <p style={{ fontSize: "0.75rem", margin: "4px 0", color: "var(--text)" }}>
                  {g.genres.slice(0, 3).join(" · ")}
                </p>
              )}
              {g.platforms && g.platforms.length > 0 && (
                <p style={{ fontSize: "0.75rem", margin: "4px 0", color: "var(--text)" }}>
                  {g.platforms.slice(0, 3).join(" · ")}
                </p>
              )}
              <select
                value={g.status}
                onChange={(e) => handleStatusChange(g.game_id, e.target.value)}
                style={{
                  marginTop: "0.3rem",
                  padding: "0.2rem 0.4rem",
                  fontSize: "0.8rem",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {CHANGE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              {g.rating && (
                <p style={{ fontSize: "0.85rem", margin: "4px 0" }}>
                  Rating: {g.rating}/5
                </p>
              )}
              <button
                onClick={() => handleDelete(g.game_id)}
                style={{
                  marginTop: "0.3rem",
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
