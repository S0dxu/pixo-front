import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

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
        const fetchUserImages = async () => {
            try {
                const username = getUsernameFromToken();
                if (!username) return;

                const response = await fetch(`https://pixo-backend-version-1-2.onrender.com/get-user-images/${username}`);
                if (!response.ok) throw new Error("Error retrieving images");

                const data = await response.json();
                setImages(data);
            } catch (error) {
                console.error("Errore:", error);
            }
        };

        fetchUserImages();
    }, []);

    const goToPlayer = (id) => {
        navigate(`/${id}`);
    };

    return (
        <div className='profile'>
            <div className="top">
                <img src="https://media.istockphoto.com/id/1320815200/photo/wall-black-background-for-design-stone-black-texture-background.jpg?s=612x612&w=0&k=20&c=hqcH1pKLCLn_ZQ5vUPUfi3BOqMWoBzbk5-61Xq7UMsU=" alt="" />
                <div className="right">
                    <h4>{getUsernameFromToken()}</h4>
                    <li>
                        <p><strong>0</strong> Following</p>
                        <p><strong>0</strong> Followers</p>
                        <p><strong>0</strong> Likes</p>
                    </li>
                    <p className='bio'>No bio yet.</p>
                </div>
            </div>
            <hr />
            <div className="bottom">
                {images.map((img) => (
                    <div key={img._id} className="image-container" onClick={() => goToPlayer(img._id)}>
                        <img src={img.url} alt={img.title} />
                        <p>
                            <svg className="like-icon" width="18" height="18" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path>
                            </svg>
                            183
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
