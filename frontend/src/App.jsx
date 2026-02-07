import { useState, useMemo} from "react";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
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
  
useEffect(() => {
  if (localStorage.getItem("high") === null) {
    localStorage.setItem("high", "0");
    localStorage.setItem("medium", "0");
    localStorage.setItem("low", "0");
  }
}, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/show`)
      .then(res => res.json())
      .then(tickets => setTickets(tickets));
      //console.log(tickets);
  }, [tickets]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/show-points`)
      .then(res => res.json())
      .then(data => setPoints(data));
  }, [tickets]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const handleSearch = (text) => setSearchTerm(text);
  const handlePriority = (p) => setPriorityFilter(p);
  const filteredNotComplete = useMemo(() => {
    return tickets
      .filter(t => (searchTerm ? t.client.toLowerCase().includes(searchTerm.toLowerCase()) : true))
      .filter(t => (priorityFilter ? t.priority === priorityFilter : true));
  }, [tickets, searchTerm, priorityFilter]);
  return (
    <>
      <Routes>
        <Route path="/" element={<StartingPage/>} />
        <Route path="/Adminlogin" element={<AdminLogin />} />
        <Route path="/Adminhome" element={<AdminHome />} />
        <Route path="/Admincompleted" element={<AdminCompleted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Home" element={<Home tickets={filteredNotComplete}        
        points={points}
        onSearch={handleSearch}
        onPriority={handlePriority}/>}/>
        <Route
          path="/ticket/:id"
          element={<TicketInfo tickets={tickets} points={points}/>}
        />
        <Route path="/completed" element={<Completed points={points} />}
        />
      </Routes>
    </>
  );
}


