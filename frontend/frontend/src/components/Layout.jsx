import { NavLink, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>
          <i className="ph-bold ph-sketch-logo" style={{ color: "var(--primary)" }}></i>
          SalesCRM
        </h2>
        <nav>
          <NavLink to="/dashboard">
            <i className="ph-bold ph-house"></i> Dashboard
          </NavLink>
          <NavLink to="/leads">
            <i className="ph-bold ph-users"></i> Leads
          </NavLink>
        </nav>
        <button onClick={logout} className="logout-btn">
          <i className="ph-bold ph-sign-out"></i> Logout
        </button>
      </div>

      <div className="content">
        <header className="main-header">
           {/* Add a placeholder header for polish */}
        </header>
        {children}
      </div>
    </div>
  );
}

export default Layout;