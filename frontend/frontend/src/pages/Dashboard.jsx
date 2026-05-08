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
      <h1 className="page-title">Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Leads</h3>
          <p>{totalLeads}</p>
        </div>

        <div className="card">
          <h3>New Leads</h3>
          <p>{newLeads}</p>
        </div>

        <div className="card">
          <h3>Qualified Leads</h3>
          <p>{qualifiedLeads}</p>
        </div>

        <div className="card">
          <h3>Won Leads</h3>
          <p>{wonLeads}</p>
        </div>

        <div className="card">
          <h3>Lost Leads</h3>
          <p>{lostLeads}</p>
        </div>

        <div className="card">
          <h3>Total Deal Value</h3>
          <p>Rs. {totalValue}</p>
        </div>

        <div className="card">
          <h3>Won Deal Value</h3>
          <p>Rs. {wonValue}</p>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;