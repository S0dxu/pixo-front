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
            if (!response.ok) throw new Error("error getting images");
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
{/*                 <button class="dots"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 12H18.01M12 12H12.01M6 12H6.01M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12ZM7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
 */}        </div>

            {images.map((img, index) => (
                <div key={`${img._id}-${index}`} className="image-containera" onClick={() => goToPlayer(img._id)}>
                    {img.url.toLowerCase().endsWith(".mp4") ? (
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
                        <img src={img.url} alt="Immagine" />
                    )}
                    {img.url.toLowerCase().endsWith(".mp4") ? (<svg className='VideoPlayer' aria-label="Reel" class="x1lliihq x1n2onr6 x1hfr7tm xq3z1fi" fill="#fff" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Reel</title><path d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z" fill-rule="evenodd"></path></svg>) : (<></>)}
                </div>
            ))}

            {hasMore && <p className="loading-text"></p>}
        </div>
    );
};

export default Explore;
