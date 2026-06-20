import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      if (isRegister) {
        const res = await api.post("/auth/register", { email, password });
        setSuccess("Registered successfully! You can now log in.");
        setIsRegister(false);
      } else {
        const res = await api.post("/auth/login", { email, password });
        if (res.data.access_token) {
          login(res.data.access_token);
          navigate("/library");
        } else {
          setError(res.data.error || "Login failed");
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => { setIsRegister(false); setError(""); setSuccess(""); }}
          style={{
            padding: "0.4rem 1rem",
            cursor: "pointer",
            background: !isRegister ? "var(--accent)" : "var(--code-bg)",
            color: !isRegister ? "#fff" : "var(--text-h)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
          }}
        >
          Login
        </button>
        <button
          onClick={() => { setIsRegister(true); setError(""); setSuccess(""); }}
          style={{
            padding: "0.4rem 1rem",
            cursor: "pointer",
            background: isRegister ? "var(--accent)" : "var(--code-bg)",
            color: isRegister ? "#fff" : "var(--text-h)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
          }}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "0.5rem", padding: "0.5rem", width: "250px" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1.5rem", cursor: "pointer" }}>
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
