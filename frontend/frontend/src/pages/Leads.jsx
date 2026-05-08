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
      <h1 className="page-title">Lead Management</h1>

      <div className="form-card">
        <h2>{editId ? "Edit Lead" : "Create New Lead"}</h2>

        <form onSubmit={saveLead}>
          <div className="form-grid">
            <input
              name="lead_name"
              placeholder="Lead Name"
              value={form.lead_name}
              onChange={handleChange}
              required
            />

            <input
              name="company_name"
              placeholder="Company Name"
              value={form.company_name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

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

            <input
              name="assigned_salesperson"
              placeholder="Assigned Salesperson"
              value={form.assigned_salesperson}
              onChange={handleChange}
            />

            <select name="status" value={form.status} onChange={handleChange}>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Proposal Sent</option>
              <option>Won</option>
              <option>Lost</option>
            </select>

            <input
              name="estimated_value"
              type="number"
              placeholder="Estimated Deal Value"
              value={form.estimated_value}
              onChange={handleChange}
            />
          </div>

          <button className="primary-btn" type="submit">
            {editId ? "Update Lead" : "Add Lead"}
          </button>

          {editId && (
            <button type="button" className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="form-card">
        <h2>Search and Filter</h2>

        <div className="form-grid">
          <input
            placeholder="Search by lead, company, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
          >
            <option value="">All Salespersons</option>
            {salespeople.map((person) => (
              <option key={person}>{person}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-card">
        <h2>All Leads</h2>

        <table>
          <thead>
            <tr>
              <th>Lead</th>
              <th>Company</th>
              <th>Email</th>
              <th>Source</th>
              <th>Salesperson</th>
              <th>Status</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <Link className="action-link" to={`/leads/${lead.id}`}>
                    {lead.lead_name}
                  </Link>
                </td>
                <td>{lead.company_name}</td>
                <td>{lead.email}</td>
                <td>{lead.lead_source}</td>
                <td>{lead.assigned_salesperson}</td>
                <td>
                  <span className="status">{lead.status}</span>
                </td>
                <td>Rs. {lead.estimated_value}</td>
                <td>
                  <button className="edit-btn" onClick={() => editLead(lead)}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteLead(lead.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan="8">No leads found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Leads;