import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";

function LeadDetails() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const leadRes = await axios.get(`http://localhost:5000/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const notesRes = await axios.get(
          `http://localhost:5000/api/leads/${id}/notes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLead(leadRes.data);
        setNotes(notesRes.data);
      } catch (error) {
        console.error("Failed to fetch lead details:", error);
      }
    };

    fetchData();
  }, [id]);

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`http://localhost:5000/api/leads/${id}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(res.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `http://localhost:5000/api/leads/${id}/notes`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContent("");
      fetchNotes();
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  if (!lead) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className="dashboard-header">
        <Link to="/leads" className="action-link" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          <i className="ph ph-arrow-left"></i> Back to Leads
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
            {lead.lead_name.charAt(0)}
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: '4px' }}>{lead.lead_name}</h1>
            <span className={`status status-${lead.status.toLowerCase().replace(' ', '-')}`}>
              {lead.status}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="form-card">
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Lead Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="info-item">
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Company</label>
              <div style={{ fontWeight: '500' }}>{lead.company_name}</div>
            </div>
            <div className="info-item">
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Email Address</label>
              <div style={{ fontWeight: '500' }}>{lead.email}</div>
            </div>
            <div className="info-item">
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Phone</label>
              <div style={{ fontWeight: '500' }}>{lead.phone || 'N/A'}</div>
            </div>
            <div className="info-item">
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Source</label>
              <div style={{ fontWeight: '500' }}>{lead.lead_source}</div>
            </div>
            <div className="info-item">
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Assigned To</label>
              <div style={{ fontWeight: '500' }}>{lead.assigned_salesperson || 'Unassigned'}</div>
            </div>
            <div className="info-item">
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Estimated Value</label>
              <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '18px' }}>Rs. {Number(lead.estimated_value).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="form-card">
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Activity Timeline</h2>
            <form onSubmit={addNote} style={{ marginBottom: '24px' }}>
              <textarea
                className="note-box"
                placeholder="Log an activity or add a note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
              <button className="primary-btn" type="submit">
                <i className="ph-bold ph-paper-plane-right"></i> Add Note
              </button>
            </form>

            <div className="notes-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notes.map((note) => (
                <div className="note-card" key={note.id} style={{ margin: 0, background: '#f8fafc', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '14px', marginBottom: '8px' }}>{note.content}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <small style={{ color: 'var(--text-muted)' }}>
                      <i className="ph ph-user"></i> {note.created_by}
                    </small>
                    <small style={{ color: 'var(--text-muted)' }}>
                      <i className="ph ph-calendar"></i> {new Date(note.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}

              {notes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                   <i className="ph ph-chat-centered-dots" style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}></i>
                   No activities logged yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LeadDetails;