import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/pixo2.png';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("https://pixo-backend.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        navigate("/foryou");
      } else {
        setErrorMessage(data.message || "Authentication error");
      }
    } catch (error) {
      console.error("error while logging in:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login">
        <div>
            <img src={logo} />
            <form onSubmit={handleLogin}>
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
                <button type="submit">Log in</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
            <div className="divider">
                <span className="divider-text">OR</span>
            </div>
            <p>Don't have an account yet? <a href="/register">Register</a></p>
        </div>
    </div>
  );
}

export default Login;
