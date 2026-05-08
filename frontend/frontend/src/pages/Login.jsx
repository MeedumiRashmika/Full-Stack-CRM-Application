import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid login details");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px', color: 'white', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)' }}>
            <i className="ph-fill ph-sketch-logo"></i>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Enter your credentials to access your CRM</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
               <i className="ph ph-envelope" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
               <input
                type="email"
                value={email}
                placeholder="admin@example.com"
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
               <i className="ph ph-lock" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
               <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-btn" style={{ width: '100%', padding: '14px' }}>
            Sign In <i className="ph-bold ph-arrow-right"></i>
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', padding: '12px', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Demo:</span> <strong>admin@example.com / password123</strong>
        </div>
      </div>
    </div>
  );
}

export default Login;