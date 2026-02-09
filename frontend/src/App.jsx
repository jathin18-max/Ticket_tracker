import { useState, useMemo, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TicketInfo from "./pages/TicketInfo";
import Completed from "./pages/Completed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminCompleted from "./pages/Admincompleted";
import AdminHome from "./pages/Adminhome";
import AdminLogin from "./pages/AdminLogin";
import StartingPage from "./pages/StartingPage";

export default function App() {
  const [points, setPoints] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  /* =========================
     INIT LOCAL STORAGE
     ========================= */
  useEffect(() => {
    if (localStorage.getItem("high") === null) {
      localStorage.setItem("high", "0");
      localStorage.setItem("medium", "0");
      localStorage.setItem("low", "0");
    }
  }, []);

  /* =========================
     FETCH TICKETS (ONCE)
     ========================= */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/show`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tickets");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTickets(data);
        } else {
          setTickets([]);
        }
      })
      .catch((err) => {
        console.error("Tickets fetch error:", err);
        setTickets([]);
      });
  }, []); // ✅ FIXED (NO tickets dependency)

  /* =========================
     FETCH POINTS
     ========================= */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/show-points`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch points");
        return res.json();
      })
      .then((data) => {
        setPoints(Number(data) || 0);
      })
      .catch((err) => {
        console.error("Points fetch error:", err);
        setPoints(0);
      });
  }, []);

  /* =========================
     FILTER TICKETS (SAFE)
     ========================= */
  const filteredNotComplete = useMemo(() => {
    if (!Array.isArray(tickets)) return [];

    return tickets
      .filter((t) =>
        searchTerm
          ? t.client?.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .filter((t) =>
        priorityFilter ? t.priority === priorityFilter : true
      );
  }, [tickets, searchTerm, priorityFilter]);

  /* =========================
     HANDLERS
     ========================= */
  const handleSearch = (text) => setSearchTerm(text);
  const handlePriority = (p) => setPriorityFilter(p);

  /* =========================
     ROUTES
     ========================= */
  return (
    <Routes>
      <Route path="/" element={<StartingPage />} />
      <Route path="/Adminlogin" element={<AdminLogin />} />
      <Route path="/Adminhome" element={<AdminHome />} />
      <Route path="/Admincompleted" element={<AdminCompleted />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/Home"
        element={
          <Home
            tickets={filteredNotComplete}
            points={points}
            onSearch={handleSearch}
            onPriority={handlePriority}
          />
        }
      />
      <Route
        path="/ticket/:id"
        element={<TicketInfo tickets={tickets} points={points} />}
      />
      <Route path="/completed" element={<Completed points={points} />} />
    </Routes>
  );
}