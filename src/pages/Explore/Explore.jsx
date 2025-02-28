import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Explore.css';

const Explore = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const videoRefs = useRef([]);

    // Recupera tutte le immagini e le ordina per data decrescente (le più recenti prima)
    const fetchImagesSortedByDate = async () => {
        try {
        const response = await fetch("https://pixo-backend-version-1-2.onrender.com/get-all-images");
        if (!response.ok) throw new Error("Error fetching images");
        const data = await response.json();
        // Ordina per data: le immagini con data maggiore (più recenti) prima
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setImages(data);
        } catch (error) {
        console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchImagesSortedByDate();
    }, []);

    const goToPlayer = (id) => {
        navigate(`/${id}`);
    };

    const autoplay = (index) => {
        if (videoRefs.current[index]) {
        videoRefs.current[index].play();
        }
    };

    const stop = (index) => {
        if (videoRefs.current[index]) {
        videoRefs.current[index].pause();
        }
    };

    return (
        <div className="explore">
            {images.map((img, index) => (
                <div
                    key={img._id}
                    className="image-container"
                    onClick={() => goToPlayer(img._id)}
                >
                    {img.url.endsWith(".mp4") ? (
                        <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            muted
                            loop
                            onMouseEnter={() => autoplay(index)}
                            onMouseLeave={() => stop(index)}
                            >
                            <source src={img.url} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            src={img.url}
                            alt=""
                            onLoad={(e) => {
                                e.target.src = '';
                                e.target.src = img.url;
                            }}
                        />
                    )}
                    <p>
                            <svg
                                className="like-icon"
                                width="18"
                                height="18"
                                viewBox="0 0 48 48"
                                fill="#fff"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"
                                />
                            </svg>
                        {img.views}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Explore;
