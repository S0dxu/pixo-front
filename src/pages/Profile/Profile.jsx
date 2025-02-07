import React from 'react';
import './Profile.css';
import { jwtDecode } from "jwt-decode";
import profileimg from '../../assets/profileimg.png';

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
            <div className="top">
                <img /* src={profileimg} */ src="https://media.istockphoto.com/id/1320815200/photo/wall-black-background-for-design-stone-black-texture-background.jpg?s=612x612&w=0&k=20&c=hqcH1pKLCLn_ZQ5vUPUfi3BOqMWoBzbk5-61Xq7UMsU=" alt="" />
                <div className="right">
                    <h4>{getUsernameFromToken()}</h4>
                    <li>
                        <p><strong>38</strong> Following</p>
                        <p><strong>24</strong> Followers</p>
                        <p><strong>56</strong> Likes</p>
                    </li>
                    <p className='bio'>No bio yet.</p>
                </div>
            </div>
            <hr />
            <div className="bottom">
                <div>
                    <img src="https://i.imgur.com/GYl2iZ0.png" alt="" />
                    <p><svg class="like-icon css-h342g4-StyledPlay e148ts225" width="18" data-e2e="" height="18" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path></svg> 183</p>
                </div>
                <div>
                    <img src="https://i.imgur.com/GYl2iZ0.png" alt="" />
                    <p><svg class="like-icon css-h342g4-StyledPlay e148ts225" width="18" data-e2e="" height="18" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path></svg> 183</p>
                </div>
                <div>
                    <img src="https://i.imgur.com/GYl2iZ0.png" alt="" />
                    <p><svg class="like-icon css-h342g4-StyledPlay e148ts225" width="18" data-e2e="" height="18" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path></svg> 183</p>
                </div>
                <div>
                    <img src="https://i.imgur.com/GYl2iZ0.png" alt="" />
                    <p><svg class="like-icon css-h342g4-StyledPlay e148ts225" width="18" data-e2e="" height="18" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path></svg> 183</p>
                </div>
                <div>
                    <img src="https://i.imgur.com/GYl2iZ0.png" alt="" />
                    <p><svg class="like-icon css-h342g4-StyledPlay e148ts225" width="18" data-e2e="" height="18" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path></svg> 183</p>
                </div>
                <div>
                    <img src="https://i.imgur.com/GYl2iZ0.png" alt="" />
                    <p><svg class="like-icon css-h342g4-StyledPlay e148ts225" width="18" data-e2e="" height="18" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path></svg> 183</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
