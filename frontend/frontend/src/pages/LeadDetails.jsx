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
      <Link to="/leads">← Back to Leads</Link>

      <h1 className="page-title">{lead.lead_name}</h1>

      <div className="form-card">
        <h2>Lead Details</h2>
        <p><b>Company:</b> {lead.company_name}</p>
        <p><b>Email:</b> {lead.email}</p>
        <p><b>Phone:</b> {lead.phone}</p>
        <p><b>Source:</b> {lead.lead_source}</p>
        <p><b>Salesperson:</b> {lead.assigned_salesperson}</p>
        <p><b>Status:</b> {lead.status}</p>
        <p><b>Estimated Value:</b> Rs. {lead.estimated_value}</p>
        <p><b>Created:</b> {lead.created_at}</p>
        <p><b>Last Updated:</b> {lead.updated_at}</p>
      </div>

      <div className="form-card">
        <h2>Add Note</h2>

        <form onSubmit={addNote}>
          <textarea
            className="note-box"
            placeholder="Enter note after call, email, meeting, or follow-up"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

          <button className="primary-btn" type="submit">
            Add Note
          </button>
        </form>
      </div>

      <div className="table-card">
        <h2>Notes</h2>

        {notes.map((note) => (
          <div className="note-card" key={note.id}>
            <p>{note.content}</p>
            <small>
              Created by {note.created_by} | {note.created_at}
            </small>
          </div>
        ))}

        {notes.length === 0 && <p>No notes added yet.</p>}
      </div>
    </Layout>
  );
}

export default LeadDetails;