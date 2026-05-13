import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithGoogle,
  signInWithEmailPassword
} from "../../services/supabaseAuth";
import { useLanguage } from "../../context/LanguageContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailPassword(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "3rem auto", padding: "1rem" }}>
      <h1>{t("loginTitle", "Login")}</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <label>
          {t("loginEmail", "Email")}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.75rem", marginTop: "0.5rem" }}
          />
        </label>

        <label>
          {t("loginPassword", "Password")}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.75rem", marginTop: "0.5rem" }}
          />
        </label>

        {error && (
          <div style={{ color: "red", fontSize: "0.95rem" }}>{t("error", error || "Unable to add item. Please try again.")}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#ff6b6b",
            color: "white",
            border: "none",
            padding: "0.9rem 1.2rem",
            borderRadius: 999,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? t("signingIn", "Signing in...") : t("signIn", "Sign in")}
        </button>
      </form>

      <div style={{ textAlign: "center", margin: "1.5rem 0", color: "#666" }}>
        {t("or", "or")}
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          width: "100%",
          background: "white",
          color: "#333",
          border: "1px solid #ddd",
          padding: "0.9rem 1.2rem",
          borderRadius: 999,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {t("continueWithGoogle", "Continue with Google")}
      </button>
    </div>
  );
};

export default Login;
