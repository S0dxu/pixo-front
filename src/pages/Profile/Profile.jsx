import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const { username } = useParams();
    const [images, setImages] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [isOwner, setIsOwner] = useState(false);
    const [error, setError] = useState(false);
    
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
        const currentUsername = getUsernameFromToken();
        if (currentUsername === username) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
    }, [username]);
    useEffect(() => {
        if (!username) return;
      
        const fetchData = async () => {
          try {
            const [userResponse, imagesResponse] = await Promise.all([
              fetch(`https://pixo-backend-version-1-2.onrender.com/get-user-by-id/profile/${username}`),
              fetch(`https://pixo-backend-version-1-2.onrender.com/get-user-images/${username}`)
            ]);
            setError(false);
            if (!userResponse.ok) {
                setError(true);
                return;
            };
            
            setUser(await userResponse.json());
            setImages(await imagesResponse.json());
          } catch (error) {
            console.error("Error:", error);
          }
        };
      
        fetchData();
      }, [username, navigate]);
    
    if (error) {
        return <div className="user-not-found">
            <p><svg width="90" data-e2e="" height="90" viewBox="0 0 72 72" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M16.6276 20.2241C16.6276 30.8074 25.2394 39.4192 35.8227 39.4192C46.4059 39.4192 55.0178 30.8074 55.0178 20.2241C55.0178 9.64086 46.4059 1.02899 35.8227 1.02899C25.2394 1.02899 16.6276 9.64086 16.6276 20.2241ZM19.7405 20.2244C19.7405 11.3583 26.9568 4.14202 35.8229 4.14202C44.689 4.14202 51.9053 11.3583 51.9053 20.2244C51.9053 29.0905 44.689 36.3068 35.8229 36.3068C26.9568 36.3068 19.7405 29.0905 19.7405 20.2244Z"></path><path d="M6.69813 70.9717C6.56844 70.9717 6.43874 70.9562 6.30904 70.9199C5.47898 70.7072 4.97576 69.8563 5.19365 69.0263C8.79922 55.045 21.3954 45.2762 35.8228 45.2762C50.2503 45.2762 62.8465 55.0398 66.4572 69.0211C66.6699 69.8512 66.1719 70.702 65.3366 70.9147C64.5014 71.1326 63.6558 70.6293 63.4379 69.7941C60.1851 57.1876 48.8288 48.3837 35.8176 48.3837C22.8117 48.3837 11.4554 57.1876 8.19743 69.7941C8.02104 70.5048 7.39331 70.9717 6.69813 70.9717Z"></path></svg></p>
            <h1>This account cannot be found</h1>
        </div>;
    }
    
    const goToPlayer = (imageId) => {
        navigate(`/${imageId}`);
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!user) return <></>;

    return (
        <div className="profile">
            <div className="top">
                <button className={`logout ${!isOwner ? 'invisible-logout-button' : ''}`} onClick={logout}>Log Out</button>
                <img src="https://media.istockphoto.com/id/1320815200/photo/wall-black-background-for-design-stone-black-texture-background.jpg?s=612x612&w=0&k=20&c=hqcH1pKLCLn_ZQ5vUPUfi3BOqMWoBzbk5-61Xq7UMsU=" alt="" />
                <div className="right">
                    <h4>{user.username}</h4>
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
                            0
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
