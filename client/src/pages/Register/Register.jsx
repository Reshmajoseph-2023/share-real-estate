import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setErr("");

    // optional client-side trim/validation
    const payload = {
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
    };
    if (!payload.username || !payload.email || !payload.password) {
      setErr("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.success) {
        // If you want auto-login instead, save token here and navigate to /properties
        // localStorage.setItem("token", res.data.token);
        navigate("/login");
      } else {
        setErr(res.data?.message || "Registration failed.");
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
      <form onSubmit={onRegister} className="login-container">
        <div className="login-title">
          <h2>Sign Up</h2>
        </div>

        <div className="login-inputs">
          <input
            name="username"
            type="text"
            placeholder="Your Name"
            value={data.username}
            onChange={onChangeHandler}
            autoComplete="username"
            required
            minLength={3}
          />
          <input
            name="email"
            type="email"
            placeholder="Your email"
            value={data.email}
            onChange={onChangeHandler}
            autoComplete="email"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={onChangeHandler}
            autoComplete="new-password"
            required
            minLength={6}
          />
        </div>

        {err && <div className="error">{err}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <label className="login-condition">
          <input type="checkbox" required />
          <span>By continuing, I agree to the terms of use & privacy policy.</span>
        </label>

        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} role="button" tabIndex={0}>
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
