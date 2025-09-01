import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ identifier: "", password: "" }); // identifier = email or username
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!data.identifier || !data.password) {
      setErr("Please enter your email/username and password.");
      return;
    }

    // Backend accepts either email or username; send the right key
    const payload = data.identifier.includes("@")
      ? { email: data.identifier.trim(), password: data.password }
      : { username: data.identifier.trim(), password: data.password };

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.token) {
          console.log("Session token:", res.data.token);
        localStorage.setItem("token", res.data.token);
              navigate("/properties");
      } else {
        setErr(res.data?.message || "Login failed.");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (error.message?.includes("Network") ? "Cannot reach server." : error.message) ||
        "Something went wrong.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form onSubmit={onLoginSubmit} className="login-container">
        <div className="login-title">
          <h2>Login</h2>
        </div>

        <div className="login-inputs">
          <input
            name="identifier"
            type="text"
            placeholder="Email or Username"
            value={data.identifier}
            onChange={onChange}
            autoComplete="username"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={onChange}
            autoComplete="current-password"
            required
          />
        </div>

        {err && <div className="error">{err}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")} role="button" tabIndex={0}>
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}