import AdminNavbar from "../components/AdminNavbar";
import "./Adminhome.css";
import { useState } from "react";
export default function AdminHome() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [points, setPoints] = useState("");
  const [problem, setProblem] = useState("");
  const [priority, setPriority] = useState("");
  const [file, setFile] = useState(null);
  async function handlesubmit() {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin-home`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          name: name,
          client: client,
          points: points,
          problem: problem,
          priority: priority,
        }),
      });
      if (!file) return alert("Select a file");
      const formData = new FormData();
      formData.append("file", file);
      await fetch(`${import.meta.env.VITE_API_URL}/upload-dev-files`, {
        method: "POST",
        body: formData,
      });
      alert("Ticket submitted successfully");
      setId("");
      setName("");
      setClient("");
      setPoints("");
      setProblem("");
      setPriority("");
      setFile(null);
    } catch (err) {
      console.log("Error occurred", err);
      alert("Error submitting the ticket. Please try again.");
    }
  }
  return (
    <div className="admin-home">
      <AdminNavbar/>
      <div className="ticket-container">
        <h2 className="ticket-title">Ticket Information</h2>
        <form className="ticket-form">
          <div className="two-inputs">
            <div className="form-group">
              <label htmlFor="id">Ticket ID:</label>
              <input
                id="id"
                type="number"
                placeholder="Enter ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="two-inputs">
            <div className="form-group">
              <label htmlFor="client">Client:</label>
              <input
                id="client"
                type="text"
                placeholder="Enter Client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="points">Points:</label>
              <input
                id="points"
                type="number"
                placeholder="Enter Points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="problem">Problem:</label>
            <input
              id="problem"
              type="text"
              placeholder="Describe Problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
            />
          </div>
          <div className="two-inputs">
          <div className="form-group">
            <label>Priority</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="Low"
                  checked={priority === "Low"}
                  onChange={(e) => setPriority(e.target.value)}
                />
                Low
              </label>

              <label>
                <input
                  type="radio"
                  name="priority"
                  value="Medium"
                  checked={priority === "Medium"}
                  onChange={(e) => setPriority(e.target.value)}
                />
                Medium
              </label>

              <label>
                <input
                  type="radio"
                  name="priority"
                  value="High"
                  checked={priority === "High"}
                  onChange={(e) => setPriority(e.target.value)}
                />
                High
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="report">Report:</label>
            <input
              type="file"
              id="report"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          </div>
          
          <button type="button" className="submit-btn" onClick={handlesubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
