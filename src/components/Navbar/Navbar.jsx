import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/pixo2.png';
import not from '../../assets/notification-alarm-bell-svgrepo-com.svg';
import profileimg from '../../assets/profileimg.png';
import Sidebar from '../Sidebar/Sidebar';

const Navbar = () => {
    const loc = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="navbar">
            <div className="left">
                <svg onClick={toggleSidebar} xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
                    <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"></path>
                </svg>
                <img src={logo} />
            </div>
            <div className="right">
                <Link to="/create" className="create-btn" >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"><path d="M6 12h6V6h1v6h6v1h-6v6h-1v-6H6z">
                            </path><path fill="none" d="M0 0h24v24H0z"></path>
                        </g>
                    </svg>
                    <p>Create</p>
                </Link>
                <div className="notify">
                    <img  src={not} alt="" />
                    <span>9+</span>
                </div>
                <img className='profile-pic' src={profileimg} alt="" />
            </div>

            <Sidebar isOpen={isSidebarOpen} />
        </div>
    );
}

export default Navbar;