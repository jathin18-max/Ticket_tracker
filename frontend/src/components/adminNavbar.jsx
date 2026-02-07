import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import user from "../assets/user.png";
export default function AdminNavbar() {
  const [adminshowProfile, setadminShowProfile] = useState(false);
  return (
    <>
      <div className="navbar">
        <div className="titleName">Ticket Tracker</div>
        <div className="nav-links">
          <Link to="/AdminHome">Home</Link>
          <Link to="/Admincompleted">Completed</Link>
        </div>
        <div className="profile">
          <img src={user} className="profile_img" onClick={() => setadminShowProfile(true)} />
        </div>
      </div>
      {adminshowProfile && (
        <div className="profile_popup" onClick={() => setadminShowProfile(false)}>
          <div className="profile_box" onClick={(e) => e.stopPropagation()}>
            <div className="profilephoto">
              <img src={user} alt="me" />
            </div>
            <div className="profile_info">
              <p>Name: <b>Kamal</b></p>
              <p>Role: <b>Admin</b></p>
            </div>
            <div className="two-items">
            <button className="close_btn2"><Link to="/">Logout</Link></button>
            <button className="close_btn" onClick={() => setadminShowProfile(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
