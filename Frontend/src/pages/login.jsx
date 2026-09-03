import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import "./login.css";
import api from "../Api/axios";
import logo from "./../assets/logo-header.png"
function Login() {
  const [email, setEmail] = useState('admin@thukka.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/Login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save user information if backend sends it
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        const role = response.data.user.role;
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "sales_manager" || role === "salesManager") {
          navigate("/manager-dashboard");
        } else if (role === "sales_executive" || role === "salesExecutive") {
          navigate("/executive-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login failed:", error);

      alert(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Decorative Gradient Background Blobs */}
      <div className="login-bg-blob-1"></div>
      <div className="login-bg-blob-2"></div>

      {/* Main Glassmorphic Login Card */}
      <div className="login-card">

        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-box">
            <img src={logo} alt="logo" className="w-30 h-15 object-contain" />
            <p className="login-subtitle">Sign in to manage enquiries</p>
          </div>

        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field-group">
            <label className="login-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="login-input"
              placeholder="name@company.com"
              // value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field-group">
            <div className="login-row">
              <label className="login-label" htmlFor="password">
                Password
              </label>
            </div>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="login-input"
                placeholder="••••••••"
                // value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="login-checkbox-group">
            <input
              id="remember_me"
              type="checkbox"
              className="login-checkbox"
              defaultChecked
            />
            <label htmlFor="remember_me" className="login-checkbox-label">
              Remember my session
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
          >
            {loading ? (
              <div className="login-loading-spinner"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="login-footer">
          <p className="login-footer-text">
            Powered by THUKKA Sales System. © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
