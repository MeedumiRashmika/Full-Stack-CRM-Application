import { Link, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>Sales CRM</h2>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/leads">Leads</Link>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="content">{children}</div>
    </div>
  );
}

export default Layout;