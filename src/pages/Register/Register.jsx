import './Register.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/pixo2.png';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://pixo-backend-version-1-2.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrorMessage(data.message || "Error while registering");
      }
    } catch (error) {
      console.error("Error while registering:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login register">
        <img src={logo} />
        <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Register</button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="divider">
                <span className="divider-text">OR</span>
            </div>
            <p>Already have an account? <a href="/login">Login</a></p>
        </form>
    </div>
  );
}

export default Register;
