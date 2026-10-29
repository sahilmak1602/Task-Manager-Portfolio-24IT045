
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "register") {
        await registerUser(email, password);

        setMessage("Registration successful! Please log in.");
        setMode("login");
        setPassword("");
      } else {
        const data = await loginUser(email, password);

        sessionStorage.setItem("token", data.token);
        setMessage("Login successful!");

        navigate("/tasks", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
  }

  return (
    <section className="section skills-section">
   

      <h1>{mode === "login" ? "Login" : "Create Account"}</h1>

      <p>
        {mode === "login"
          ? "Log in to access your protected tasks."
          : "Register to create your Task Manager account."}
      </p>

      <form onSubmit={handleSubmit} className="task-form">
        <label htmlFor="login-email">Email</label>

        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">Password</label>

        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 characters"
          autoComplete={
            mode === "login" ? "current-password" : "new-password"
          }
          minLength={8}
          required
        />

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Register"}
        </button>
      </form>

      {error && (
        <p role="alert" className="task-error">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="task-success">
          {message}
        </p>
      )}

      <p>
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() =>
            changeMode(mode === "login" ? "register" : "login")
          }
        >
          {mode === "login" ? "Register here" : "Login here"}
        </button>
      </p>
    </section>
  );
}

export default Login;
