import { React, useState, useEffect } from 'react';
import './Sidebar.css';
import { Link, useLocation, useParams } from 'react-router-dom';
import profileimg from '../../assets/profileimg.png';
import { jwtDecode } from "jwt-decode";

const Sidebar = ({ isOpen }) => {
    const loc = useLocation();
    const { id } = useParams();
    const [profilePicture, setProfilePicture] = useState('https://exoffender.org/wp-content/uploads/2016/09/empty-profile.png');

    const getUsernameFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken?.username || "";
            } catch (error) {
                console.error("Errore white taking the token:", error);
            }
        }
        return "";
    };

    useEffect(() => {
        const username = getUsernameFromToken();
        if (username) {
          fetch(`https://pixo-backend-version-1-2.onrender.com/get-user-by-id/profile/${username}`)
            .then(response => response.json())
            .then(data => {
              if (data.picture) {
                setProfilePicture(data.picture);
              }
            })
        }
      }, []);

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <ul className='act'>
                {/* <li className='search'>
                    <svg fill="currentColor" viewBox="0 -20 50 90" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fillRule="evenodd" clipRule="evenodd" d="M21.83 7.5a14.34 14.34 0 1 1 0 28.68 14.34 14.34 0 0 1 0-28.68Zm0-4a18.33 18.33 0 1 0 11.48 32.64l8.9 8.9a1 1 0 0 0 1.42 0l1.4-1.41a1 1 0 0 0 0-1.42l-8.89-8.9A18.34 18.34 0 0 0 21.83 3.5Z"></path></svg>
                    <input type="text" placeholder='Search' />
                </li> */}
                <Link to="/foryou" className={`sidebar-link ${loc.pathname == "/foryou" || loc.pathname == "/" || /^\/[0-9a-fA-F]{24}$/.test(loc.pathname) ? "active" : ""}`}>
                    <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M23.0484 7.84003C23.6014 7.38666 24.3975 7.38666 24.9504 7.84001L41.051 21.04C41.5411 21.4418 41.7258 22.1082 41.5125 22.705C41.2991 23.3017 40.7338 23.7 40.1 23.7H37.769L36.5769 36.7278C36.4592 38.0149 35.3798 39 34.0873 39H13.9127C12.6202 39 11.5409 38.0149 11.4231 36.7278L10.231 23.7H7.89943C7.2657 23.7 6.70035 23.3017 6.487 22.705C6.27364 22.1083 6.45833 21.4418 6.9484 21.04L23.0484 7.84003ZM23.9995 10.9397L12.0948 20.7H12.969L14.369 36H22.4994V28.3138C22.4994 27.7616 22.9471 27.3138 23.4994 27.3138H24.4994C25.0517 27.3138 25.4994 27.7616 25.4994 28.3138V36H33.631L35.031 20.7H35.9045L23.9995 10.9397Z"></path>
                    </svg>
                    <p>For You</p>
                </Link>
                <Link to="/explore" className={`sidebar-link ${loc.pathname == "/explore" ? "active" : ""}`}>
                    <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M24 37.4a13.4 13.4 0 1 0 0-26.8 13.4 13.4 0 0 0 0 26.8ZM40.5 24a16.5 16.5 0 1 1-33 0 16.5 16.5 0 0 1 33 0Z"></path><path d="M27.13 27.18 19 32.1a.6.6 0 0 1-.9-.63l1.84-9.33a2 2 0 0 1 .92-1.32L29 15.9a.6.6 0 0 1 .9.63l-1.84 9.33a2 2 0 0 1-.93 1.32Zm-5.04-.45 3.11-1.89.7-3.57-3.1 1.89-.7 3.57Z"></path></svg>
                    <p>Explore</p>
                </Link>
                {/* <Link to="/activity" className={`sidebar-link ${loc.pathname == "/activity" ? "active" : ""}`}>
                    <svg width="1em" data-e2e="" height="1em" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0362 21.3333H18.5243L15.9983 24.4208L13.4721 21.3333H7.96047L7.99557 8H24.0009L24.0362 21.3333ZM24.3705 23.3333H19.4721L17.2883 26.0026C16.6215 26.8176 15.3753 26.8176 14.7084 26.0026L12.5243 23.3333H7.62626C6.70407 23.3333 5.95717 22.5845 5.9596 21.6623L5.99646 7.66228C5.99887 6.74352 6.74435 6 7.66312 6H24.3333C25.2521 6 25.9975 6.7435 26 7.66224L26.0371 21.6622C26.0396 22.5844 25.2927 23.3333 24.3705 23.3333ZM12.6647 14C12.2965 14 11.998 14.2985 11.998 14.6667V15.3333C11.998 15.7015 12.2965 16 12.6647 16H19.3313C19.6995 16 19.998 15.7015 19.998 15.3333V14.6667C19.998 14.2985 19.6995 14 19.3313 14H12.6647Z"></path></svg>
                    <p>Activity</p>
                </Link> */}
                <Link to="/create" className={`sidebar-link ${loc.pathname == "/create" || loc.pathname == "/upload" ? "active" : ""}`}>
                    <svg fill="currentColor" viewBox="0 -4 48 64" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M25 15a1 1 0 0 1 1 1v6h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-6v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6h-6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h6v-6a1 1 0 0 1 1-1h2Z"></path><path d="M33.58 4.5H14.42c-1.33 0-2.45 0-3.37.07-.95.08-1.86.25-2.73.7a7 7 0 0 0-3.06 3.05 7.14 7.14 0 0 0-.69 2.73 44.6 44.6 0 0 0-.07 3.37v19.16c0 1.33 0 2.45.07 3.37.08.95.25 1.86.7 2.73a7 7 0 0 0 3.05 3.06c.87.44 1.78.6 2.73.69.92.07 2.04.07 3.37.07h19.16c1.33 0 2.45 0 3.37-.07a7.14 7.14 0 0 0 2.73-.7 7 7 0 0 0 3.06-3.05c.44-.87.6-1.78.69-2.73.07-.92.07-2.04.07-3.37V14.42c0-1.33 0-2.45-.07-3.37a7.14 7.14 0 0 0-.7-2.73 7 7 0 0 0-3.05-3.06 7.14 7.14 0 0 0-2.73-.69 44.6 44.6 0 0 0-3.37-.07ZM10.14 8.83c.2-.1.53-.21 1.24-.27.73-.06 1.69-.06 3.12-.06h19c1.43 0 2.39 0 3.12.06a3.3 3.3 0 0 1 1.24.27 3 3 0 0 1 1.31 1.3c.1.21.21.54.27 1.25.06.73.06 1.69.06 3.12v19c0 1.43 0 2.39-.06 3.12a3.3 3.3 0 0 1-.27 1.24 3 3 0 0 1-1.3 1.31c-.21.1-.54.21-1.25.27-.73.06-1.69.06-3.12.06h-19c-1.43 0-2.39 0-3.12-.06a3.3 3.3 0 0 1-1.24-.27 3 3 0 0 1-1.31-1.3c-.1-.21-.21-.54-.27-1.25-.06-.73-.06-1.69-.06-3.12v-19c0-1.43 0-2.39.06-3.12a3.3 3.3 0 0 1 .27-1.24 3 3 0 0 1 1.3-1.31Z"></path></svg>
                    <p>Create</p>
                </Link>
                <Link to={`/profile/${getUsernameFromToken()}`} className={`sidebar-link profile-svg ${loc.pathname == "/profile" || loc.pathname == `/profile/${getUsernameFromToken()}` ? "active" : ""}`}>
                        {/* <img src={profileimg} alt="" /> */}
                        {profilePicture ? (<img src={profilePicture} />) : (<img src="https://exoffender.org/wp-content/uploads/2016/09/empty-profile.png" />)}
                        {/* <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9ZM15.8243 13.6235C17.1533 12.523 18 10.8604 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 10.8604 6.84668 12.523 8.17572 13.6235C4.98421 14.7459 3 17.2474 3 20C3 20.5523 3.44772 21 4 21C4.55228 21 5 20.5523 5 20C5 17.7306 7.3553 15 12 15C16.6447 15 19 17.7306 19 20C19 20.5523 19.4477 21 20 21C20.5523 21 21 20.5523 21 20C21 17.2474 19.0158 14.7459 15.8243 13.6235Z" fill="#000000"></path> </g></svg> */}
                    <p>Profile</p>
                </Link>
                {/* <hr /> */}
            </ul>
            {/* <ul>
                <li>
                    <p style={{ color: "#50525a" }}>Accounts followed</p>
                </li>
            </ul> */}
            <ul className='act sm'>
                {/* <li>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="#0F0F0F"></path> </g></svg>
                    <p>Other</p>
                </li> */}
                <hr />
            </ul>
            <ul className='act2'>
                <li>Company</li>
                <li>Program</li>
                <li>Terms and Policies</li>
                <li>© 2025 Pixo</li>
            </ul>
        </div>
    );
}

export default Sidebar;