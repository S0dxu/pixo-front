import React from 'react';
import './Profile.css';
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const getUsernameFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken?.username || "";
            } catch (error) {
                console.error("Error while decoding token:", error);
            }
        }
        return "";
    };
    return (
        <div className='profile'>
            {getUsernameFromToken()}
        </div>
    );
};

export default Profile;
