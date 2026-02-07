import "./StartingPage.css";
import { useNavigate } from "react-router-dom";
import user from "../assets/user.png";
export default function StartingPage() {
    const navigate = useNavigate();
    return (
        <div className="StartingWrapper"> 
            <h1 className="title">Welcome to Ticket Tracker</h1>
            <div className="StartingContainer">
                <div className="StartingCard" onClick={() => navigate("/AdminLogin") }>
                    <img src={user} alt="Logo" />
                    <h1 className="title">Admin</h1>
                </div>
                <div className="StartingCard" onClick={() => navigate("/Login") }>
                    <img src={user} alt="Logo" />
                    <h1 className="title">Developer</h1>
                </div>
            </div>
        </div>
    );
}        