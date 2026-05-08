import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function Leads() {
  const token = localStorage.getItem("token");

  const emptyForm = {
    lead_name: "",
    company_name: "",
    email: "",
    phone: "",
    lead_source: "Website",
    assigned_salesperson: "",
    status: "New",
    estimated_value: "",
  };

  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [salespersonFilter, setSalespersonFilter] = useState("");

  const fetchLeads = async () => {
    const res = await axios.get("http://localhost:5000/api/leads", {
      headers: { Authorization: token },
    });
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveLead = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`http://localhost:5000/api/leads/${editId}`, form, {
        headers: { Authorization: token },
      });
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/api/leads", form, {
        headers: { Authorization: token },
      });
    }

    setForm(emptyForm);
    fetchLeads();
  };

  const editLead = (lead) => {
    setEditId(lead.id);
    setForm({
      lead_name: lead.lead_name,
      company_name: lead.company_name,
      email: lead.email,
      phone: lead.phone,
      lead_source: lead.lead_source,
      assigned_salesperson: lead.assigned_salesperson,
      status: lead.status,
      estimated_value: lead.estimated_value,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  const deleteLead = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    await axios.delete(`http://localhost:5000/api/leads/${id}`, {
      headers: { Authorization: token },
    });

    fetchLeads();
  };

  const filteredLeads = leads.filter((lead) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      lead.lead_name?.toLowerCase().includes(searchText) ||
      lead.company_name?.toLowerCase().includes(searchText) ||
      lead.email?.toLowerCase().includes(searchText);

    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    const matchesSource = sourceFilter ? lead.lead_source === sourceFilter : true;
    const matchesSalesperson = salespersonFilter
      ? lead.assigned_salesperson === salespersonFilter
      : true;

    return matchesSearch && matchesStatus && matchesSource && matchesSalesperson;
  });

  const salespeople = [
    ...new Set(leads.map((lead) => lead.assigned_salesperson).filter(Boolean)),
  ];

  return (
    <Layout>
      <div className="dashboard-header">
        <h1 className="page-title">Lead Management</h1>
        <p className="subtitle">Manage, track and convert your business opportunities.</p>
      </div>

      <div className="form-card">
        <h2 style={{ marginBottom: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ph-bold ph-plus-circle" style={{ color: 'var(--primary)' }}></i>
          {editId ? "Edit Lead Details" : "Create New Lead"}
        </h2>

        <form onSubmit={saveLead}>
          <div className="form-grid">
            <div className="form-group">
              <label>Lead Name</label>
              <input
                name="lead_name"
                placeholder="John Doe"
                value={form.lead_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Company</label>
              <input
                name="company_name"
                placeholder="Acme Corp"
                value={form.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                placeholder="+1 234 567 890"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Source</label>
              <select
                name="lead_source"
                value={form.lead_source}
                onChange={handleChange}
              >
                <option>Website</option>
                <option>LinkedIn</option>
                <option>Referral</option>
                <option>Cold Email</option>
                <option>Event</option>
              </select>
            </div>

            <div className="form-group">
              <label>Salesperson</label>
              <input
                name="assigned_salesperson"
                placeholder="Assign to..."
                value={form.assigned_salesperson}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Proposal Sent</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
            </div>

            <div className="form-group">
              <label>Value (Rs.)</label>
              <input
                name="estimated_value"
                type="number"
                placeholder="50000"
                value={form.estimated_value}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button className="primary-btn" type="submit">
              <i className={editId ? "ph-bold ph-floppy-disk" : "ph-bold ph-plus"}></i>
              {editId ? "Update Lead" : "Add Lead"}
            </button>

            {editId && (
              <button type="button" className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="form-card" style={{ background: '#f1f5f9', border: 'none' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '16px' }}>Filters</h2>
        <div className="form-grid">
          <input
            placeholder="Search by name, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'white' }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ background: 'white' }}
          >
            <option value="">All Statuses</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Proposal Sent</option>
            <option>Won</option>
            <option>Lost</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            style={{ background: 'white' }}
          >
            <option value="">All Sources</option>
            <option>Website</option>
            <option>LinkedIn</option>
            <option>Referral</option>
            <option>Cold Email</option>
            <option>Event</option>
          </select>

          <select
            value={salespersonFilter}
            onChange={(e) => setSalespersonFilter(e.target.value)}
            style={{ background: 'white' }}
          >
            <option value="">All Salespersons</option>
            {salespeople.map((person) => (
              <option key={person}>{person}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-card">
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px' }}>Leads Directory</h2>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Showing {filteredLeads.length} leads</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Company</th>
                <th>Source</th>
                <th>Salesperson</th>
                <th>Status</th>
                <th>Value</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link className="action-link" to={`/leads/${lead.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {lead.lead_name.charAt(0)}
                      </div>
                      {lead.lead_name}
                    </Link>
                  </td>
                  <td>{lead.company_name}</td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                      {lead.lead_source}
                    </span>
                  </td>
                  <td>{lead.assigned_salesperson || 'Unassigned'}</td>
                  <td>
                    <span className={`status status-${lead.status.toLowerCase().replace(' ', '-')}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>Rs. {Number(lead.estimated_value).toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="edit-btn" onClick={() => editLead(lead)} title="Edit">
                        <i className="ph ph-pencil-simple"></i>
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteLead(lead.id)}
                        title="Delete"
                      >
                        <i className="ph ph-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <i className="ph ph-folder-open" style={{ fontSize: '48px', marginBottom: '10px', display: 'block' }}></i>
                    No leads found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Leads;