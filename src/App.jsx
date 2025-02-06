/* import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Player from './components/Player/Player';
import ForYou from './pages/ForYou/ForYou';
import Explore from './pages/Explore/Explore';
import Home from './pages/Home/Home';
import Create from './pages/Create/Create';
import Upload from './pages/Upload/Upload';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import MobileNavbar from './components/MobileNavbar/MobileNavbar';
import { useEffect } from "react";

function App() {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/foryou" element={<ForYou />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/activity" element={<Explore />} />
          <Route path="/create" element={<Create />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Explore />} />
          <Route path="/:id" element={<Player />} />
        </Routes>
      </div>
      <MobileNavbar />
    </Router>
  );
}

export default App;
 */


import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate  } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Player from "./components/Player/Player";
import ForYou from "./pages/ForYou/ForYou";
import Explore from "./pages/Explore/Explore";
import Home from "./pages/Home/Home";
import Create from "./pages/Create/Create";
import Upload from "./pages/Upload/Upload";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MobileNavbar from "./components/MobileNavbar/MobileNavbar";
import Profile from "./pages/Profile/Profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <AuthHandler />
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/foryou" />} />
          <Route path="/foryou" element={<ForYou />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create" element={<Create />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:id" element={<Player />} />
        </Routes>
      </div>
      <MobileNavbar />
    </Router>
  );
}

function AuthHandler() {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/register") {
      navigate("/login");
    }
    else if (isAuthenticated && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/foryou");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return null;
}

export default App;
