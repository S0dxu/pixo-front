import './Register.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/pixo2.png';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".gif")) {
        setErrorMessage("GIF images are not supported.");
        return;
      }

      setImagePreview(URL.createObjectURL(file));
      setErrorMessage("");

      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      setIsUploading(false);

      if (imageUrl.startsWith("http")) {
        setImage(imageUrl);
      } else {
        setErrorMessage("Error uploading image.");
      }
    }
  };

  async function uploadImage(file) {
    const url = "https://api.imgur.com/3/upload";
    const headers = {
      "Authorization": `Client-ID ${import.meta.env.VITE_API_CLIENT_ID}`
    };

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: formData
      });

      const data = await response.json();
      return data.success ? data.data.link : "error uploading image";
    } catch (error) {
      console.error("Image upload error:", error);
      return "error uploading image";
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    if (image) formData.append("picture", image);

    const requestBody = {
      username,
      password,
      picture: image,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
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
      <img src={logo} alt="logo" />
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
        
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleImageChange}
        />
        <label htmlFor="file-input" className="file-label">Choose a profile picture</label>

        {imagePreview && !isUploading && (
          <div className="image-preview">
            <img src={imagePreview} alt="preview" />
          </div>
        )}

        <button type="submit" disabled={isUploading}>Register</button>

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