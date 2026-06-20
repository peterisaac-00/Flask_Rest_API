import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function SearchGames() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearchError("");
    try {
      const res = await api.get("/api/games/search", { params: { q: query } });
      if (res.data.error) {
        setSearchError(res.data.error);
        setResults([]);
      } else if (res.data.results) {
        setResults(res.data.results);
        if (res.data.results.length === 0) {
          setSearchError("No games found. Try a different search term.");
        }
      } else {
        setSearchError(res.data.detail || "Search failed. Check your RAWG API key.");
        setResults([]);
      }
    } catch (err) {
      setSearchError("Could not reach the server. Is the backend running?");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Search Games</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Search for a game..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "300px", marginRight: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {searchError && <p style={{ color: "red" }}>{searchError}</p>}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1rem"
      }}>
        {results.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/game/${game.id}`)}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              background: "var(--code-bg)"
            }}
          >
            {game.background_image && (
              <img
                src={game.background_image}
                alt={game.name}
                style={{ width: "100%", height: "140px", objectFit: "cover" }}
              />
            )}
            <div style={{ padding: "0.5rem" }}>
              <strong>{game.name}</strong>
              {game.released && (
                <p style={{ fontSize: "0.85rem", margin: "4px 0 0" }}>
                  {game.released.slice(0, 4)}
                </p>
              )}
              {game.genres && game.genres.length > 0 && (
                <p style={{ fontSize: "0.75rem", margin: "4px 0 0", color: "var(--text)" }}>
                  {game.genres.slice(0, 2).map((g) => g.name).join(" · ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
