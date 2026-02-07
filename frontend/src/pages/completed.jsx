
import "./completed.css"
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

export default function Completed({ points}) {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/completed`)
      .then(res => res.json())
      .then(data => setCompleted(data));
  }, []);

  return (
    <div className="page-container" style={{ marginTop: 50, padding: 20, background: "none"}}>
      <Navbar points={points}/>
      <h2 className="page-title">Completed Tickets</h2>
      <div className="list">
        {completed.length === 0 ? (
          <p style={{ color: "#fff" }}>No completed tickets yet.</p>
        ) : (
          completed.map(t => (
            <div key={t.id} className="completed-item">
              <div className="completed-header">
                <div>ID: {t.id}</div>
                <div>Problem: <b>{t.name}</b></div>
                <div>Client:<b> {t.client}</b></div>
                <div>{t.points} pts</div>
                <div>
                <button className="submit-btn" onClick={()=>{window.open(`${import.meta.env.VITE_API_URL}/uploads/ticket_${6}.pdf`);}}>Problem</button>
                <button className="submit-btn" onClick={()=>{window.open(`${import.meta.env.VITE_API_URL}/uploads/developer/ticket_${7}.pdf`);}}>File Report</button>
                </div>
              </div>
              <div className="completed-body">
                <div className="problem-box">{t.problem}</div>
                <div className="solution-text">{t.solution}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
