import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/api/games/${id}`)
      .then((res) => setGame(res.data))
      .catch(() => setMessage("Failed to load game details"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToLibrary = async () => {
    try {
      const genres = game.genres?.map((g) => g.name) || [];
      const platforms = game.platforms?.map((p) => p.platform.name) || [];
      const res = await api.post("/library", {
        rawg_id: game.id,
        name: game.name,
        cover: game.background_image,
        genres,
        platforms,
      });
      setMessage(res.data.message || "Added to library!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!game) return <p>{message}</p>;

  return (
    <div style={{ padding: "1rem", textAlign: "left" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        &larr; Back
      </button>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {game.background_image && (
          <img
            src={game.background_image}
            alt={game.name}
            style={{ width: "400px", maxWidth: "100%", borderRadius: "8px" }}
          />
        )}

        <div style={{ flex: 1, minWidth: "250px" }}>
          <h2 style={{ marginTop: 0 }}>{game.name}</h2>

          {game.released && (
            <p><strong>Released:</strong> {game.released}</p>
          )}
          {game.rating && (
            <p><strong>Rating:</strong> {game.rating} / 5</p>
          )}

          {game.genres && game.genres.length > 0 && (
            <p>
              <strong>Genres:</strong>{" "}
              {game.genres.map((g) => g.name).join(", ")}
            </p>
          )}

          {game.platforms && game.platforms.length > 0 && (
            <p>
              <strong>Platforms:</strong>{" "}
              {game.platforms.map((p) => p.platform.name).join(", ")}
            </p>
          )}

          <button
            onClick={addToLibrary}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.5rem",
              cursor: "pointer",
            }}
          >
            Add to Library
          </button>

          {message && (
            <p style={{ marginTop: "0.5rem", color: message.includes("error") || message.includes("already") ? "red" : "green" }}>
              {message}
            </p>
          )}

          {game.description_raw && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3>About</h3>
              <p style={{ lineHeight: 1.6 }}>{game.description_raw}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
