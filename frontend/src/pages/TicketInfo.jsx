import { useParams } from "react-router-dom";
import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./TicketInfo.css";
export default function TicketInfo({ tickets, points }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flag, setFlag] = useState(1);
  const ticket = tickets.find((t) => t.id === Number(id));
  const [desc, setDesc] = useState();
  const [file, setFile] = useState(null);
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    return `${import.meta.env.VITE_API_URL}/uploads/ticket_${filePath}.pdf`;
  };
  if (!ticket)
    return (
      <div style={{ marginTop: 100, color: "#fff" }}>Ticket not found</div>
    );
  const incrementPriority = (priority) => {
  const key = priority.toLowerCase(); // high | medium | low
  const current = parseInt(localStorage.getItem(key) || "0");
  localStorage.setItem(key, String(current + 1));
};

  async function handleSubmit() {
    if (!desc.trim()) {
      alert("Please add a solution description before submitting.");
      return;
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/show-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: ticket.id,
          name: ticket.name,
          client: ticket.client,
          points: ticket.points,
          problem: ticket.problem,
          solution: desc,
        }),
      });
      await fetch(`${import.meta.env.VITE_API_URL}/show-post`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: ticket.id,
        }),
      });
      await fetch(`${import.meta.env.VITE_API_URL}/show-points`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          points: ticket.points,
        }),
      });
      setFlag(0);
      alert("Ticket completed successfully");
      navigate("/completed");
    } catch (err) {
      console.error("Error:", err);
      alert("Error completing ticket");
    }
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${import.meta.env.VITE_API_URL}/upload-dev-file`, {
      method: "POST",
      body: formData,
    });
    if (ticket.priority === "High") incrementPriority("High");
else if (ticket.priority === "Medium") incrementPriority("Medium");
else if (ticket.priority === "Low") incrementPriority("Low");

  }
  console.log(localStorage.getItem("high"), localStorage.getItem("medium"), localStorage.getItem("low"));
  return (
    <div
      className="ticketinfo-container"
      style={{ marginTop: 30, padding: 20 }}
    >
      <Navbar points={points}/>
      <h1>{ticket.name}</h1>
      <p>
        <b>Client:</b> {ticket.client}
      </p>
      <p>
        <b>Priority:</b> {ticket.priority}
      </p>
      <p>
        <b>Points:</b> {ticket.points}
      </p>
      <div className="button-group">
        <button
          className="submit-btn"
          onClick={() => fetch(`${import.meta.env.VITE_API_URL}/open-vscode`)}
        >
          Open Editor
        </button>
        <button
          className="submit-btn"
          onClick={() => {
            const url = getFileUrl(6);
            if (url) window.open(url);
            else alert("File not available");
          }}
        >
          Report
        </button>
      </div>
      <h3>Problem</h3>
      <div className="problem-box">{ticket.problem}</div>
      {flag == 1 ? (
        <>
          <h3>Solution</h3>
          <textarea
            rows="6"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <h3>Upload Solution Report</h3>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="problem-box" />
          <div style={{ marginTop: 12 }}>
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
            <button
              className="submit-btn"
              style={{ marginLeft: 10 }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </>
      ) : desc ? (
        <>
          <h3>Solution (saved)</h3>
          <div className="solution-text">{desc}</div>
          <div style={{ marginTop: 12 }}>
            <button className="submit-btn" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>Solution (saved)</h3>
          <div className="solution-text">{desc}</div>
        </>
      )}
    </div>
  );
}
