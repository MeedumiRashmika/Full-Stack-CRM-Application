import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function Dashboard() {
  const [leads, setLeads] = useState([]);

  const token = localStorage.getItem("token");

  const fetchLeads = async () => {
    const res = await axios.get("http://localhost:5000/api/leads", {
      headers: { Authorization: token },
    });
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const qualifiedLeads = leads.filter((l) => l.status === "Qualified").length;
  const wonLeads = leads.filter((l) => l.status === "Won").length;
  const lostLeads = leads.filter((l) => l.status === "Lost").length;

  const totalValue = leads.reduce(
    (sum, l) => sum + Number(l.estimated_value || 0),
    0
  );

  const wonValue = leads
    .filter((l) => l.status === "Won")
    .reduce((sum, l) => sum + Number(l.estimated_value || 0), 0);

  return (
    <Layout>
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="subtitle">Welcome back! Here's what's happening with your leads today.</p>
      </div>

      <div className="cards">
        <div className="card">
          <div className="card-icon" style={{ background: "#e0f2fe", color: "#0369a1" }}>
            <i className="ph-bold ph-users-three"></i>
          </div>
          <h3>Total Leads</h3>
          <p>{totalLeads}</p>
        </div>

        <div className="card">
          <div className="card-icon" style={{ background: "#fef9c3", color: "#a16207" }}>
            <i className="ph-bold ph-sparkle"></i>
          </div>
          <h3>New Leads</h3>
          <p>{newLeads}</p>
        </div>

        <div className="card">
          <div className="card-icon" style={{ background: "#dcfce7", color: "#15803d" }}>
            <i className="ph-bold ph-check-circle"></i>
          </div>
          <h3>Qualified</h3>
          <p>{qualifiedLeads}</p>
        </div>

        <div className="card">
          <div className="card-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
            <i className="ph-bold ph-trophy"></i>
          </div>
          <h3>Won</h3>
          <p>{wonLeads}</p>
        </div>

        <div className="card">
          <div className="card-icon" style={{ background: "#fef2f2", color: "#dc2626" }}>
            <i className="ph-bold ph-x-circle"></i>
          </div>
          <h3>Lost</h3>
          <p>{lostLeads}</p>
        </div>

        <div className="card">
          <div className="card-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
            <i className="ph-bold ph-currency-dollar"></i>
          </div>
          <h3>Total Value</h3>
          <p>Rs. {totalValue.toLocaleString()}</p>
        </div>

        <div className="card">
          <div className="card-icon" style={{ background: "#dcfce7", color: "#15803d" }}>
            <i className="ph-bold ph-trend-up"></i>
          </div>
          <h3>Won Value</h3>
          <p>Rs. {wonValue.toLocaleString()}</p>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;