import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      setMessage("Fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    setMessage(data.message);

    if (data.success) {
      navigate("/");
    }
  };
  return (
<div className="login-wrapper">
  <div className="login-card">
    <h2 className="login-title">Create Account</h2>
    <p className="login-subtitle">Register to get started</p>

    <input
      type="text"
      placeholder="Username"
      onChange={(e) => setUsername(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
    />

    <input
      type="text"
      placeholder="Confirm Password"
      onChange={(e) => setConfirmPassword(e.target.value)}
    />

    {message && <p className="login-message">{message}</p>}

    <button onClick={handleRegister}>Register</button>

    <p className="login-footer">
      Already have an account? <a href="/">Login</a>
    </p>
  </div>
</div>);
}
export default Register;