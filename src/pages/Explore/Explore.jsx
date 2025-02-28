import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Explore.css';

const Explore = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const videoRefs = useRef([]);

    const fetchImages = async () => {
        try {
            const response = await fetch(`https://pixo-backend-version-1-2.onrender.com/get-all-images?page=${page}&limit=10`);
            if (!response.ok) throw new Error("Errore nel recupero delle immagini");
            const data = await response.json();

            if (data.length < 10) {
                setHasMore(false);
            }

            setImages(prevImages => [...prevImages, ...data]);
        } catch (error) {
            console.error("Errore:", error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, [page]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10 && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }, [hasMore]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

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
            <div className="search-container">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 17L21 21" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#fff" strokeWidth="2" />
                </svg>
                <input type="text" className="search-input" placeholder="Search" />
                <button class="dots"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 12H18.01M12 12H12.01M6 12H6.01M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12ZM7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
            </div>

            {images.map((img, index) => (
                <div key={img._id} className="image-containera" onClick={() => goToPlayer(img._id)}>
                    {img.url.toLowerCase().endsWith(".mp4") ? (
                        <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            muted
                            loop
                            onMouseEnter={() => autoplay(index)}
                            onMouseLeave={() => stop(index)}
                        >
                            <source src={img.url} type="video/mp4" />
                            Il tuo browser non supporta il video.
                        </video>
                    ) : (
                        <img src={img.url} alt="Immagine" />
                    )}
                </div>
            ))}

            {hasMore && <p className="loading-text"></p>}
        </div>
    );
};

export default Explore;
