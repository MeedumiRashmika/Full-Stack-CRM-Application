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
        <h2>CRM Login</h2>
        <p>Lead Management System</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p>admin@example.com / password123</p>
      </div>
    </div>
  );
}

export default Login;